import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useState } from 'react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../components/FilterBar'
import type { ProblemFilters } from '../models/problem'

// FilterBar is controlled; without local state the input stays at its initial value and
// onChange only ever receives the last typed character, not the accumulated string.
function StatefulFilterBar({ onChange }: { onChange?: (f: ProblemFilters) => void }) {
  const [filters, setFilters] = useState<ProblemFilters>({})
  return (
    <FilterBar
      filters={filters}
      onChange={(f) => {
        setFilters(f)
        onChange?.(f)
      }}
    />
  )
}

describe('FilterBar', () => {
  it('renders title search input', () => {
    render(<FilterBar filters={{}} onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox', { name: /filter by title/i })).toBeInTheDocument()
  })

  it('renders topic filter input', () => {
    render(<FilterBar filters={{}} onChange={vi.fn()} />)
    expect(screen.getByRole('textbox', { name: /filter by topic/i })).toBeInTheDocument()
  })

  it('calls onChange with title when user types in search', async () => {
    const onChange = vi.fn()
    render(<StatefulFilterBar onChange={onChange} />)
    await userEvent.type(screen.getByRole('searchbox', { name: /filter by title/i }), 'Two')
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ title: 'Two' }))
  })

  it('calls onChange with topic when user types topic filter', async () => {
    const onChange = vi.fn()
    render(<StatefulFilterBar onChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox', { name: /filter by topic/i }), 'Array')
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ topic: 'Array' }))
  })

  it('shows clear button when filters are active', () => {
    render(<FilterBar filters={{ title: 'Two Sum' }} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('hides clear button when no filters are active', () => {
    render(<FilterBar filters={{}} onChange={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
  })

  it('calls onChange with empty object when clear is clicked', async () => {
    const onChange = vi.fn()
    render(<FilterBar filters={{ title: 'Two Sum', topic: 'Array' }} onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(onChange).toHaveBeenCalledWith({})
  })

  it('pre-fills inputs with current filter values', () => {
    render(<FilterBar filters={{ title: 'Two Sum', topic: 'Array' }} onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox', { name: /filter by title/i })).toHaveValue('Two Sum')
    expect(screen.getByRole('textbox', { name: /filter by topic/i })).toHaveValue('Array')
  })
})
