import type { Problem, ProblemCreate, ProblemUpdate, Stats, ProblemFilters, StatsFilters } from '../models/problem'

// Vite strips env vars that don't start with VITE_ at build time
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status}: ${body}`)
  }
  // DELETE returns 204 No Content — no JSON body to parse
  if (res.status === 204) return undefined as T
  return res.json()
}

export function getProblems(filters: ProblemFilters = {}): Promise<Problem[]> {
  const params = new URLSearchParams()
  if (filters.title) params.set('title', filters.title)
  if (filters.topic) params.set('topic', filters.topic)
  if (filters.skip != null) params.set('skip', String(filters.skip))
  if (filters.limit != null) params.set('limit', String(filters.limit))
  const qs = params.toString()
  return request<Problem[]>(`/problems/${qs ? `?${qs}` : ''}`)
}

export function createProblem(data: ProblemCreate): Promise<Problem> {
  return request<Problem>('/problems/', { method: 'POST', body: JSON.stringify(data) })
}

export function updateProblem(title: string, data: ProblemUpdate): Promise<Problem> {
  return request<Problem>('/problems/', {
    method: 'PUT',
    body: JSON.stringify({ title, ...data }),
  })
}

export function deleteProblem(title: string): Promise<void> {
  return request<void>('/problems/', {
    method: 'DELETE',
    body: JSON.stringify({ title }),
  })
}

export function getStats(filters: StatsFilters = {}): Promise<Stats> {
  const params = new URLSearchParams()
  if (filters.topic) params.set('topic', filters.topic)
  if (filters.start_date) params.set('start_date', filters.start_date)
  if (filters.end_date) params.set('end_date', filters.end_date)
  const qs = params.toString()
  return request<Stats>(`/problems/stats${qs ? `?${qs}` : ''}`)
}
