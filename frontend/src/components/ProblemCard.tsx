import { ExternalLink, Pencil, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Badge } from './ui/Badge'
import type { Problem } from '../models/problem'

interface ProblemCardProps {
  problem: Problem
  onEdit: (problem: Problem) => void
  onDelete: (title: string) => void
}

export function ProblemCard({ problem, onEdit, onDelete }: ProblemCardProps) {
  return (
    <article className="h-[32rem] bg-card rounded-xl p-5 border border-surface hover:border-accent/40 transition-colors duration-200 cursor-pointer group flex flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 shrink-0">
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

      <p className="mt-3 h-11 text-sm text-text-muted line-clamp-2 shrink-0">{problem.description}</p>

      <div className="mt-4 flex items-center justify-between gap-2 shrink-0">
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

      <div className="mt-3 border-t border-surface pt-3 space-y-1.5 shrink-0">
        <p className="text-xs font-medium text-text-muted">Solution</p>
        <div
          className="prose-solution h-36 overflow-y-auto rounded-lg bg-bg/40 p-3 text-xs text-text-muted"
          aria-label={`Solution for ${problem.title}`}
        >
          <ReactMarkdown
            components={{
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ borderRadius: '0.5rem', fontSize: '0.75rem', margin: 0 }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-surface px-1 py-0.5 rounded text-accent">{children}</code>
                )
              },
              p({ children }) {
                return <p className="text-xs text-text-muted mb-1 last:mb-0">{children}</p>
              },
            }}
          >
            {problem.solution}
          </ReactMarkdown>
        </div>
      </div>

      {problem.notes && (
        <div className="mt-3 border-t border-surface pt-3 shrink-0">
          <p className="text-xs font-medium text-text-muted">Notes</p>
          <p
            className="mt-1.5 h-20 overflow-y-auto rounded-lg bg-bg/40 p-3 text-xs text-text-muted italic"
            aria-label={`Notes for ${problem.title}`}
          >
            {problem.notes}
          </p>
        </div>
      )}
    </article>
  )
}
