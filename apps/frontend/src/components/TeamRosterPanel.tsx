import { useId, useState, type FormEvent } from 'react'

import type { TeamMember } from '@sprint/types'

type TeamRosterPanelProps = {
  team: TeamMember[]
  onAdd: (name: string) => Promise<unknown>
  onRemove: (memberId: string) => Promise<unknown>
}

export const TeamRosterPanel = ({ team, onAdd, onRemove }: TeamRosterPanelProps) => {
  const [name, setName] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const nameInputId = useId()

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAddError(null)

    if (!name.trim()) {
      setAddError('Name is required')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd(name)
      setName('')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add member'
      setAddError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemove = async (memberId: string) => {
    setRemoveError(null)
    setRemovingId(memberId)

    try {
      await onRemove(memberId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to remove member'
      setRemoveError(message)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Team roster</p>
          <h2 className="font-display text-xl text-white">Team roster</h2>
        </div>
      </div>

      <form className="mt-4 space-y-3" onSubmit={handleAdd}>
        <label htmlFor={nameInputId} className="text-sm font-semibold text-white">
          Team member name
        </label>
        <div className="flex gap-2">
          <input
            id={nameInputId}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 rounded-2xl border border-white/15 bg-transparent px-4 py-2 text-white focus:border-lagoon focus:outline-none"
            placeholder="e.g. Grace Hopper"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full border border-transparent bg-lagoon px-4 py-2 text-sm font-semibold text-ink-900 shadow-panel transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Adding…' : 'Add member'}
          </button>
        </div>
        {addError && (
          <p className="text-sm text-lilac" role="alert">
            {addError}
          </p>
        )}
      </form>

      <ul className="mt-6 space-y-3" aria-label="team members">
        {team.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between rounded-2xl border border-white/15 bg-ink-900/60 px-4 py-3 text-white"
          >
            <div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-slate-400">{member.id}</p>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(member.id)}
              disabled={removingId === member.id}
              data-testid={`remove-member-${member.id}`}
              className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-lilac hover:text-lilac disabled:cursor-not-allowed disabled:opacity-60"
            >
              {removingId === member.id ? 'Removing…' : `Remove ${member.name}`}
            </button>
          </li>
        ))}
      </ul>

      {removeError && (
        <p className="mt-4 text-sm text-lilac" role="alert">
          {removeError}
        </p>
      )}
    </aside>
  )
}
