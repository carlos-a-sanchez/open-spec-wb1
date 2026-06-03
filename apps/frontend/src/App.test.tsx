import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import App from './App'
import type { UseTasksResult } from './hooks/useTasks'
import { TaskStatus, type Task, type TeamMember } from '@sprint/types'

const seedTeam = [
  { id: 'a', name: 'Ada Lovelace' },
  { id: 'b', name: 'Barbara Liskov' },
]

const longDescription =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. '

const seedTasks: Task[] = [
  { id: '1', title: 'Todo Item', description: longDescription, status: TaskStatus.ToDo, assignedTo: seedTeam[0].id },
  { id: '2', title: 'In Progress Work', description: '...', status: TaskStatus.InProgress },
  { id: '3', title: 'Needs Review', description: '...', status: TaskStatus.Review },
  { id: '4', title: 'Done Task', description: '...', status: TaskStatus.Done },
]

const moveTaskMock = vi.fn()
const createTaskMock = vi.fn().mockResolvedValue({ id: '99', title: 'Mock Task', status: TaskStatus.ToDo })
const addTeamMemberMock = vi.fn().mockResolvedValue({ id: 'new-id', name: 'Grace Hopper' })
const deleteTeamMemberMock = vi.fn().mockResolvedValue(undefined)
const refreshMock = vi.fn()

const tasksByStatus = {
  [TaskStatus.ToDo]: [seedTasks[0]],
  [TaskStatus.InProgress]: [seedTasks[1]],
  [TaskStatus.Review]: [seedTasks[2]],
  [TaskStatus.Done]: [seedTasks[3]],
}

const mockUseTasks = vi.fn()

vi.mock('./hooks/useTasks', () => ({
  useTasks: () => mockUseTasks(),
}))

const mapTeamById = (team: TeamMember[]) => {
  return team.reduce<Record<string, TeamMember>>((acc, member) => {
    acc[member.id] = member
    return acc
  }, {})
}

const buildUseTasksValue = (overrides: Partial<UseTasksResult> = {}): UseTasksResult => {
  const resolvedTeam = overrides.team ?? seedTeam

  return {
    tasks: overrides.tasks ?? seedTasks,
    tasksByStatus: overrides.tasksByStatus ?? tasksByStatus,
    teamById: overrides.teamById ?? mapTeamById(resolvedTeam),
    team: resolvedTeam,
    moveTask: moveTaskMock,
    createTask: createTaskMock,
    addTeamMember: addTeamMemberMock,
    deleteTeamMember: deleteTeamMemberMock,
    isLoading: false,
    loadError: null,
    refresh: refreshMock,
    ...overrides,
  }
}

beforeEach(() => {
  moveTaskMock.mockClear()
  createTaskMock.mockClear()
  addTeamMemberMock.mockClear()
  deleteTeamMemberMock.mockClear()
  refreshMock.mockClear()
  mockUseTasks.mockImplementation(() => buildUseTasksValue())
})

const renderApp = () => {
  try {
    return render(<App />)
  } catch (error) {
    console.error('Render failed', error)
    throw error
  }
}

const openTaskForm = () => {
  const triggers = screen.getAllByRole('button', { name: /new task/i })
  fireEvent.click(triggers[0])
}

describe('Kanban lanes', () => {
  it('renders To Do, In Progress, Review, and Done lanes with seeded tasks', () => {
    renderApp()

    expect(screen.getByRole('heading', { level: 2, name: /^to do$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^in progress$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^review$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /^done$/i })).toBeInTheDocument()

    expect(screen.getByText('Todo Item')).toBeInTheDocument()
    expect(screen.getByText('In Progress Work')).toBeInTheDocument()
    expect(screen.getByText('Needs Review')).toBeInTheDocument()
    expect(screen.getByText('Done Task')).toBeInTheDocument()
  })

  it('renders the workflow lanes in the correct left-to-right order', () => {
    renderApp()

    const laneRegions = screen.getAllByRole('region', { name: /lane$/i })
    const orderedTitles = laneRegions.map((region) =>
      region.querySelector('h2')?.textContent?.trim(),
    )

    expect(orderedTitles.slice(0, 4)).toEqual(['To Do', 'In Progress', 'Review', 'Done'])
  })

  it('shows TaskCard title, truncated description, and assignee initials', () => {
    renderApp()

    const cards = screen.getAllByRole('article', { name: /todo item/i })
    expect(cards.length).toBeGreaterThan(0)

    const truncatedCopy = longDescription.slice(0, 120).trimEnd() + '…'
    const matchingDescription = screen.getAllByText(truncatedCopy)
    expect(matchingDescription.length).toBeGreaterThan(0)

    const assigneeBadges = screen.getAllByLabelText(/assigned to Ada Lovelace/i)
    expect(assigneeBadges.length).toBeGreaterThan(0)
  })

  it('provides keyboard move controls that trigger status changes', () => {
    renderApp()

    const moveButtons = screen.getAllByTestId('move-task-1-InProgress')
    fireEvent.click(moveButtons[0])

    expect(moveTaskMock).toHaveBeenCalledWith('1', TaskStatus.InProgress)
  })

  describe('task form requirements', () => {
    it('prevents submission without a title', () => {
      renderApp()
      openTaskForm()

      const submitButton = screen.getByRole('button', { name: /save task/i })
      fireEvent.click(submitButton)

      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })

    it('defaults status select to To Do', () => {
      renderApp()
      openTaskForm()

      const statusSelect = screen.getByLabelText(/status/i) as HTMLSelectElement
      expect(statusSelect.value).toBe(TaskStatus.ToDo)
    })

    it('populates assignee dropdown from team roster', () => {
      renderApp()
      openTaskForm()

      const assigneeSelect = screen.getByLabelText(/assignee/i)
      const optionList = within(assigneeSelect)

      seedTeam.forEach((member) => {
        expect(optionList.getByRole('option', { name: member.name })).toBeInTheDocument()
      })
    })
  })

  describe('team roster management', () => {
    it('lists existing members and exposes an add form', () => {
      renderApp()

      expect(screen.getAllByRole('heading', { name: /team roster/i }).length).toBeGreaterThan(0)
      seedTeam.forEach((member) => {
        expect(screen.getAllByText(member.name)[0]).toBeInTheDocument()
      })

      expect(screen.getAllByLabelText(/team member name/i).length).toBeGreaterThan(0)
      expect(screen.getAllByRole('button', { name: /add member/i }).length).toBeGreaterThan(0)
    })

    it('submits a new member name and clears the input', async () => {
      renderApp()

      const nameInput = screen.getAllByLabelText(/team member name/i)[0] as HTMLInputElement
      const addButton = screen.getAllByRole('button', { name: /add member/i })[0]

      fireEvent.change(nameInput, { target: { value: 'Grace Hopper' } })
      fireEvent.click(addButton)

      await waitFor(() => expect(addTeamMemberMock).toHaveBeenCalledWith('Grace Hopper'))
      expect(nameInput.value).toBe('')
    })

    it('shows an inline error when removing an assigned member fails', async () => {
      deleteTeamMemberMock.mockRejectedValueOnce(new Error('Cannot remove assigned member'))
      renderApp()

      const removeButtons = screen.getAllByRole('button', { name: /remove/i })
      fireEvent.click(removeButtons[0])

      await waitFor(() => expect(deleteTeamMemberMock).toHaveBeenCalled())
      expect(screen.getByText(/cannot remove assigned member/i)).toBeInTheDocument()
    })
  })

  it('renders an error panel when the board fails to load', () => {
    const errorMessage = 'Failed to load board data'
    mockUseTasks.mockImplementation(() => buildUseTasksValue({ loadError: errorMessage }))

    renderApp()

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)
    expect(refreshMock).toHaveBeenCalled()
  })
})
