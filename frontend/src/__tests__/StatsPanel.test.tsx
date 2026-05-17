import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsPanel } from '../components/StatsPanel'
import type { Stats } from '../models/problem'

const STATS: Stats = {
  totalProblems: 10,
  problemsByDifficulty: { Easy: 5, Medium: 3, Hard: 2 },
  problemsByTopic: { Array: 4, 'Dynamic Programming': 3, Graph: 2, Tree: 1 },
}

describe('StatsPanel', () => {
  it('shows a loading spinner when loading', () => {
    render(<StatsPanel stats={null} loading={true} error={null} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows error message when error is present', () => {
    render(<StatsPanel stats={null} loading={false} error="Failed to load stats" />)
    expect(screen.getByText(/Failed to load stats/i)).toBeInTheDocument()
  })

  it('renders nothing when stats is null and not loading', () => {
    const { container } = render(<StatsPanel stats={null} loading={false} error={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders total problem count', () => {
    render(<StatsPanel stats={STATS} loading={false} error={null} />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders Easy difficulty count', () => {
    render(<StatsPanel stats={STATS} loading={false} error={null} />)
    expect(screen.getByTestId('difficulty-easy')).toHaveTextContent('5')
  })

  it('renders Medium difficulty count', () => {
    render(<StatsPanel stats={STATS} loading={false} error={null} />)
    expect(screen.getByTestId('difficulty-medium')).toHaveTextContent('3')
  })

  it('renders Hard difficulty count', () => {
    render(<StatsPanel stats={STATS} loading={false} error={null} />)
    expect(screen.getByTestId('difficulty-hard')).toHaveTextContent('2')
  })

  it('renders top topics', () => {
    render(<StatsPanel stats={STATS} loading={false} error={null} />)
    expect(screen.getByText('Array')).toBeInTheDocument()
    expect(screen.getByText('Dynamic Programming')).toBeInTheDocument()
  })

  it('shows at most 5 topics', () => {
    const manyTopics: Stats = {
      ...STATS,
      problemsByTopic: { A: 6, B: 5, C: 4, D: 3, E: 2, F: 1 },
    }
    render(<StatsPanel stats={manyTopics} loading={false} error={null} />)
    expect(screen.queryByText('F')).not.toBeInTheDocument()
  })

  it('shows no data message when topic map is empty', () => {
    render(<StatsPanel stats={{ ...STATS, problemsByTopic: {} }} loading={false} error={null} />)
    expect(screen.getByText(/No data yet/i)).toBeInTheDocument()
  })
})
