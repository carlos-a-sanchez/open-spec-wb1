import { Router } from 'express'
import { z } from 'zod'

import { TaskStatus, taskStatusSchema } from '@sprint/types'

import { StoredTask, tasks, teamMembers } from '../store/memory'
import { extractIssues } from '../utils/validation'

const router = Router()

const taskDraftSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().optional(),
  status: taskStatusSchema,
  assignedTo: z.string().optional(),
})

const taskUpdateSchema = z
  .object({
    status: taskStatusSchema.optional(),
    assignedTo: z.string().optional(),
  })
  .refine((data) => data.status !== undefined || data.assignedTo !== undefined, {
    message: 'At least one field must be provided',
    path: ['payload'],
  })

const memberExists = (memberId?: string) =>
  typeof memberId === 'string' && teamMembers.some((member) => member.id === memberId)

const ensureAssignee = (assignedTo: string | undefined) => {
  if (!assignedTo) {
    return { ok: true as const }
  }

  if (!memberExists(assignedTo)) {
    return {
      ok: false as const,
      error: `assignedTo: Team member ${assignedTo} not found`,
    }
  }

  return { ok: true as const }
}

router.post('/', (req, res) => {
  const parseResult = taskDraftSchema.safeParse(req.body)

  if (!parseResult.success) {
    return res.status(400).json({
      error: extractIssues(parseResult.error.issues),
    })
  }

  const assigneeCheck = ensureAssignee(parseResult.data.assignedTo)
  if (!assigneeCheck.ok) {
    return res.status(400).json({ error: assigneeCheck.error })
  }

  const task: StoredTask = {
    id: String(tasks.length + 1),
    ...parseResult.data,
  }

  tasks.push(task)

  return res.status(201).json(task)
})

router.get('/', (_req, res) => {
  return res.status(200).json(tasks)
})

router.patch('/:id', (req, res) => {
  const { id } = req.params
  const parseResult = taskUpdateSchema.safeParse(req.body)

  if (!parseResult.success) {
    return res.status(400).json({
      error: extractIssues(parseResult.error.issues),
    })
  }

  const taskIndex = tasks.findIndex((task) => task.id === id)

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${id} not found` })
  }

  const assigneeCheck = ensureAssignee(parseResult.data.assignedTo)
  if (!assigneeCheck.ok) {
    return res.status(400).json({ error: assigneeCheck.error })
  }

  const nextStatus = parseResult.data.status ?? tasks[taskIndex].status
  const nextAssignedTo =
    parseResult.data.assignedTo !== undefined
      ? (parseResult.data.assignedTo as string | undefined)
      : tasks[taskIndex].assignedTo

  const updatedTask: StoredTask = {
    ...tasks[taskIndex],
    status: nextStatus as TaskStatus,
    assignedTo: nextAssignedTo,
  }

  tasks[taskIndex] = updatedTask

  return res.status(200).json(updatedTask)
})

export { router as tasksRouter }
