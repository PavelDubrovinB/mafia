import { useCallback, useState } from 'react'

import { Player } from '../types/game'

export const useMafiaLogic = () => {
  const [mafiaTargets, setMafiaTargets] = useState<Player[]>([])

  const addMafiaTarget = useCallback((target: Player) => {
    setMafiaTargets((prev) => [...prev, target])
  }, [])

  const clearMafiaTargets = useCallback(() => {
    setMafiaTargets([])
  }, [])

  const processMafiaKills = useCallback(
    (alivePlayers: Player[]) => {
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
    },
    [mafiaTargets],
  )

  return {
    mafiaTargets,
    addMafiaTarget,
    clearMafiaTargets,
    processMafiaKills,
  }
}
