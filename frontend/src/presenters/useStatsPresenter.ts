import { useState, useEffect, useCallback } from 'react'
import { getStats } from '../api/api'
import type { Stats, StatsFilters } from '../models/problem'

export interface StatsPresenter {
  stats: Stats | null
  loading: boolean
  error: string | null
  filters: StatsFilters
  setFilters: (f: StatsFilters) => void
  refresh: () => void
}

export function useStatsPresenter(): StatsPresenter {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<StatsFilters>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getStats(filters)
      setStats(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    load()
  }, [load])

  return { stats, loading, error, filters, setFilters, refresh: load }
}
