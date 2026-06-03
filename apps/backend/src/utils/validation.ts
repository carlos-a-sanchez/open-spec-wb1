import { z } from 'zod'

export const extractIssues = (issues: z.ZodIssue[]) =>
  issues
    .map((issue) => {
      const field = issue.path.join('.') || 'payload'
      return `${field}: ${issue.message}`
    })
    .join(', ')
