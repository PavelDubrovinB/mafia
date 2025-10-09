import { createContext } from 'react'

import { GameState, Player } from '../types/game'

export interface GameContextType {
  gameState: GameState | null
  roundResults: string | null
  showNextPlayerScreen: boolean
  votingPhase: boolean
  isVotingResults: boolean
  currentPlayer: Player | null
  winner: string | null
  donKilled: boolean
  donChecked: boolean
  donCheckResult: string | null
  sheriffCheckResult: string | null
  startGame: (playerCount: number) => void
  handlePlayerAction: (action: string, target?: Player) => void
  startNextPlayerTurn: () => void
  startNextRound: () => void
  startVoting: () => void
  processVoting: (target: Player) => void
  startNextGame: () => void
  startNextGameAndClear: () => void
  clearGame: () => void
}

export const GameContext = createContext<GameContextType | null>(null)
