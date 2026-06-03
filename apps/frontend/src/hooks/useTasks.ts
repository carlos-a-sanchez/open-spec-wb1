import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TaskStatus, type Task, type TaskDraft, type TeamMember } from '@sprint/types'

import {
  createTask as createTaskRequest,
  createTeamMember as createTeamMemberRequest,
  deleteTeamMember as deleteTeamMemberRequest,
  fetchTasks,
  fetchTeamMembers,
  updateTask as updateTaskRequest,
} from '../api/kanbanClient'

const laneStatuses: TaskStatus[] = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Review, TaskStatus.Done]

const createEmptyBoard = (): Record<TaskStatus, Task[]> => ({
  [TaskStatus.ToDo]: [],
  [TaskStatus.InProgress]: [],
  [TaskStatus.Review]: [],
  [TaskStatus.Done]: [],
})

const arraysEqual = (a: Task[], b: Task[]) => a.length === b.length && a.every((task, index) => task === b[index])

const createOptimisticId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `optimistic-${crypto.randomUUID()}`
  }
  return `optimistic-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const previousGroupsRef = useRef<Record<TaskStatus, Task[]>>(createEmptyBoard())

  const loadBoardData = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const [nextTasks, nextTeam] = await Promise.all([fetchTasks(signal), fetchTeamMembers(signal)])

      if (signal?.aborted) {
        return
      }

      setTasks(nextTasks)
      setTeam(nextTeam)
    } catch (error) {
      if (signal?.aborted) {
        return
      }

      const message = error instanceof Error ? error.message : 'Failed to load board data'
      setLoadError(message)
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial hydration must kick off immediately on mount
    void loadBoardData(controller.signal)

    return () => {
      controller.abort()
    }
  }, [loadBoardData])

  const refresh = useCallback(async () => {
    await loadBoardData()
  }, [loadBoardData])

  /* eslint-disable react-hooks/refs -- we intentionally read/write the memo ref synchronously here
   * to reuse lane arrays when their contents have not changed (requirement 3.9 performance ask).
   */
  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const nextGroups = createEmptyBoard()
    tasks.forEach((task) => {
      nextGroups[task.status].push(task)
    })

    const previous = previousGroupsRef.current
    laneStatuses.forEach((status) => {
      if (arraysEqual(previous[status], nextGroups[status])) {
        nextGroups[status] = previous[status]
      }
    })

    previousGroupsRef.current = nextGroups
    return nextGroups
  }, [tasks])
  /* eslint-enable react-hooks/refs */

  const teamById = useMemo<Record<string, TeamMember>>(() => {
    return team.reduce<Record<string, TeamMember>>((acc, member) => {
      acc[member.id] = member
      return acc
    }, {})
  }, [team])

  const moveTask = useCallback(
    async (taskId: string, status: TaskStatus) => {
      let previousTasks: Task[] = []
      setTasks((prev) => {
        previousTasks = prev
        return prev.map((task) => (task.id === taskId ? { ...task, status } : task))
      })

      try {
        await updateTaskRequest(taskId, { status })
      } catch (error) {
        setTasks(previousTasks)
        throw error
      }
    },
    [],
  )

  const createTask = useCallback(
    async (draft: TaskDraft) => {
      const createdTask = await createTaskRequest(draft)
      setTasks((prev) => [...prev, createdTask])
      return createdTask
    },
    [],
  )

  const addTeamMember = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) {
      throw new Error('Name is required')
    }

    const optimisticMember: TeamMember = {
      id: createOptimisticId(),
      name: trimmed,
    }
    setTeam((prev) => [...prev, optimisticMember])

    try {
      const member = await createTeamMemberRequest(trimmed)
      setTeam((prev) => prev.map((existing) => (existing.id === optimisticMember.id ? member : existing)))
      return member
    } catch (error) {
      setTeam((prev) => prev.filter((existing) => existing.id !== optimisticMember.id))
      throw error
    }
  }, [])

  const deleteTeamMember = useCallback(async (memberId: string) => {
    let removedMember: TeamMember | null = null
    let removedIndex = -1

    setTeam((prev) => {
      const index = prev.findIndex((member) => member.id === memberId)
      if (index === -1) {
        return prev
      }
      removedMember = prev[index]
      removedIndex = index
      return [...prev.slice(0, index), ...prev.slice(index + 1)]
    })

    try {
      await deleteTeamMemberRequest(memberId)
    } catch (error) {
      if (removedMember) {
        setTeam((prev) => {
          const next = [...prev]
          const index = removedIndex >= 0 && removedIndex <= next.length ? removedIndex : next.length
          next.splice(index, 0, removedMember as TeamMember)
          return next
        })
      }
      throw error
    }
  }, [])

  return {
    tasks,
    team,
    teamById,
    tasksByStatus,
    moveTask,
    createTask,
    addTeamMember,
    deleteTeamMember,
    isLoading,
    loadError,
    refresh,
  }
}

export type UseTasksResult = ReturnType<typeof useTasks>
