import { useState, useEffect, useCallback } from 'react'
import { getProblems, createProblem, updateProblem, deleteProblem } from '../api/api'
import type { Problem, ProblemCreate, ProblemUpdate, ProblemFilters } from '../models/problem'

export interface ProblemPresenter {
  problems: Problem[]
  loading: boolean
  error: string | null
  filters: ProblemFilters
  setFilters: (f: ProblemFilters) => void
  addProblem: (data: ProblemCreate) => Promise<void>
  editProblem: (title: string, data: ProblemUpdate) => Promise<void>
  removeProblem: (title: string) => Promise<void>
  refresh: () => void
}

export function useProblemPresenter(): ProblemPresenter {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProblemFilters>({})

  // useCallback stabilises load's identity so the useEffect below doesn't re-fire on every render
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProblems(filters)
      setProblems(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load problems')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  const addProblem = async (data: ProblemCreate) => {
    await createProblem(data)
    await load()
  }

  const editProblem = async (title: string, data: ProblemUpdate) => {
    await updateProblem(title, data)
    await load()
  }

  const removeProblem = async (title: string) => {
    await deleteProblem(title)
    await load()
  }

  return { problems, loading, error, filters, setFilters, addProblem, editProblem, removeProblem, refresh: load }
}
