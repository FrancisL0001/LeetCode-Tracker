import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Badge } from './ui/Badge'
import type { Problem } from '../models/problem'

interface ProblemCardProps {
  problem: Problem
  onEdit: (problem: Problem) => void
  onDelete: (title: string) => void
}

export function ProblemCard({ problem, onEdit, onDelete }: ProblemCardProps) {
  return (
    <article className="bg-card rounded-xl p-5 border border-surface hover:border-accent/40 transition-colors duration-200 cursor-pointer group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-text truncate">{problem.title}</h3>
            <Badge difficulty={problem.difficulty} />
          </div>
          <span className="text-xs text-text-muted font-medium">{problem.topic}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(problem)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors duration-200 cursor-pointer"
            aria-label={`Edit ${problem.title}`}
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(problem.title)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors duration-200 cursor-pointer"
            aria-label={`Delete ${problem.title}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-muted line-clamp-2">{problem.description}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-colors duration-200 cursor-pointer"
          aria-label={`Open ${problem.title} on LeetCode`}
        >
          <ExternalLink size={12} />
          LeetCode
        </a>
        {problem.dateSolved && (
          <time className="text-xs text-text-muted" dateTime={problem.dateSolved}>
            {problem.dateSolved}
          </time>
        )}
      </div>

      <div className="mt-3 border-t border-surface pt-3 space-y-1.5">
        <p className="text-xs font-medium text-text-muted">Solution</p>
        <p className="text-xs text-text-muted">{problem.solution}</p>
      </div>

      {problem.notes && (
        <p className="mt-3 text-xs text-text-muted italic border-t border-surface pt-3">{problem.notes}</p>
      )}
    </article>
  )
}
