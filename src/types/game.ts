export interface Player {
  id: number
  name: string
  role: Role
  isAlive: boolean
}

export type Role = 'mafia' | 'don' | 'sheriff' | 'civilian'

export interface GameState {
  playerCount: number
  players: Player[]
  currentPlayerIndex: number
  phase: 'setup' | 'role-reveal' | 'game' | 'voting' | 'completed'
  round: number
  alivePlayers: Player[]
}

export const ROLE_DESCRIPTIONS = {
  mafia: 'Мафия',
  don: 'Дон',
  sheriff: 'Шериф',
  civilian: 'Мирный житель',
} as const
