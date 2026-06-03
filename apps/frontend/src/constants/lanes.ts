import { TaskStatus } from '@sprint/types'

export const laneTitles: Record<TaskStatus, string> = {
  [TaskStatus.ToDo]: 'To Do',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.Review]: 'Review',
  [TaskStatus.Done]: 'Done',
}

export const laneOrder: TaskStatus[] = [
  TaskStatus.ToDo,
  TaskStatus.InProgress,
  TaskStatus.Review,
  TaskStatus.Done,
]
