import { randomUUID } from 'node:crypto'

import { Router } from 'express'
import { z } from 'zod'

import { teamMembers, tasks } from '../store/memory'
import { extractIssues } from '../utils/validation'

const router = Router()

const memberSchema = z.object({
  name: z.string().min(1, 'name is required'),
})

router.get('/', (_req, res) => {
  return res.status(200).json(teamMembers)
})

router.post('/', (req, res) => {
  const parseResult = memberSchema.safeParse(req.body)

  if (!parseResult.success) {
    return res.status(400).json({
      error: extractIssues(parseResult.error.issues),
    })
  }

  const member = {
    id: randomUUID(),
    name: parseResult.data.name,
  }

  teamMembers.push(member)

  return res.status(201).json(member)
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  const memberIndex = teamMembers.findIndex((member) => member.id === id)

  if (memberIndex === -1) {
    return res.status(404).json({ error: `Team member ${id} not found` })
  }

  const assignedTasks = tasks.filter((task) => task.assignedTo === id)
  if (assignedTasks.length > 0) {
    return res.status(409).json({
      error: `assignedTo: Team member ${id} is assigned to existing tasks`,
    })
  }

  teamMembers.splice(memberIndex, 1)
  return res.status(204).send()
})

export { router as teamRouter }
