import { useId, useState } from 'react'

import { TaskStatus } from '@sprint/types'
import type { Task, TeamMember } from '@sprint/types'

import type { MoveTaskFn } from '../utils/dragHandlers'

const MAX_DESCRIPTION_LENGTH = 120

const truncateDescription = (text?: string) => {
  if (!text) {
    return 'No description provided yet.'
  }

  if (text.length <= MAX_DESCRIPTION_LENGTH) {
    return text
  }

  return text.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd() + '…'
}

const deriveInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('')
}

const statusCopy: Record<TaskStatus, string> = {
  [TaskStatus.ToDo]: 'To Do',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Review]: 'Review',
  [TaskStatus.Done]: 'Done',
}

export type TaskCardProps = {
  task: Task
  assignee?: TeamMember
  onMove?: MoveTaskFn
}

const nextStatuses: Partial<Record<TaskStatus, TaskStatus[]>> = {
  [TaskStatus.ToDo]: [TaskStatus.InProgress, TaskStatus.Review],
  [TaskStatus.InProgress]: [TaskStatus.Review, TaskStatus.Done],
  [TaskStatus.Review]: [TaskStatus.InProgress, TaskStatus.Done],
  [TaskStatus.Done]: [TaskStatus.Review],
}

export const TaskCard = ({ task, assignee, onMove }: TaskCardProps) => {
  const description = truncateDescription(task.description)
  const initials = assignee ? deriveInitials(assignee.name) : null
  const statusLabel = statusCopy[task.status]
  const availableMoves = onMove ? nextStatuses[task.status] ?? [] : []
  const [announcement, setAnnouncement] = useState<string>('')
  const liveRegionId = useId()

  return (
    <article
      aria-label={`${task.title} card`}
      data-description={description}
      className="rounded-2xl border border-white/10 bg-ink-900/70 p-4 shadow-inner shadow-black/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">{statusLabel}</p>
          <h3 className="text-base font-semibold text-white">{task.title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
        {initials ? (
          <span
            aria-label={`Assigned to ${assignee?.name}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white"
          >
            {initials}
          </span>
        ) : (
          <span className="rounded-full border border-dashed border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-slate-400">
            Unassigned
          </span>
        )}
      </div>
      {availableMoves.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {availableMoves.map((status) => (
            <button
              key={status}
              type="button"
              data-testid={`move-task-${task.id}-${status}`}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-lagoon hover:text-lagoon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lagoon"
              onClick={() => {
                onMove?.(task.id, status)
                setAnnouncement(`${task.title} moved to ${statusCopy[status]}`)
              }}
            >
              Move to {statusCopy[status]}
            </button>
          ))}
        </div>
      )}
      <span id={liveRegionId} role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </article>
  )
}
