import { Spinner } from './ui/Spinner'
import type { Stats } from '../models/problem'

interface StatsPanelProps {
  stats: Stats | null
  loading: boolean
  error: string | null
}

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
}

export function StatsPanel({ stats, loading, error }: StatsPanelProps) {
  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>
  if (error) return <p className="text-red-400 text-sm py-4">{error}</p>
  if (!stats) return null

  const topTopics = Object.entries(stats.problemsByTopic)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="bg-card rounded-xl p-5 border border-surface col-span-full sm:col-span-1">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Total Solved</p>
        <p className="text-4xl font-bold text-text">{stats.totalProblems}</p>
      </div>

      <div className="bg-card rounded-xl p-5 border border-surface">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">By Difficulty</p>
        <div className="space-y-2">
          {(['Easy', 'Medium', 'Hard'] as const).map(d => (
            <div key={d} className="flex items-center justify-between">
              <span className={`text-sm font-medium ${DIFFICULTY_COLORS[d]}`}>{d}</span>
              {/* testid needed: plain numbers would be ambiguous across difficulty rows in queries */}
              <span
                className="text-sm font-semibold text-text"
                data-testid={`difficulty-${d.toLowerCase()}`}
              >
                {stats.problemsByDifficulty[d] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-xl p-5 border border-surface">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Top Topics</p>
        {topTopics.length === 0 ? (
          <p className="text-sm text-text-muted">No data yet</p>
        ) : (
          <div className="space-y-2">
            {topTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center justify-between">
                <span className="text-sm text-text-muted truncate">{topic}</span>
                <span className="text-sm font-semibold text-text ml-2 shrink-0">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
