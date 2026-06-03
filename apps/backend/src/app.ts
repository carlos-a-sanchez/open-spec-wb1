import express, { Request, Response } from 'express'

import { tasksRouter } from './routes/tasks.route'
import { teamRouter } from './routes/team.route'
import { resetStore } from './store/memory'

const app = express()

app.use(express.json())

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true })
})

app.use('/tasks', tasksRouter)
app.use('/team-members', teamRouter)

if (process.env.NODE_ENV !== 'production') {
  app.post('/testing/reset', (_req: Request, res: Response) => {
    resetStore()
    res.status(204).send()
  })
}

export { app }
