import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProblemForm } from '../components/ProblemForm'
import type { Problem } from '../models/problem'

const PROBLEM: Problem = {
  title: 'Two Sum',
  description: 'Find two numbers that add to target.',
  url: 'https://leetcode.com/problems/two-sum/',
  difficulty: 'Easy',
  topic: 'Array',
  dateSolved: '2024-01-15',
  notes: 'Use a hashmap.',
  solution: null,
}

describe('ProblemForm — add mode', () => {
  it('renders title, description, url, difficulty, topic fields', () => {
    render(<ProblemForm mode="add" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/topic/i)).toBeInTheDocument()
  })

  it('renders Add Problem submit button', () => {
    render(<ProblemForm mode="add" onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /add problem/i })).toBeInTheDocument()
  })

  it('calls onSubmit with form data on submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProblemForm mode="add" onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/title/i), 'Two Sum')
    await userEvent.type(screen.getByLabelText(/description/i), 'Find two numbers')
    await userEvent.type(screen.getByLabelText(/url/i), 'https://leetcode.com/problems/two-sum/')
    await userEvent.type(screen.getByLabelText(/topic/i), 'Array')
    await userEvent.click(screen.getByRole('button', { name: /add problem/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    const args = onSubmit.mock.calls[0][0]
    expect(args.title).toBe('Two Sum')
    expect(args.topic).toBe('Array')
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<ProblemForm mode="add" onSubmit={vi.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows error message when onSubmit rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('409: Conflict'))
    render(<ProblemForm mode="add" onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/title/i), 'Two Sum')
    await userEvent.type(screen.getByLabelText(/description/i), 'desc')
    await userEvent.type(screen.getByLabelText(/url/i), 'https://leetcode.com/problems/two-sum/')
    await userEvent.type(screen.getByLabelText(/topic/i), 'Array')
    await userEvent.click(screen.getByRole('button', { name: /add problem/i }))

    await waitFor(() => expect(screen.getByText(/409: Conflict/i)).toBeInTheDocument())
  })

  it('disables submit button while submitting', async () => {
    let resolve: () => void = () => {}
    const onSubmit = vi.fn().mockReturnValue(new Promise<void>(r => { resolve = r }))
    render(<ProblemForm mode="add" onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByLabelText(/title/i), 'T')
    await userEvent.type(screen.getByLabelText(/description/i), 'D')
    await userEvent.type(screen.getByLabelText(/url/i), 'https://leetcode.com/problems/t/')
    await userEvent.type(screen.getByLabelText(/topic/i), 'X')
    await userEvent.click(screen.getByRole('button', { name: /add problem/i }))

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    resolve()
  })
})

describe('ProblemForm — edit mode', () => {
  it('renders Save Changes submit button', () => {
    render(<ProblemForm mode="edit" problem={PROBLEM} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  it('pre-fills fields with existing problem data', () => {
    render(<ProblemForm mode="edit" problem={PROBLEM} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText(/difficulty/i)).toHaveValue('Easy')
    expect(screen.getByLabelText(/topic/i)).toHaveValue('Array')
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Use a hashmap.')
  })

  it('does not render title, description, url fields in edit mode', () => {
    render(<ProblemForm mode="edit" problem={PROBLEM} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.queryByLabelText(/^title$/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/url/i)).not.toBeInTheDocument()
  })

  it('calls onSubmit with updated values', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ProblemForm mode="edit" problem={PROBLEM} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.clear(screen.getByLabelText(/notes/i))
    await userEvent.type(screen.getByLabelText(/notes/i), 'New notes')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit.mock.calls[0][0].notes).toBe('New notes')
  })
})
