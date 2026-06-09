import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  PieChart, Pie, Tooltip as PieTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as BarTooltip, CartesianGrid,
} from 'recharts'
import { Spinner } from './ui/Spinner'
import { Modal } from './ui/Modal'
import type { Stats } from '../models/problem'

interface StatsPanelProps {
  stats: Stats | null
  loading: boolean
  error: string | null
}

const DIFFICULTY_COLORS = { Easy: '#22C55E', Medium: '#EAB308', Hard: '#EF4444' }
const DIFFICULTY_LABEL_COLORS = { Easy: 'text-green-400', Medium: 'text-yellow-400', Hard: 'text-red-400' }

export function StatsPanel({ stats, loading, error }: StatsPanelProps) {
  const [showTopics, setShowTopics] = useState(false)

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>
  if (error) return <p className="text-red-400 text-sm py-4">{error}</p>
  if (!stats) return null

  const pieData = (['Easy', 'Medium', 'Hard'] as const).map(d => ({
    name: d,
    value: stats.problemsByDifficulty[d] ?? 0,
    fill: stats.problemsByDifficulty[d] ? DIFFICULTY_COLORS[d] : `${DIFFICULTY_COLORS[d]}33`,
  }))

  const allTopics = Object.entries(stats.problemsByTopic)
    .map(([topic, counts]) => ({
      topic,
      Easy: counts.Easy ?? 0,
      Medium: counts.Medium ?? 0,
      Hard: counts.Hard ?? 0,
      total: (counts.Easy ?? 0) + (counts.Medium ?? 0) + (counts.Hard ?? 0),
    }))
    .sort((a, b) => b.total - a.total)

  const previewTopics = allTopics.slice(0, 3)
  const extraCount = allTopics.length - previewTopics.length
  const hasTopics = allTopics.length > 0

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-card rounded-xl p-5 border border-surface flex flex-col justify-center">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Total Solved</p>
          <p className="text-4xl font-bold text-text">{stats.totalProblems}</p>
        </div>

        <div className="bg-card rounded-xl p-5 border border-surface">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">By Difficulty</p>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  strokeWidth={0}
                />
                <PieTooltip
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem', fontSize: '0.75rem' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-1">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className={`text-xs font-medium ${DIFFICULTY_LABEL_COLORS[d.name]}`}>{d.name}</span>
                </div>
                {/* testid needed: plain numbers would be ambiguous across difficulty rows in queries */}
                <span className="text-xs font-semibold text-text" data-testid={`difficulty-${d.name.toLowerCase()}`}>
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => hasTopics && setShowTopics(true)}
          disabled={!hasTopics}
          className="bg-card rounded-xl p-5 border border-surface text-left transition-colors duration-200 cursor-pointer hover:border-accent/40 disabled:cursor-default disabled:hover:border-surface"
          aria-label="View all topics"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Top Topics</p>
            {hasTopics && <ChevronRight size={14} className="text-text-muted" />}
          </div>
          {!hasTopics ? (
            <p className="text-sm text-text-muted">No data yet</p>
          ) : (
            <div className="space-y-2">
              {previewTopics.map(({ topic, total }) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted truncate">{topic}</span>
                  <span className="text-sm font-semibold text-text ml-2 shrink-0">{total}</span>
                </div>
              ))}
              {extraCount > 0 && (
                <p className="text-xs text-text-muted pt-1">+{extraCount} more — click to see all</p>
              )}
            </div>
          )}
        </button>
      </div>

      {showTopics && (
        <Modal title="Topics Breakdown" onClose={() => setShowTopics(false)} wide>
          <div className="h-[28rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={allTopics}
                layout="vertical"
                margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="topic"
                  width={130}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <BarTooltip
                  contentStyle={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '0.5rem', fontSize: '0.75rem' }}
                  itemStyle={{ color: '#F8FAFC' }}
                  cursor={{ fill: '#334155' }}
                />
                <Bar dataKey="Easy" stackId="stack" fill="#22C55E" name="Easy" />
                <Bar dataKey="Medium" stackId="stack" fill="#EAB308" name="Medium" />
                <Bar dataKey="Hard" stackId="stack" fill="#EF4444" name="Hard" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Modal>
      )}
    </>
  )
}
