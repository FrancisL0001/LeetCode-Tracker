import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProblemDetail } from '../components/ProblemDetail'
import type { Problem } from '../models/problem'

const PROBLEM: Problem = {
  title: 'Two Sum',
  description: 'Find two numbers that add to target.',
  url: 'https://leetcode.com/problems/two-sum/',
  difficulty: 'Easy',
  topic: 'Array',
  solution: 'Hash map for O(n) lookup.',
  dateSolved: '2024-01-15',
  notes: 'Use a hashmap.',
}

const detail = (overrides = {}) =>
  <ProblemDetail problem={PROBLEM} onClose={vi.fn()} onEdit={vi.fn()} {...overrides} />

describe('ProblemDetail', () => {
  it('renders the problem title in the modal header', () => {
    render(detail())
    expect(screen.getByRole('heading', { name: 'Two Sum' })).toBeInTheDocument()
  })

  it('renders the difficulty badge', () => {
    render(detail())
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('renders the topic', () => {
    render(detail())
    expect(screen.getByText('Array')).toBeInTheDocument()
  })

  it('renders the full description without truncation', () => {
    render(detail())
    expect(screen.getByText('Find two numbers that add to target.')).toBeInTheDocument()
  })

  it('renders the solution', () => {
    render(detail())
    expect(screen.getByText('Hash map for O(n) lookup.')).toBeInTheDocument()
  })

  it('renders notes when present', () => {
    render(detail())
    expect(screen.getByText('Use a hashmap.')).toBeInTheDocument()
  })

  it('does not render notes section when notes is null', () => {
    render(detail({ problem: { ...PROBLEM, notes: null } }))
    expect(screen.queryByText('Use a hashmap.')).not.toBeInTheDocument()
  })

  it('renders the date solved', () => {
    render(detail())
    expect(screen.getByText(/2024-01-15/)).toBeInTheDocument()
  })

  it('renders a link to LeetCode', () => {
    render(detail())
    expect(screen.getByRole('link', { name: /view on leetcode/i })).toHaveAttribute('href', PROBLEM.url)
  })

  it('calls onClose when the X button is clicked', async () => {
    const onClose = vi.fn()
    render(detail({ onClose }))
    await userEvent.click(screen.getByRole('button', { name: /close dialog/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onEdit when the Edit button is clicked', async () => {
    const onEdit = vi.fn()
    render(detail({ onEdit }))
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(onEdit).toHaveBeenCalledOnce()
  })
})
