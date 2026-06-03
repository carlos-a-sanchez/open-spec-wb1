import { useCallback, useMemo, useState } from 'react'

import { DndContext, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'

import { TaskStatus, type Task, type TaskDraft, type TeamMember } from '@sprint/types'

import { useTasks } from './hooks/useTasks'
import { DraggableTaskCard } from './components/DraggableTaskCard'
import { createDragEndHandler, type MoveTaskFn } from './utils/dragHandlers'
import { laneOrder, laneTitles } from './constants/lanes'
import { TaskFormModal } from './components/TaskFormModal'
import { TeamRosterPanel } from './components/TeamRosterPanel'

type LaneFilter = TaskStatus | 'all'

const filterOptions: { label: string; value: LaneFilter }[] = [
  { label: 'All lanes', value: 'all' },
  ...laneOrder.map((status) => ({ label: laneTitles[status], value: status })),
]

function App() {
  const {
    tasksByStatus,
    teamById,
    moveTask,
    team,
    createTask,
    addTeamMember,
    deleteTeamMember,
    isLoading,
    loadError,
    refresh,
  } = useTasks()
  const [activeLane, setActiveLane] = useState<LaneFilter>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragEnd = useMemo(() => createDragEndHandler(moveTask), [moveTask])
  const filteredLaneOrder = useMemo(() => {
    if (activeLane === 'all') {
      return laneOrder
    }
    return laneOrder.filter((status) => status === activeLane)
  }, [activeLane])

  const handleCreateTask = useCallback(
    async (draft: TaskDraft) => {
      await createTask(draft)
    },
    [createTask],
  )

  const isActionDisabled = isLoading || Boolean(loadError)

  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10 text-slate-100">
      <header className="flex flex-col gap-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Sprint flow</p>
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">
            Four-lane Kanban board for agile experiments
          </h1>
          <p className="text-base text-slate-300">
            Keep work visible across To Do, In Progress, Review, and Done lanes. Drag, drop, and plan
            confidently with a board designed for clarity.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterOptions.map((option) => {
            const isActive = option.value === activeLane
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveLane(option.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-transparent bg-lilac text-ink-900 shadow-panel'
                    : 'border-white/20 bg-white/5 text-slate-200 hover:border-white/50'
                }`}
              >
                {option.label}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            disabled={isActionDisabled}
            className={`rounded-full border border-transparent px-4 py-1.5 text-sm font-semibold text-ink-900 shadow-panel transition ${
              isActionDisabled ? 'bg-lagoon/40 text-ink-800 opacity-60' : 'bg-lagoon hover:brightness-110'
            }`}
          >
            New Task
          </button>
        </div>
      </header>
      {loadError ? (
        <div
          role="alert"
          className="rounded-3xl border border-lilac/40 bg-ink-900/50 p-6 text-center shadow-panel"
        >
          <h2 className="font-display text-xl text-white">Unable to load the board</h2>
          <p className="mt-2 text-sm text-slate-300">{loadError}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-4 rounded-full border border-lilac px-4 py-2 text-sm font-semibold text-lilac transition hover:bg-lilac/10"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="relative" aria-busy={isLoading} aria-live="polite">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-ink-900/75 text-sm font-semibold text-slate-200 backdrop-blur-sm">
              Loading board…
            </div>
          )}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid gap-5 lg:grid-cols-[3fr_1.2fr]" aria-label="kanban and roster">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" role="list" aria-label="kanban lanes">
                {filteredLaneOrder.map((status) => {
                  const title = laneTitles[status]
                  const tasks = tasksByStatus[status] ?? []
                  const isMuted = activeLane !== 'all' && activeLane !== status

                  return (
                    <LaneColumn
                      key={status}
                      status={status}
                      title={title}
                      tasks={tasks}
                      muted={isMuted}
                      teamById={teamById}
                      moveTask={moveTask}
                    />
                  )
                })}
              </div>
              <TeamRosterPanel
                team={team}
                onAdd={addTeamMember}
                onRemove={deleteTeamMember}
              />
            </div>
          </DndContext>
        </div>
      )}
      <TaskFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        team={team}
        onSubmit={handleCreateTask}
      />
    </main>
  )
}

type LaneColumnProps = {
  status: TaskStatus
  title: string
  tasks: Task[]
  teamById: Record<string, TeamMember>
  muted: boolean
  moveTask: MoveTaskFn
}

const LaneColumn = ({ status, title, tasks, teamById, muted, moveTask }: LaneColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: status })

  return (
    <section
      ref={setNodeRef}
      aria-label={`${title} lane`}
      className={`group flex flex-col gap-4 rounded-3xl border bg-white/5 p-4 backdrop-blur-sm transition ${
        muted ? 'opacity-50 grayscale contrast-75 border-white/8' : 'shadow-panel border-white/8'
      } ${isOver ? 'border-lagoon/60 bg-white/10' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-white">{title}</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">
          {tasks.length} tasks
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-3" role="list">
        {tasks.map((task) => (
          <li key={task.id}>
            <DraggableTaskCard
              task={task}
              assignee={task.assignedTo ? teamById[task.assignedTo] : undefined}
              onMove={moveTask}
            />
          </li>
        ))}

        {tasks.length === 0 && (
          <li className="rounded-2xl border border-dashed border-white/15 bg-white/0 p-4 text-sm text-slate-400">
            Drop a task here to get things moving.
          </li>
        )}
      </ul>
    </section>
  )
}

export default App
