import { Search, X } from 'lucide-react'
import type { ProblemFilters } from '../models/problem'

interface FilterBarProps {
  filters: ProblemFilters
  onChange: (f: ProblemFilters) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const hasFilters = !!(filters.title || filters.topic)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" aria-hidden />
        <input
          type="search"
          placeholder="Search by title…"
          value={filters.title ?? ''}
          onChange={e => onChange({ ...filters, title: e.target.value || undefined })}
          className="w-full bg-card border border-surface rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent transition-colors duration-200"
          aria-label="Filter by title"
        />
      </div>

      <input
        type="text"
        placeholder="Filter by topic…"
        value={filters.topic ?? ''}
        onChange={e => onChange({ ...filters, topic: e.target.value || undefined })}
        className="bg-card border border-surface rounded-lg px-3 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent transition-colors duration-200 w-44"
        aria-label="Filter by topic"
      />

      {hasFilters && (
        <button
          onClick={() => onChange({})}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface rounded-lg transition-colors duration-200 cursor-pointer"
          aria-label="Clear filters"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  )
}
