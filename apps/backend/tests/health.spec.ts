import request from 'supertest'

import { app } from '../src/app'

describe('health check', () => {
  it('responds with ok', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ ok: true })
  })
})
