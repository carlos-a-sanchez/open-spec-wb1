import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

import App from './App'
import { app as backendApp } from '../../backend/src/app.ts'
import { resetStore } from '../../backend/src/store/memory.ts'
import { setApiBaseUrl } from './api/kanbanClient'

describe('App integration (frontend + real backend)', () => {
  let server: ReturnType<typeof createServer>
  const originalFetch = globalThis.fetch

  beforeAll(async () => {
    server = createServer(backendApp)
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const { port } = server.address() as AddressInfo
        const baseUrl = `http://127.0.0.1:${port}`
        setApiBaseUrl(baseUrl)
        resolve()
      })
    })

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      if (!init?.signal) {
        return originalFetch(input, init)
      }

      const rest: RequestInit = { ...init }
      delete rest.signal
      return originalFetch(input, rest)
    }) as typeof fetch
  })

  afterAll(async () => {
    globalThis.fetch = originalFetch

    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  })

  beforeEach(() => {
    resetStore()
  })

  it('loads seeded tasks from the API and allows creating a new task', async () => {
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/wire kanban layout/i)).toBeInTheDocument()
    })

    const newTaskTrigger = screen.getByRole('button', { name: /new task/i })
    fireEvent.click(newTaskTrigger)

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Integration smoke task' },
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Created via integration test harness' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save task/i }))

    await waitFor(() => {
      expect(screen.getByText('Integration smoke task')).toBeInTheDocument()
    })
  })
})
