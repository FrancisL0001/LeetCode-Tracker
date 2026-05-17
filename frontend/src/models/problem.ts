export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Problem {
  title: string
  description: string
  url: string
  difficulty: Difficulty
  topic: string
  dateSolved: string | null
  notes: string | null
  solution: string | null
}

export interface ProblemCreate {
  title: string
  description: string
  url: string
  difficulty: Difficulty
  topic: string
  dateSolved?: string | null
  notes?: string | null
  solution?: string | null
}

export interface ProblemUpdate {
  difficulty?: Difficulty
  notes?: string | null
  solution?: string | null
  dateSolved?: string | null
  topic?: string
}

export interface Stats {
  totalProblems: number
  problemsByDifficulty: Record<Difficulty, number>
  problemsByTopic: Record<string, number>
}

export interface ProblemFilters {
  title?: string
  topic?: string
  skip?: number
  limit?: number
}

export interface StatsFilters {
  topic?: string
  start_date?: string
  end_date?: string
}
