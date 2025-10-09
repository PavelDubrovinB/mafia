import { useCallback } from 'react'

import { Player } from '../types/game'

export const useVotingLogic = () => {
  const processVote = useCallback((target: Player) => {
    return {
      voted: target,
      message: `${target.name} был выгнан голосованием!`,
    }
  }, [])

  return {
    processVote,
  }
}
