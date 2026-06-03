import request from 'supertest'

import { TaskStatus } from '@sprint/types'

import { app } from '../../src/app'

const createTask = async (overrides: Partial<{ title: string; status: TaskStatus }> = {}) => {
  const basePayload = {
    title: 'Task for update flow',
    status: TaskStatus.ToDo,
  }

  const response = await request(app).post('/tasks').send({ ...basePayload, ...overrides })

  expect(response.status).toBe(201)
  return response.body
}

describe('PATCH /tasks/:id status transitions', () => {
  it('updates status when payload is valid', async () => {
    const task = await createTask()

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ status: TaskStatus.Review })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: task.id,
      status: TaskStatus.Review,
    })
  })

  it('rejects invalid status values on update', async () => {
    const task = await createTask()

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ status: 'Blocked' })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: expect.stringContaining('status'),
    })
  })

  it('rejects assignedTo updates referencing unknown team members', async () => {
    const task = await createTask()

    const response = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ assignedTo: 'ghost-member-id' })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: expect.stringContaining('assignedTo'),
    })
  })
})
