import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProblemList } from '../components/ProblemList'
import type { Problem } from '../models/problem'

const PROBLEMS: Problem[] = [
  {
    title: 'Two Sum',
    description: 'Return indices of two numbers that add to target.',
    url: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    topic: 'Array',
    solution: 'Hash map for O(n) lookup.',
    dateSolved: '2024-01-15',
    notes: null,
  },
  {
    title: 'Add Two Numbers',
    description: 'Add two numbers represented as linked lists.',
    url: 'https://leetcode.com/problems/add-two-numbers/',
    difficulty: 'Medium',
    topic: 'Linked List',
    solution: 'Iterative carry approach.',
    dateSolved: null,
    notes: null,
  },
]

describe('ProblemList', () => {
  it('shows a loading spinner when loading', () => {
    render(<ProblemList problems={[]} loading={true} error={null} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows error message when error is present', () => {
    render(<ProblemList problems={[]} loading={false} error="Network error" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/Network error/i)).toBeInTheDocument()
  })

  it('shows empty state message when no problems', () => {
    render(<ProblemList problems={[]} loading={false} error={null} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/No problems found/i)).toBeInTheDocument()
  })

  it('renders all problem cards', () => {
    render(<ProblemList problems={PROBLEMS} loading={false} error={null} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
    expect(screen.getByText('Add Two Numbers')).toBeInTheDocument()
  })

  it('does not show spinner when not loading', () => {
    render(<ProblemList problems={PROBLEMS} loading={false} error={null} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('does not show error state when error is null', () => {
    render(<ProblemList problems={PROBLEMS} loading={false} error={null} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/Network error/i)).not.toBeInTheDocument()
  })
})
