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

const card = (overrides = {}) =>
  <ProblemCard problem={PROBLEM} onView={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} {...overrides} />

describe('ProblemCard', () => {
  it('renders problem title', () => {
    render(card())
    expect(screen.getByText('Two Sum')).toBeInTheDocument()
  })

  it('renders difficulty badge', () => {
    render(card())
    expect(screen.getByText('Easy')).toBeInTheDocument()
  })

  it('renders topic', () => {
    render(card())
    expect(screen.getByText('Array')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(card())
    expect(screen.getByText(/Find two numbers/i)).toBeInTheDocument()
  })

  it('renders LeetCode link with correct href', () => {
    render(card())
    expect(screen.getByRole('link', { name: /leetcode/i })).toHaveAttribute('href', PROBLEM.url)
  })

  it('renders dateSolved when present', () => {
    render(card())
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('renders notes when present', () => {
    render(card())
    expect(screen.getByText(/Use a hashmap/i)).toBeInTheDocument()
  })

  it('does not render date when dateSolved is null', () => {
    render(card({ problem: { ...PROBLEM, dateSolved: null } }))
    expect(screen.queryByText('2024-01-15')).not.toBeInTheDocument()
  })

  it('does not render notes section when notes is null', () => {
    render(card({ problem: { ...PROBLEM, notes: null } }))
    expect(screen.queryByText(/Use a hashmap/i)).not.toBeInTheDocument()
  })

  it('renders solution', () => {
    render(card())
    expect(screen.getByText('Hash map for O(n) lookup.')).toBeInTheDocument()
  })

  it('keeps solution content inside a fixed scrollable region', () => {
    render(card({ problem: { ...PROBLEM, solution: 'Line\n\n'.repeat(40) } }))
    expect(screen.getByLabelText('Solution for Two Sum')).toHaveClass('h-36', 'overflow-y-auto')
  })

  it('keeps notes content inside a fixed scrollable region', () => {
    render(card({ problem: { ...PROBLEM, notes: 'Long note. '.repeat(80) } }))
    expect(screen.getByLabelText('Notes for Two Sum')).toHaveClass('h-20', 'overflow-y-auto')
  })

  it('calls onView with the problem when the card is clicked', async () => {
    const onView = vi.fn()
    render(card({ onView }))
    await userEvent.click(screen.getByRole('article'))
    expect(onView).toHaveBeenCalledWith(PROBLEM)
  })

  it('calls onEdit with the problem when edit button is clicked', async () => {
    const onEdit = vi.fn()
    render(card({ onEdit }))
    await userEvent.click(screen.getByRole('button', { name: /edit two sum/i }))
    expect(onEdit).toHaveBeenCalledWith(PROBLEM)
  })

  it('does not call onView when the edit button is clicked', async () => {
    const onView = vi.fn()
    render(card({ onView }))
    await userEvent.click(screen.getByRole('button', { name: /edit two sum/i }))
    expect(onView).not.toHaveBeenCalled()
  })

  it('calls onDelete with the title when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(card({ onDelete }))
    await userEvent.click(screen.getByRole('button', { name: /delete two sum/i }))
    expect(onDelete).toHaveBeenCalledWith('Two Sum')
  })

  it('does not call onView when the delete button is clicked', async () => {
    const onView = vi.fn()
    render(card({ onView }))
    await userEvent.click(screen.getByRole('button', { name: /delete two sum/i }))
    expect(onView).not.toHaveBeenCalled()
  })
})
