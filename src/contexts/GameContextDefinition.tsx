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
  startGameWithState: (gameState: GameState) => void
  handlePlayerAction: (action: string, target?: Player) => void
  startNextPlayerTurn: () => void
  moveToNextPlayer: () => void
  startNextRound: () => void
  startVoting: () => void
  processVoting: (targets: Player[]) => void
  startNextGame: () => void
  startNextGameAndClear: () => void
  clearGame: () => void
}

export const GameContext = createContext<GameContextType | null>(null)
