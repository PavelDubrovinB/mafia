import { useCallback, useState } from 'react'

import { Player } from '../types/game'

export const useSheriffLogic = () => {
  const [sheriffCheckResult, setSheriffCheckResult] = useState<string | null>(null)

  const performCheck = useCallback((target: Player) => {
    const isMafia = target.role === 'mafia' || target.role === 'don'
    const result = isMafia ? `${target.name} - Мафия` : `${target.name} - Мирный житель`
    setSheriffCheckResult(result)
    return result
  }, [])

  const resetSheriffCheck = useCallback(() => {
    setSheriffCheckResult(null)
  }, [])

  return {
    sheriffCheckResult,
    performCheck,
    resetSheriffCheck,
  }
}
