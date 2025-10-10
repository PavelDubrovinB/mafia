import { useCallback, useState } from 'react'

import { MAFIA_STORAGE_KEY } from '~/contexts/GameContext'

import { Player } from '../types/game'

export const useMafiaLogic = () => {
  const [mafiaTargets, setMafiaTargets] = useState<Player[]>([])

  const initializeMafiaTargets = useCallback((alivePlayers: Player[]) => {
    try {
      const saved = localStorage.getItem(MAFIA_STORAGE_KEY)
      if (saved) {
        const loadedTargets = JSON.parse(saved)
        const mafiaCount = alivePlayers.filter((p) => p.role === 'mafia' || p.role === 'don').length

        if (loadedTargets.length > mafiaCount) {
          const cleanedTargets = loadedTargets.slice(-mafiaCount)
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
  }, [])

  const cleanupMafiaTargets = useCallback((alivePlayers: Player[]) => {
    const mafiaCount = alivePlayers.filter((p) => p.role === 'mafia' || p.role === 'don').length

    setMafiaTargets((prev) => {
      if (prev.length > mafiaCount) {
        const cleanedTargets = prev.slice(-mafiaCount)
        localStorage.setItem(MAFIA_STORAGE_KEY, JSON.stringify(cleanedTargets))
        return cleanedTargets
      }
      return prev
    })
  }, [])

  const addMafiaTarget = useCallback((target: Player, alivePlayers: Player[], currentPlayer: Player) => {
    setMafiaTargets((prev) => {
      const mafiaCount = alivePlayers.filter((p) => p.role === 'mafia' || p.role === 'don').length
      const mafiaPlayers = alivePlayers.filter((p) => p.role === 'mafia' || p.role === 'don')
      const currentPlayerIndex = mafiaPlayers.findIndex((p) => p.id === currentPlayer.id)

      let cleanedPrev = prev
      if (prev.length > mafiaCount) {
        cleanedPrev = prev.slice(-mafiaCount)
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
  }, [])

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

  const processMafiaKills = (alivePlayers: Player[]) => {
    const mafiaCount = alivePlayers.filter((p) => p.role === 'mafia' || p.role === 'don').length

    if (mafiaTargets.length === mafiaCount) {
      const targetCounts = mafiaTargets.reduce(
        (acc, target) => {
          acc[target.id] = (acc[target.id] || 0) + 1
          return acc
        },
        {} as Record<number, number>,
      )

      const unanimousTarget = Object.entries(targetCounts).find(([, votes]) => votes === mafiaCount)

      if (unanimousTarget) {
        const killedPlayer = alivePlayers.find((p) => p.id === parseInt(unanimousTarget[0]))!
        return {
          success: true,
          killed: killedPlayer,
          message: `${killedPlayer.name} был убит мафией!`,
        }
      } else {
        return {
          success: false,
          killed: null,
          message: 'Мафия не смогла договориться! Никто не был убит.',
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
