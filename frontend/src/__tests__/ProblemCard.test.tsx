import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProblemCard } from '../components/ProblemCard'
import type { Problem } from '../models/problem'

const PROBLEM: Problem = {
  title: 'Two Sum',
  description: 'Find two numbers that add to target.',
  url: 'https://leetcode.com/problems/two-sum/',
  difficulty: 'Easy',
  topic: 'Array',
  solution: 'Hash map for O(n) lookup.',
  dateSolved: '2024-01-15',
  notes: 'Use a hashmap for O(n) time.',
}

describe('ProblemCard', () => {
  it('renders problem title', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
  })

  it('renders difficulty badge', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('renders topic', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Array')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/Find two numbers/i)).toBeInTheDocument()
  })

  it('renders LeetCode link with correct href', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    const link = screen.getByRole('link', { name: /leetcode/i })
    expect(link).toHaveAttribute('href', PROBLEM.url)
  })

  it('renders dateSolved when present', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('renders notes when present', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/Use a hashmap/i)).toBeInTheDocument()
  })

  it('does not render date when dateSolved is null', () => {
    render(<ProblemCard problem={{ ...PROBLEM, dateSolved: null }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('2024-01-15')).not.toBeInTheDocument()
  })

  it('does not render notes section when notes is null', () => {
    render(<ProblemCard problem={{ ...PROBLEM, notes: null }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText(/Use a hashmap/i)).not.toBeInTheDocument()
  })

  it('renders solution', () => {
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Hash map for O(n) lookup.')).toBeInTheDocument()
  })

  it('keeps solution content inside a fixed scrollable region', () => {
    render(<ProblemCard problem={{ ...PROBLEM, solution: 'Line\n\n'.repeat(40) }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByLabelText('Solution for Two Sum')).toHaveClass('h-36', 'overflow-y-auto')
  })

  it('keeps notes content inside a fixed scrollable region', () => {
    render(<ProblemCard problem={{ ...PROBLEM, notes: 'Long note. '.repeat(80) }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByLabelText('Notes for Two Sum')).toHaveClass('h-20', 'overflow-y-auto')
  })

  it('calls onEdit with the problem when edit button is clicked', async () => {
    const onEdit = vi.fn()
    render(<ProblemCard problem={PROBLEM} onEdit={onEdit} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /edit two sum/i }))
    expect(onEdit).toHaveBeenCalledWith(PROBLEM)
  })

  it('calls onDelete with the title when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<ProblemCard problem={PROBLEM} onEdit={vi.fn()} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /delete two sum/i }))
    expect(onDelete).toHaveBeenCalledWith('Two Sum')
  })
})
