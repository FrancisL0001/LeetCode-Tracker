import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useProblemPresenter } from './presenters/useProblemPresenter'
import { useStatsPresenter } from './presenters/useStatsPresenter'
import { ProblemList } from './components/ProblemList'
import { FilterBar } from './components/FilterBar'
import { StatsPanel } from './components/StatsPanel'
import { ProblemForm } from './components/ProblemForm'
import { ProblemDetail } from './components/ProblemDetail'
import { Modal } from './components/ui/Modal'
import type { Problem } from './models/problem'

export default function App() {
  const problemPresenter = useProblemPresenter()
  const statsPresenter = useStatsPresenter()
  const [showAdd, setShowAdd] = useState(false)
  const [viewing, setViewing] = useState<Problem | null>(null)
  const [editing, setEditing] = useState<Problem | null>(null)

  const handleDelete = async (title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    await problemPresenter.removeProblem(title)
    // Stats and problems are independent presenters; mutations on one don't auto-update the other
    statsPresenter.refresh()
  }

  const handleAdd = async (data: Parameters<typeof problemPresenter.addProblem>[0]) => {
    await problemPresenter.addProblem(data)
    statsPresenter.refresh()
    setShowAdd(false)
  }

  const handleEdit = async (data: Parameters<typeof problemPresenter.editProblem>[1]) => {
    if (!editing) return
    await problemPresenter.editProblem(editing.title, data)
    statsPresenter.refresh()
    setEditing(null)
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-surface sticky top-0 z-30 bg-bg/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text">LeetCode Tracker</h1>
            <p className="text-xs text-text-muted">Track your progress</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer min-h-[44px]"
          >
            <Plus size={16} aria-hidden />
            Add Problem
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <StatsPanel stats={statsPresenter.stats} loading={statsPresenter.loading} error={statsPresenter.error} />

        <div className="space-y-4">
          <FilterBar filters={problemPresenter.filters} onChange={problemPresenter.setFilters} />
          <ProblemList
            problems={problemPresenter.problems}
            loading={problemPresenter.loading}
            error={problemPresenter.error}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {showAdd && (
        <Modal title="Add Problem" onClose={() => setShowAdd(false)}>
          <ProblemForm mode="add" onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {viewing && (
        <ProblemDetail
          problem={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null) }}
        />
      )}

      {editing && (
        <Modal title="Edit Problem" onClose={() => setEditing(null)}>
          <ProblemForm mode="edit" problem={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  )
}
