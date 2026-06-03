import type { DragEndEvent } from '@dnd-kit/core'
import { describe, expect, it, vi } from 'vitest'

import { TaskStatus } from '@sprint/types'

import { createDragEndHandler } from './dragHandlers'

const buildEvent = ({
  taskId = 'task-1',
  startStatus = TaskStatus.ToDo,
  targetStatus = TaskStatus.InProgress,
  hasTarget = true,
}: {
  taskId?: string
  startStatus?: TaskStatus
  targetStatus?: TaskStatus
  hasTarget?: boolean
}): DragEndEvent => {
  const over = hasTarget ? { id: targetStatus } : null

  const event: Partial<DragEndEvent> = {
    active: {
      id: taskId,
      data: {
        current: { status: startStatus },
      },
      rect: {} as never,
    },
    delta: { x: 0, y: 0 },
    over: over as DragEndEvent['over'],
    activatorEvent: {} as never,
    collisions: [],
  }

  return event as DragEndEvent
}

describe('createDragEndHandler', () => {
  it('moves task when dropped into a different lane', async () => {
    const moveTask = vi.fn()
    const handleDragEnd = createDragEndHandler(moveTask)

    await handleDragEnd(buildEvent({ startStatus: TaskStatus.ToDo, targetStatus: TaskStatus.Done }))

    expect(moveTask).toHaveBeenCalledWith('task-1', TaskStatus.Done)
  })

  it('ignores drops without a destination or with same lane', async () => {
    const moveTask = vi.fn()
    const handleDragEnd = createDragEndHandler(moveTask)

    await handleDragEnd(buildEvent({ hasTarget: false }))
    await handleDragEnd(buildEvent({ startStatus: TaskStatus.Review, targetStatus: TaskStatus.Review }))

    expect(moveTask).not.toHaveBeenCalled()
  })
})
