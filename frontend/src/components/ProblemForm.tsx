import { useState } from 'react'
import type { Problem, ProblemCreate, ProblemUpdate, Difficulty } from '../models/problem'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

interface AddProps {
  mode: 'add'
  onSubmit: (data: ProblemCreate) => Promise<void>
  onCancel: () => void
}

interface EditProps {
  mode: 'edit'
  problem: Problem
  onSubmit: (data: ProblemUpdate) => Promise<void>
  onCancel: () => void
}

// Discriminated union: TypeScript narrows props (and onSubmit signature) based on mode
type ProblemFormProps = AddProps | EditProps

export function ProblemForm(props: ProblemFormProps) {
  const initial = props.mode === 'edit' ? props.problem : null

  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [url, setUrl] = useState(initial?.url ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? 'Easy')
  const [topic, setTopic] = useState(initial?.topic ?? '')
  const [solution, setSolution] = useState(initial?.solution ?? '')
  const [dateSolved, setDateSolved] = useState(initial?.dateSolved ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (props.mode === 'add') {
        await props.onSubmit({
          title,
          description,
          url,
          difficulty,
          topic,
          solution,
          dateSolved: dateSolved || null,
          notes: notes || null,
        })
      } else {
        await props.onSubmit({
          difficulty,
          solution: solution || undefined,
          notes: notes || null,
          dateSolved: dateSolved || null,
          topic,
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = 'w-full bg-bg border border-surface rounded-lg px-3 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent transition-colors duration-200'
  const labelClass = 'block text-sm font-medium text-text-muted mb-1'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {props.mode === 'add' && (
          <>
            <div>
              <label htmlFor="title" className={labelClass}>Title</label>
              <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={fieldClass} placeholder="Two Sum" required />
            </div>
            <div>
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className={`${fieldClass} resize-none`} rows={3} placeholder="Brief problem description" required />
            </div>
            <div>
              <label htmlFor="url" className={labelClass}>LeetCode URL</label>
              <input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} className={fieldClass} placeholder="https://leetcode.com/problems/..." required />
            </div>
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className={labelClass}>Difficulty</label>
            <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} className={`${fieldClass} cursor-pointer`}>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="topic" className={labelClass}>Topic</label>
            <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} className={fieldClass} placeholder="Array" required />
          </div>
        </div>

        <div>
          <label htmlFor="solution" className={labelClass}>
            Solution{props.mode === 'add' && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          <textarea id="solution" value={solution} onChange={e => setSolution(e.target.value)} className={`${fieldClass} resize-none`} rows={2} placeholder="Approach description or link to solution (e.g. GitHub Gist)" required={props.mode === 'add'} />
        </div>

        <div>
          <label htmlFor="dateSolved" className={labelClass}>Date Solved</label>
          <input id="dateSolved" type="date" value={dateSolved} onChange={e => setDateSolved(e.target.value)} className={`${fieldClass} cursor-pointer`} />
        </div>

        <div>
          <label htmlFor="notes" className={labelClass}>Notes</label>
          <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className={`${fieldClass} resize-none`} rows={3} placeholder="Approach, edge cases, time complexity..." />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={props.onCancel}
          className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors duration-200 cursor-pointer"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-semibold bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : props.mode === 'add' ? 'Add Problem' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
