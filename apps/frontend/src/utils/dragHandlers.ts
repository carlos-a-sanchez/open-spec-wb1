import type { DragEndEvent } from '@dnd-kit/core'
import { TaskStatus } from '@sprint/types'

export type MoveTaskFn = (taskId: string, status: TaskStatus) => Promise<void> | void

export const createDragEndHandler = (moveTask: MoveTaskFn) => {
  return async (event: DragEndEvent) => {
    const { active, over } = event
    if (!active || !over) {
      return
    }

    const nextStatus = over.id as TaskStatus | undefined
    const currentStatus = active.data.current?.status as TaskStatus | undefined
    const taskId = String(active.id)

    if (!nextStatus || !taskId || nextStatus === currentStatus) {
      return
    }

    await moveTask(taskId, nextStatus)
  }
}
