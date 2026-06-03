import type { Task, TaskDraft, TeamMember } from '@sprint/types'

let apiBaseUrl = import.meta.env?.VITE_API_URL ?? '/api'

export const setApiBaseUrl = (url: string) => {
  apiBaseUrl = url
}

const readPayload = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return null
  }

  const text = await response.text().catch(() => '')
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const extractErrorMessage = (payload: unknown, fallbackMessage: string) => {
  if (payload && typeof payload === 'object' && 'error' in (payload as Record<string, unknown>)) {
    const maybeError = (payload as Record<string, unknown>).error
    if (typeof maybeError === 'string') {
      return maybeError
    }
  }
  return fallbackMessage
}

const handleResponse = async <T>(response: Response, fallbackMessage: string): Promise<T> => {
  const payload = await readPayload(response)

  if (!response.ok) {
    const message = extractErrorMessage(payload, fallbackMessage)
    throw new Error(message)
  }

  return payload as T
}

export const fetchTasks = (signal?: AbortSignal) => {
  return fetch(`${apiBaseUrl}/tasks`, { signal }).then((response) =>
    handleResponse<Task[]>(response, 'Failed to load tasks'),
  )
}

export const createTask = (draft: TaskDraft) => {
  return fetch(`${apiBaseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  }).then((response) => handleResponse<Task>(response, 'Failed to create task'))
}

export const updateTask = (taskId: string, patch: Partial<Pick<Task, 'status' | 'assignedTo'>>) => {
  return fetch(`${apiBaseUrl}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  }).then((response) => handleResponse<Task>(response, 'Failed to update task'))
}

export const fetchTeamMembers = (signal?: AbortSignal) => {
  return fetch(`${apiBaseUrl}/team-members`, { signal }).then((response) =>
    handleResponse<TeamMember[]>(response, 'Failed to load team roster'),
  )
}

export const createTeamMember = (name: string) => {
  return fetch(`${apiBaseUrl}/team-members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  }).then((response) => handleResponse<TeamMember>(response, 'Failed to add member'))
}

export const deleteTeamMember = (memberId: string) => {
  return fetch(`${apiBaseUrl}/team-members/${memberId}`, {
    method: 'DELETE',
  }).then((response) => handleResponse<null>(response, 'Failed to remove member'))
}
