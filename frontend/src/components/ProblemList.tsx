import { Spinner } from './ui/Spinner'
import { ProblemCard } from './ProblemCard'
import type { Problem } from '../models/problem'

interface ProblemListProps {
  problems: Problem[]
  loading: boolean
  error: string | null
  onView: (problem: Problem) => void
  onEdit: (problem: Problem) => void
  onDelete: (title: string) => void
}

export function ProblemList({ problems, loading, error, onView, onEdit, onDelete }: ProblemListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-sm">No problems found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {problems.map(p => (
        <ProblemCard key={p.title} problem={p} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
