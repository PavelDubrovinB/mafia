import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDonLogic } from '../hooks/useDonLogic'
import { useMafiaLogic } from '../hooks/useMafiaLogic'
import { useSheriffLogic } from '../hooks/useSheriffLogic'
import { useVotingLogic } from '../hooks/useVotingLogic'
import { GameState, Player } from '../types/game'
import { createPlayers } from '../utils/gameUtils'

import { GameContext, GameContextType } from './GameContextDefinition'

const STORAGE_KEY = 'mafia-game-state'

interface GameProviderProps {
  children: React.ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to load game state:', error)
      return null
    }
  })
  const [roundResults, setRoundResults] = useState<string | null>(null)
  const [showNextPlayerScreen, setShowNextPlayerScreen] = useState(false)
  const [votingPhase, setVotingPhase] = useState(false)
  const [isVotingResults, setIsVotingResults] = useState(false)

  const navigate = useNavigate()

  const mafiaLogic = useMafiaLogic()
  const donLogic = useDonLogic()
  const sheriffLogic = useSheriffLogic()
  const votingLogic = useVotingLogic()

  const currentPlayer = useMemo(() => {
    if (!gameState || !gameState.alivePlayers.length) return null
    return gameState.alivePlayers[gameState.currentPlayerIndex] || null
  }, [gameState])

  const winner = useMemo(() => {
    if (!gameState) return null
    if (gameState.mafiaAlive === 0) return 'civilians'
    if (gameState.mafiaAlive >= gameState.civiliansAlive + (gameState.sheriffAlive ? 1 : 0)) return 'mafia'
    return null
  }, [gameState])

  const saveToStorage = (state: GameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save game state:', error)
    }
  }

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear game state:', error)
    }
  }

  useEffect(() => {
    if (gameState) {
      return saveToStorage(gameState)
    }

    clearStorage()
  }, [gameState])

  const startGame = (playerCount: number) => {
    const players = createPlayers(playerCount)
    const newGameState: GameState = {
      playerCount,
      players,
      currentPlayerIndex: 0,
      phase: 'game',
      round: 1,
      alivePlayers: players.filter((p) => p.isAlive),
      mafiaAlive: players.filter((p) => (p.role === 'mafia' || p.role === 'don') && p.isAlive).length,
      civiliansAlive: players.filter((p) => p.role === 'civilian' && p.isAlive).length,
      sheriffAlive: players.filter((p) => p.role === 'sheriff' && p.isAlive).length > 0,
    }
    setGameState(newGameState)
    setRoundResults(null)
    setShowNextPlayerScreen(true)
    setVotingPhase(false)
    setIsVotingResults(false)
    mafiaLogic.clearMafiaTargets()
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
  }

  const processRoundResults = () => {
    if (!gameState) return

    const mafiaResult = mafiaLogic.processMafiaKills(gameState.alivePlayers)

    if (mafiaResult) {
      setRoundResults(mafiaResult.message)

      if (mafiaResult.success && mafiaResult.killed) {
        setGameState((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            players: prev.players.map((p) => (p.id === mafiaResult.killed!.id ? { ...p, isAlive: false } : p)),
            alivePlayers: prev.alivePlayers.filter((p) => p.id !== mafiaResult.killed!.id),
            mafiaAlive: prev.players.filter((p) => (p.role === 'mafia' || p.role === 'don') && p.isAlive).length,
            civiliansAlive: prev.players.filter((p) => p.role === 'civilian' && p.isAlive).length,
            sheriffAlive: prev.players.filter((p) => p.role === 'sheriff' && p.isAlive).length > 0,
          }
        })
      }
    }

    mafiaLogic.clearMafiaTargets()
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()

    setGameState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        currentPlayerIndex: 0,
      }
    })
  }

  const startNextPlayerTurn = () => {
    if (!gameState) return

    if (gameState.currentPlayerIndex < gameState.alivePlayers.length - 1) {
      setGameState((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          currentPlayerIndex: prev.currentPlayerIndex + 1,
        }
      })
    } else {
      processRoundResults()
    }
    setShowNextPlayerScreen(false)
  }

  const startNextRound = () => {
    setRoundResults(null)
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
    setVotingPhase(false)
    setIsVotingResults(false)
    setShowNextPlayerScreen(true)
    setGameState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        currentPlayerIndex: 0,
        round: prev.round + 1,
      }
    })
  }

  const startVoting = () => {
    setVotingPhase(true)
    setRoundResults(null)
    setGameState((prev) => {
      if (!prev) return prev
      return { ...prev, currentPlayerIndex: 0 }
    })
  }

  const processVoting = (target: Player) => {
    const voteResult = votingLogic.processVote(target)
    setRoundResults(voteResult.message)
    setGameState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        players: prev.players.map((p) => (p.id === voteResult.voted.id ? { ...p, isAlive: false } : p)),
        alivePlayers: prev.alivePlayers.filter((p) => p.id !== voteResult.voted.id),
        mafiaAlive: prev.players.filter((p) => (p.role === 'mafia' || p.role === 'don') && p.isAlive).length,
        civiliansAlive: prev.players.filter((p) => p.role === 'civilian' && p.isAlive).length,
        sheriffAlive: prev.players.filter((p) => p.role === 'sheriff' && p.isAlive).length > 0,
      }
    })
    setVotingPhase(false)
    setIsVotingResults(true)
  }

  const startNextGame = () => {
    navigate('/')
  }

  const startNextGameAndClear = () => {
    clearGame()
    navigate('/')
  }

  const clearGame = () => {
    setGameState(null)
    setRoundResults(null)
    setShowNextPlayerScreen(false)
    setVotingPhase(false)
    setIsVotingResults(false)
    mafiaLogic.clearMafiaTargets()
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
    clearStorage()
  }

  const handlePlayerAction = (action: string, target?: Player) => {
    if (!currentPlayer) return

    if (action === 'continue') {
      sheriffLogic.resetSheriffCheck()
      setShowNextPlayerScreen(true)
    } else if (action === 'kill' && target) {
      if (currentPlayer.role === 'don') {
        mafiaLogic.addMafiaTarget(target)
        donLogic.performKill(target)
        if (donLogic.canContinue()) {
          setShowNextPlayerScreen(true)
        }
      } else {
        mafiaLogic.addMafiaTarget(target)
        sheriffLogic.resetSheriffCheck()
        setShowNextPlayerScreen(true)
      }
    } else if (action === 'check' && target) {
      if (currentPlayer.role === 'don') {
        donLogic.performCheck(target)
      } else if (currentPlayer.role === 'sheriff') {
        sheriffLogic.performCheck(target)
      }
    } else if (action === 'vote' && target) {
      processVoting(target)
    }
  }

  const contextValue: GameContextType = {
    gameState,
    roundResults,
    showNextPlayerScreen,
    votingPhase,
    isVotingResults,
    currentPlayer,
    winner,
    donKilled: donLogic.donKilled,
    donChecked: donLogic.donChecked,
    donCheckResult: donLogic.donCheckResult,
    sheriffCheckResult: sheriffLogic.sheriffCheckResult,
    startGame,
    handlePlayerAction,
    startNextPlayerTurn,
    startNextRound,
    startVoting,
    processVoting,
    startNextGame,
    startNextGameAndClear,
    clearGame,
  }

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
}
