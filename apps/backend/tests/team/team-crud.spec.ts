import request from 'supertest'

import { app } from '../../src/app'

const rosterEndpoint = '/team-members'

const createMember = async (name: string) => {
  const response = await request(app).post(rosterEndpoint).send({ name })
  expect(response.status).toBe(201)
  return response.body
}

describe('Team member management', () => {
  it('creates and lists team members', async () => {
    const member = await createMember('Test Member')

    const listResponse = await request(app).get(rosterEndpoint)

    expect(listResponse.status).toBe(200)
    expect(listResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: member.id, name: 'Test Member' }),
      ]),
    )
  })

  it('prevents deleting members who have assigned tasks', async () => {
    const member = await createMember('Assigned Member')

    const taskResponse = await request(app).post('/tasks').send({
      title: 'Task tied to member',
      status: 'ToDo',
      assignedTo: member.id,
    })
    expect(taskResponse.status).toBe(201)

    const deleteResponse = await request(app).delete(`${rosterEndpoint}/${member.id}`)

    expect(deleteResponse.status).toBe(409)
    expect(deleteResponse.body).toMatchObject({
      error: expect.stringContaining('assigned'),
    })
  })

  it('allows deleting unassigned members', async () => {
    const member = await createMember('Disposable Member')

    const deleteResponse = await request(app).delete(`${rosterEndpoint}/${member.id}`)

    expect(deleteResponse.status).toBe(204)
  })
})
