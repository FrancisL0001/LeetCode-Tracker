import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProblems, createProblem, updateProblem, deleteProblem, getStats } from '../api/api'

const PROBLEM = {
  title: 'Two Sum',
  description: 'Return indices of two numbers that add to target.',
  url: 'https://leetcode.com/problems/two-sum/',
  difficulty: 'Easy' as const,
  topic: 'Array',
  solution: 'Hash map for O(n) lookup.',
  dateSolved: '2024-01-15',
  notes: null,
}

const STATS = {
  totalProblems: 1,
  problemsByDifficulty: { Easy: 1, Medium: 0, Hard: 0 },
  problemsByTopic: { Array: 1 },
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

function mockFetch(data: unknown, status = 200) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: status < 400,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response)
}

describe('getProblems', () => {
  it('fetches problems without filters', async () => {
    mockFetch([PROBLEM])
    const result = await getProblems()
    expect(result).toEqual([PROBLEM])
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/problems/'), expect.any(Object))
  })

  it('appends title filter to query string', async () => {
    mockFetch([PROBLEM])
    await getProblems({ title: 'Two Sum' })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('title=Two+Sum'), expect.any(Object))
  })

  it('appends topic filter to query string', async () => {
    mockFetch([PROBLEM])
    await getProblems({ topic: 'Array' })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('topic=Array'), expect.any(Object))
  })

  it('appends skip and limit to query string', async () => {
    mockFetch([PROBLEM])
    await getProblems({ skip: 5, limit: 10 })
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain('skip=5')
    expect(url).toContain('limit=10')
  })

  it('throws on non-ok response', async () => {
    mockFetch({ detail: 'Not found' }, 404)
    await expect(getProblems()).rejects.toThrow('404')
  })
})

describe('createProblem', () => {
  it('posts the problem and returns it', async () => {
    mockFetch(PROBLEM)
    const result = await createProblem(PROBLEM)
    expect(result).toEqual(PROBLEM)
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'POST' }))
  })

  it('throws on conflict (409)', async () => {
    mockFetch({ detail: 'Conflict' }, 409)
    await expect(createProblem(PROBLEM)).rejects.toThrow('409')
  })
})

describe('updateProblem', () => {
  it('sends PUT with title and update data', async () => {
    const updated = { ...PROBLEM, notes: 'Use hashmap' }
    mockFetch(updated)
    const result = await updateProblem('Two Sum', { notes: 'Use hashmap' })
    expect(result).toEqual(updated)
    const call = vi.mocked(fetch).mock.calls[0]
    expect(call[1]).toMatchObject({ method: 'PUT' })
    const body = JSON.parse((call[1] as RequestInit).body as string)
    expect(body.title).toBe('Two Sum')
    expect(body.notes).toBe('Use hashmap')
  })

  it('throws when problem not found', async () => {
    mockFetch({ detail: 'Not found' }, 404)
    await expect(updateProblem('Ghost', {})).rejects.toThrow('404')
  })
})

describe('deleteProblem', () => {
  it('sends DELETE with title in body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, status: 204 } as Response)
    await deleteProblem('Two Sum')
    const call = vi.mocked(fetch).mock.calls[0]
    expect(call[1]).toMatchObject({ method: 'DELETE' })
    const body = JSON.parse((call[1] as RequestInit).body as string)
    expect(body.title).toBe('Two Sum')
  })

  it('throws when problem not found', async () => {
    mockFetch({ detail: 'Not found' }, 404)
    await expect(deleteProblem('Ghost')).rejects.toThrow('404')
  })
})

describe('getStats', () => {
  it('fetches stats without filters', async () => {
    mockFetch(STATS)
    const result = await getStats()
    expect(result).toEqual(STATS)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/problems/stats'), expect.any(Object))
  })

  it('appends topic filter', async () => {
    mockFetch(STATS)
    await getStats({ topic: 'Array' })
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('topic=Array'), expect.any(Object))
  })

  it('appends date range filters', async () => {
    mockFetch(STATS)
    await getStats({ start_date: '2024-01-01', end_date: '2024-12-31' })
    const url = vi.mocked(fetch).mock.calls[0][0] as string
    expect(url).toContain('start_date=2024-01-01')
    expect(url).toContain('end_date=2024-12-31')
  })
})
