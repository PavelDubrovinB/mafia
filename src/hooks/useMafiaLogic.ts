import { useCallback, useState } from 'react'

import { getMafiaKilledMessage, getMafiaMissedMessage, MISS_PLAYER_Id } from '~/const'
import { MAFIA_STORAGE_KEY } from '~/contexts/GameContext'

import { GameState, Player } from '../types/game'

export const useMafiaLogic = (gameState: GameState | null) => {
  const [mafiaTargets, setMafiaTargets] = useState<Player[]>([])

  const initializeMafiaTargets = useCallback(() => {
    if (!gameState) return
    try {
      const saved = localStorage.getItem(MAFIA_STORAGE_KEY)
      if (saved) {
        const loadedTargets = JSON.parse(saved)
        const aliveMafiaCount = gameState.players.filter(
          (p) => p.isAlive && (p.role === 'mafia' || p.role === 'don'),
        ).length

        if (loadedTargets.length > aliveMafiaCount) {
          const cleanedTargets = loadedTargets.slice(-aliveMafiaCount)
          localStorage.setItem(MAFIA_STORAGE_KEY, JSON.stringify(cleanedTargets))
          setMafiaTargets(cleanedTargets)
        } else {
          setMafiaTargets(loadedTargets)
        }
      }
    } catch (error) {
      console.error('Failed to load mafia targets:', error)
      setMafiaTargets([])
    }
  }, [gameState])

  const cleanupMafiaTargets = useCallback(() => {
    if (!gameState) return
    const aliveMafiaCount = gameState.players.filter(
      (p) => p.isAlive && (p.role === 'mafia' || p.role === 'don'),
    ).length

    setMafiaTargets((prev) => {
      if (prev.length > aliveMafiaCount) {
        const cleanedTargets = prev.slice(-aliveMafiaCount)
        localStorage.setItem(MAFIA_STORAGE_KEY, JSON.stringify(cleanedTargets))
        return cleanedTargets
      }
      return prev
    })
  }, [gameState])

  const addMafiaTarget = useCallback(
    (target: Player, currentPlayer: Player) => {
      if (!gameState) return
      setMafiaTargets((prev) => {
        const aliveMafiaPlayers = gameState.players.filter((p) => p.isAlive && (p.role === 'mafia' || p.role === 'don'))
        const aliveMafiaCount = aliveMafiaPlayers.length
        const currentPlayerIndex = aliveMafiaPlayers.findIndex((p) => p.id === currentPlayer.id)

        let cleanedPrev = prev
        if (prev.length > aliveMafiaCount) {
          cleanedPrev = prev.slice(-aliveMafiaCount)
        }

        if (cleanedPrev.length > currentPlayerIndex) {
          const newTargets = [...cleanedPrev]
          newTargets[currentPlayerIndex] = target
          localStorage.setItem(MAFIA_STORAGE_KEY, JSON.stringify(newTargets))
          return newTargets
        }

        const newTargets = [...cleanedPrev, target]
        localStorage.setItem(MAFIA_STORAGE_KEY, JSON.stringify(newTargets))
        return newTargets
      })
    },
    [gameState],
  )

  const clearMafiaTargets = useCallback(() => {
    setMafiaTargets([])
    localStorage.removeItem(MAFIA_STORAGE_KEY)
  }, [])

  const removeLastMafiaTarget = useCallback(() => {
    setMafiaTargets((prev) => {
      const newTargets = prev.slice(0, -1)
      localStorage.setItem(MAFIA_STORAGE_KEY, JSON.stringify(newTargets))
      return newTargets
    })
  }, [])

  const processMafiaKills = (players: Player[]) => {
    const aliveMafiaCount = players.filter((p) => p.isAlive && (p.role === 'mafia' || p.role === 'don')).length

    if (mafiaTargets.length === aliveMafiaCount) {
      const hasMissPlayer = mafiaTargets.some((target) => target.id === MISS_PLAYER_Id)

      if (hasMissPlayer) {
        return {
          success: false,
          killed: null,
          message: getMafiaMissedMessage(),
        }
      }

      const targetCounts = mafiaTargets.reduce(
        (acc, target) => {
          acc[target.id] = (acc[target.id] || 0) + 1
          return acc
        },
        {} as Record<number, number>,
      )

      const unanimousTarget = Object.entries(targetCounts).find(([, votes]) => votes === aliveMafiaCount)

      if (unanimousTarget) {
        const killedPlayer = players.find((p) => p.id === parseInt(unanimousTarget[0]))!

        if (!killedPlayer.isAlive) {
          return {
            success: false,
            killed: null,
            message: getMafiaMissedMessage(),
          }
        }

        return {
          success: true,
          killed: killedPlayer,
          message: getMafiaKilledMessage(killedPlayer.name),
        }
      } else {
        return {
          success: false,
          killed: null,
          message: getMafiaMissedMessage(),
        }
      }
    }

    return null
  }

  return {
    mafiaTargets,
    initializeMafiaTargets,
    addMafiaTarget,
    clearMafiaTargets,
    removeLastMafiaTarget,
    processMafiaKills,
    cleanupMafiaTargets,
  }
}
