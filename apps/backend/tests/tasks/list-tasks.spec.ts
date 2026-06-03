import request from 'supertest'

import { TaskStatus } from '@sprint/types'

import { app } from '../../src/app'

describe('GET /tasks', () => {
  it('returns the current task collection', async () => {
    const response = await request(app).get('/tasks')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('includes tasks created after startup', async () => {
    const creation = await request(app)
      .post('/tasks')
      .send({ title: 'Recently added task', status: TaskStatus.ToDo })

    expect(creation.status).toBe(201)

    const listResponse = await request(app).get('/tasks')

    expect(listResponse.status).toBe(200)
    expect(listResponse.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: creation.body.id })]),
    )
  })
})
