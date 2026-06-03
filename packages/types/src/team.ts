import { z } from 'zod'

export const teamMemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Team member name is required'),
})

export type TeamMember = z.infer<typeof teamMemberSchema>

export const teamMemberDraftSchema = teamMemberSchema.omit({ id: true })
export type TeamMemberDraft = z.infer<typeof teamMemberDraftSchema>
