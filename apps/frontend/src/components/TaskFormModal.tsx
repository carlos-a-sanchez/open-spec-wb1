import { useId, useState, type FormEvent } from 'react'

import { TaskStatus, type TaskDraft, type TeamMember } from '@sprint/types'

import { laneOrder, laneTitles } from '../constants/lanes'

type TaskFormModalProps = {
  open: boolean
  onClose: () => void
  team: TeamMember[]
  onSubmit: (draft: TaskDraft) => Promise<unknown>
}

const defaultFormState = {
  title: '',
  description: '',
  status: TaskStatus.ToDo,
  assignedTo: '',
}

export const TaskFormModal = ({ open, onClose, team, onSubmit }: TaskFormModalProps) => {
  const [values, setValues] = useState(defaultFormState)
  const [titleError, setTitleError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleId = useId()
  const descriptionId = useId()
  const statusId = useId()
  const assigneeId = useId()

  const resetForm = () => {
    setValues(defaultFormState)
    setTitleError(null)
    setSubmitError(null)
  }

  if (!open) {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTitleError(null)
    setSubmitError(null)

    const trimmedTitle = values.title.trim()
    if (!trimmedTitle) {
      setTitleError('Title is required')
      return
    }

    const draft: TaskDraft = {
      title: trimmedTitle,
      status: values.status,
      description: values.description.trim() || undefined,
      assignedTo: values.assignedTo || undefined,
    }

    setIsSubmitting(true)
    try {
      await onSubmit(draft)
      resetForm()
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save task'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 px-4 py-8 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-panel"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Create task</p>
              <h2 id="task-form-title" className="font-display text-2xl text-white">
                New Task
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-slate-300 hover:border-white/40"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label htmlFor={titleId} className="text-sm font-medium text-white">
                Title
              </label>
              <input
                id={titleId}
                type="text"
                value={values.title}
                onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-white focus:border-lagoon focus:outline-none"
                aria-invalid={titleError ? 'true' : 'false'}
              />
              {titleError && (
                <p className="text-sm text-lilac" role="alert">
                  {titleError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor={descriptionId} className="text-sm font-medium text-white">
                Description
              </label>
              <textarea
                id={descriptionId}
                value={values.description}
                onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
                className="h-28 w-full rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-white focus:border-lagoon focus:outline-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor={statusId} className="text-sm font-medium text-white">
                  Status
                </label>
                <select
                  id={statusId}
                  value={values.status}
                  onChange={(event) =>
                    setValues((prev) => ({ ...prev, status: event.target.value as TaskStatus }))
                  }
                  className="w-full rounded-2xl border border-white/15 bg-ink-900 px-4 py-2 text-white focus:border-lagoon focus:outline-none"
                >
                  {laneOrder.map((status) => (
                    <option key={status} value={status} className="bg-ink-900 text-ink-50">
                      {laneTitles[status]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor={assigneeId} className="text-sm font-medium text-white">
                  Assignee
                </label>
                <select
                  id={assigneeId}
                  value={values.assignedTo}
                  onChange={(event) => setValues((prev) => ({ ...prev, assignedTo: event.target.value }))}
                  className="w-full rounded-2xl border border-white/15 bg-ink-900 px-4 py-2 text-white focus:border-lagoon focus:outline-none"
                >
                  <option value="" className="bg-ink-900 text-ink-50">
                    Unassigned
                  </option>
                  {team.map((member) => (
                    <option key={member.id} value={member.id} className="bg-ink-900 text-ink-50">
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-lilac" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full border border-transparent bg-lilac px-5 py-2 text-sm font-semibold text-ink-900 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
