import { ExternalLink, Pencil } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Badge } from './ui/Badge'
import { SolutionMarkdown } from './ui/SolutionMarkdown'
import type { Problem } from '../models/problem'

interface ProblemDetailProps {
  problem: Problem
  onClose: () => void
  onEdit: () => void
}

export function ProblemDetail({ problem, onClose, onEdit }: ProblemDetailProps) {
  return (
    <Modal title={problem.title} onClose={onClose} wide>
      <div className="space-y-5">
        <div className="flex items-center gap-2 flex-wrap -mt-1">
          <Badge difficulty={problem.difficulty} />
          <span className="text-xs text-text-muted font-medium">{problem.topic}</span>
          {problem.dateSolved && (
            <time className="text-xs text-text-muted ml-auto" dateTime={problem.dateSolved}>
              Solved {problem.dateSolved}
            </time>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-text-muted leading-relaxed">{problem.description}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Solution</p>
          <div className="rounded-lg bg-bg/60 p-3">
            <SolutionMarkdown content={problem.solution} fontSize="0.8125rem" />
          </div>
        </div>

        {problem.notes && (
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Notes</p>
            <p className="text-sm text-text-muted italic leading-relaxed">{problem.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-surface">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-colors duration-200 cursor-pointer"
          >
            <ExternalLink size={12} />
            View on LeetCode
          </a>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-surface hover:bg-accent hover:text-white text-text rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <Pencil size={14} />
            Edit
          </button>
        </div>
      </div>
    </Modal>
  )
}
