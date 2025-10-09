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

        const maxVotes = Math.max(...Object.values(targetCounts))
        const killedPlayers = Object.entries(targetCounts)
          .filter(([, votes]) => votes === maxVotes)
          .map(([id]) => alivePlayers.find((p) => p.id === parseInt(id))!)

        if (killedPlayers.length === 1) {
          return {
            success: true,
            killed: killedPlayers[0],
            message: `${killedPlayers[0].name} был убит мафией!`,
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
