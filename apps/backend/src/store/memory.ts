import { Task, TeamMember, createSeedData } from '@sprint/types'

export type StoredTask = Task

export const tasks: StoredTask[] = []
export const teamMembers: TeamMember[] = []

const applySeedData = () => {
  const seed = createSeedData()
  tasks.splice(0, tasks.length, ...seed.tasks)
  teamMembers.splice(0, teamMembers.length, ...seed.team)
}

applySeedData()

export const resetStore = () => {
  applySeedData()
}
