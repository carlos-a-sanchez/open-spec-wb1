import { z } from 'zod'

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Review = 'Review',
  Done = 'Done',
}

export const taskStatusSchema = z.nativeEnum(TaskStatus)

export const taskBaseSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: taskStatusSchema,
  assignedTo: z.string().uuid().optional(),
})

export const taskSchema = taskBaseSchema.extend({
  id: z.string().uuid(),
})

export type Task = z.infer<typeof taskSchema>
export type TaskDraft = z.infer<typeof taskBaseSchema>
