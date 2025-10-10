import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDonLogic } from '../hooks/useDonLogic'
import { useMafiaLogic } from '../hooks/useMafiaLogic'
import { useSheriffLogic } from '../hooks/useSheriffLogic'
import { GameState, Player } from '../types/game'

import { GameContext, GameContextType } from './GameContextDefinition'

const STORAGE_KEY = 'mafia-game-state'
export const MAFIA_STORAGE_KEY = 'mafia-targets'
const VOTING_PHASE_STORAGE_KEY = 'voting-phase'
const VOTING_RESULTS_STORAGE_KEY = 'voting-results'

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
  const [votingResults, setVotingResults] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(VOTING_RESULTS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error('Failed to load voting results state:', error)
      return null
    }
  })
  const [showNextPlayerScreen, setShowNextPlayerScreen] = useState(true)
  const [votingPhase, setVotingPhase] = useState(() => {
    try {
      const saved = localStorage.getItem(VOTING_PHASE_STORAGE_KEY)
      return saved ? JSON.parse(saved) : false
    } catch (error) {
      console.error('Failed to load voting phase state:', error)
      return false
    }
  })

  const navigate = useNavigate()

  const mafiaLogic = useMafiaLogic()
  const donLogic = useDonLogic()
  const sheriffLogic = useSheriffLogic()

  const currentPlayer = useMemo(() => {
    if (!gameState || !gameState.alivePlayers.length) return null
    return gameState.alivePlayers[gameState.currentPlayerIndex] || null
  }, [gameState])

  const winner = useMemo(() => {
    if (!gameState) return null

    const mafiaAlive = gameState.alivePlayers.filter((p) => p.role === 'mafia' || p.role === 'don').length
    const civiliansAlive = gameState.alivePlayers.filter((p) => p.role === 'civilian').length
    const sheriffAlive = gameState.alivePlayers.filter((p) => p.role === 'sheriff').length > 0

    if (mafiaAlive === 0) return 'civilians'
    if (mafiaAlive >= civiliansAlive + (sheriffAlive ? 1 : 0)) return 'mafia'
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

  const saveVotingResultsState = (votingResults: string | null) => {
    try {
      setVotingResults(votingResults)
      localStorage.setItem(VOTING_RESULTS_STORAGE_KEY, JSON.stringify(votingResults))
    } catch (error) {
      console.error('Failed to save voting results state:', error)
    }
  }

  const saveVotingPhaseState = (isVotingResults: boolean) => {
    try {
      setVotingPhase(isVotingResults)
      localStorage.setItem(VOTING_PHASE_STORAGE_KEY, JSON.stringify(isVotingResults))
    } catch (error) {
      console.error('Failed to save voting results state:', error)
    }
  }

  const startNextRound = useCallback(() => {
    setRoundResults(null)
    setShowNextPlayerScreen(true)
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
    saveVotingPhaseState(false)
    saveVotingResultsState(null)
    setGameState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        currentPlayerIndex: 0,
        round: prev.round + 1,
      }
    })
    if (gameState) {
      mafiaLogic.cleanupMafiaTargets(gameState.alivePlayers)
    }
  }, [donLogic, sheriffLogic, gameState, mafiaLogic])

  useEffect(() => {
    if (gameState) {
      mafiaLogic.initializeMafiaTargets(gameState.alivePlayers)
      return saveToStorage(gameState)
    }

    clearStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState])

  const processRoundResults = () => {
    if (!gameState) return

    const mafiaResult = mafiaLogic.processMafiaKills(gameState.alivePlayers)

    if (mafiaResult) {
      setRoundResults(mafiaResult.message)
      saveVotingPhaseState(true)

      if (mafiaResult.success && mafiaResult.killed) {
        setGameState((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            players: prev.players.map((p) => (p.id === mafiaResult.killed!.id ? { ...p, isAlive: false } : p)),
            alivePlayers: prev.alivePlayers.filter((p) => p.id !== mafiaResult.killed!.id),
          }
        })
      }
    }

    mafiaLogic.clearMafiaTargets()
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
  }

  const startNextPlayerTurn = () => {
    if (!gameState) return

    setShowNextPlayerScreen(false)
  }

  const startVoting = () => {
    saveVotingPhaseState(true)
    setRoundResults(null)
  }

  const processVoting = (targets: Player[]) => {
    if (targets.length === 0) {
      const message = 'Никто не был исключен из игры'
      saveVotingResultsState(message)
      saveVotingPhaseState(false)
      return
    }

    const killedIds = targets.map((t) => t.id)
    const message = `${killedIds.sort((a, b) => a - b).join(', ')} были исключены из игры`

    saveVotingResultsState(message)
    setGameState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        players: prev.players.map((p) => (killedIds.includes(p.id) ? { ...p, isAlive: false } : p)),
        alivePlayers: prev.alivePlayers.filter((p) => !killedIds.includes(p.id)),
      }
    })
    saveVotingPhaseState(false)
  }

  const clearGame = () => {
    setGameState(null)
    setRoundResults(null)
    setShowNextPlayerScreen(false)
    saveVotingPhaseState(false)
    saveVotingResultsState(null)
    mafiaLogic.clearMafiaTargets()
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
    clearStorage()
  }

  const startNextGame = () => {
    navigate('/')
  }

  const startNextGameAndClear = () => {
    clearGame()
    navigate('/')
  }

  const moveToNextPlayer = () => {
    if (!gameState) return

    if (gameState.currentPlayerIndex < gameState.alivePlayers.length - 1) {
      setGameState((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          currentPlayerIndex: prev.currentPlayerIndex + 1,
        }
      })
      setShowNextPlayerScreen(true)
    } else {
      processRoundResults()
    }
  }

  const handlePlayerAction = (action: string, target?: Player) => {
    if (!currentPlayer) return
    const shouldMoveToNext = processPlayerAction(action, target)

    if (shouldMoveToNext) {
      moveToNextPlayer()
    }
  }

  const processContinueAction = (): boolean => {
    sheriffLogic.resetSheriffCheck()
    return true
  }

  const processCancelAction = (): boolean => {
    if (currentPlayer?.role === 'mafia' || currentPlayer?.role === 'don') {
      mafiaLogic.removeLastMafiaTarget()
    }
    return false
  }

  const processKillAction = (target: Player): boolean => {
    if (!gameState?.alivePlayers) return false

    if (currentPlayer?.role === 'don') {
      mafiaLogic.addMafiaTarget(target, gameState?.alivePlayers, currentPlayer)
      donLogic.performKill(target)
      return donLogic.canContinue()
    } else if (currentPlayer?.role === 'mafia') {
      mafiaLogic.addMafiaTarget(target, gameState?.alivePlayers, currentPlayer)
      sheriffLogic.resetSheriffCheck()
      return false
    }
    return false
  }

  const processCheckAction = (target: Player): boolean => {
    if (currentPlayer?.role === 'don') {
      donLogic.performCheck(target)
    } else if (currentPlayer?.role === 'sheriff') {
      sheriffLogic.performCheck(target)
    }
    return false
  }

  const processPlayerAction = (action: string, target?: Player): boolean => {
    if (!currentPlayer) return false

    switch (action) {
      case 'continue':
        return processContinueAction()

      case 'cancel':
        return processCancelAction()

      case 'kill':
        if (!target) return false
        return processKillAction(target)

      case 'check':
        if (!target) return false
        return processCheckAction(target)

      case 'vote':
        if (target) {
          processVoting([target])
        }
        return false

      default:
        return false
    }
  }

  const startGameWithState = (gameState: GameState) => {
    setGameState(gameState)
    setRoundResults(null)
    saveVotingResultsState(null)

    if (gameState.round === 0) {
      saveVotingPhaseState(true)
    } else {
      saveVotingPhaseState(false)
    }

    mafiaLogic.initializeMafiaTargets(gameState.alivePlayers)
    donLogic.resetDonActions()
    sheriffLogic.resetSheriffCheck()
  }

  const contextValue: GameContextType = {
    gameState,
    roundResults,
    votingResults,
    showNextPlayerScreen,
    votingPhase,
    currentPlayer,
    winner,
    donKilled: donLogic.donKilled,
    donChecked: donLogic.donChecked,
    donCheckResult: donLogic.donCheckResult,
    sheriffCheckResult: sheriffLogic.sheriffCheckResult,
    startGameWithState,
    handlePlayerAction,
    startNextPlayerTurn,
    moveToNextPlayer,
    startNextRound,
    startVoting,
    processVoting,
    startNextGame,
    startNextGameAndClear,
    clearGame,
  }

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
}
