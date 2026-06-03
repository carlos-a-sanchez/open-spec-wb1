import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import type { Task, TeamMember } from '@sprint/types'

import { TaskCard } from './TaskCard'
import type { MoveTaskFn } from '../utils/dragHandlers'

type DraggableTaskCardProps = {
  task: Task
  assignee?: TeamMember
  onMove?: MoveTaskFn
}

export const DraggableTaskCard = ({ task, assignee, onMove }: DraggableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-grab touch-none"
      {...listeners}
      {...attributes}
    >
      <TaskCard task={task} assignee={assignee} onMove={onMove} />
    </div>
  )
}
