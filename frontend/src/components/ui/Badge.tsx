import type { Difficulty } from '../../models/problem'

const COLORS: Record<Difficulty, string> = {
  Easy: 'bg-green-900/50 text-green-400 border border-green-700/50',
  Medium: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50',
  Hard: 'bg-red-900/50 text-red-400 border border-red-700/50',
}

interface BadgeProps {
  difficulty: Difficulty
}

export function Badge({ difficulty }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${COLORS[difficulty]}`}>
      {difficulty}
    </span>
  )
}
