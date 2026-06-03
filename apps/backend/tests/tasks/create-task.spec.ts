import request from 'supertest'

import { TaskStatus } from '@sprint/types'

import { app } from '../../src/app'

describe('POST /tasks validation', () => {
  const endpoint = '/tasks'

  it('rejects missing title', async () => {
    const response = await request(app).post(endpoint).send({
      status: TaskStatus.ToDo,
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: expect.stringContaining('title'),
    })
  })

  it('rejects invalid status enum value', async () => {
    const response = await request(app).post(endpoint).send({
      title: 'Card without valid status',
      status: 'Blocked',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: expect.stringContaining('status'),
    })
  })

  it('rejects assignedTo when team member does not exist', async () => {
    const response = await request(app).post(endpoint).send({
      title: 'Attempt to assign unknown member',
      status: TaskStatus.ToDo,
      assignedTo: 'non-existent-member-id',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: expect.stringContaining('assignedTo'),
    })
  })
})
