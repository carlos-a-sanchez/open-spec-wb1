import { Task, TaskStatus } from './task'
import { TeamMember } from './team'

const generateId = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export type SeedData = {
  tasks: Task[]
  team: TeamMember[]
}

const defaultMembers = (): TeamMember[] => [
  { id: generateId(), name: 'Ada Lovelace' },
  { id: generateId(), name: 'Alan Turing' },
  { id: generateId(), name: 'Grace Hopper' },
]

const defaultTasks = (team: TeamMember[]): Task[] => [
  {
    id: generateId(),
    title: 'Wire Kanban layout',
    description: 'Create four-lane layout and placeholder cards to unblock styling.',
    status: TaskStatus.InProgress,
    assignedTo: team[0]?.id,
  },
  {
    id: generateId(),
    title: 'Seed API scaffolding',
    description: 'Bootstrap Express server with task + team routes.',
    status: TaskStatus.ToDo,
    assignedTo: team[1]?.id,
  },
  {
    id: generateId(),
    title: 'Write drag-and-drop tests',
    description: 'Vitest + RTL coverage for lane transitions.',
    status: TaskStatus.Review,
    assignedTo: team[2]?.id,
  },
]

export const createSeedData = (): SeedData => {
  const team = defaultMembers()
  const tasks = defaultTasks(team)
  return { team, tasks }
}
