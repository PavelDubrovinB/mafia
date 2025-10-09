import { useCallback, useState } from 'react'

import { Player } from '../types/game'

export const useDonLogic = () => {
  const [donKilled, setDonKilled] = useState(false)
  const [donChecked, setDonChecked] = useState(false)
  const [donCheckResult, setDonCheckResult] = useState<string | null>(null)

  const performKill = useCallback((target: Player) => {
    setDonKilled(true)
    return target
  }, [])

  const performCheck = useCallback((target: Player) => {
    const isSheriff = target.role === 'sheriff'
    const result = isSheriff ? `${target.name} - Шериф` : `${target.name} - Не шериф`
    setDonCheckResult(result)
    setDonChecked(true)
    return result
  }, [])

  const canContinue = useCallback(() => {
    return donKilled && donChecked
  }, [donKilled, donChecked])

  const resetDonActions = useCallback(() => {
    setDonKilled(false)
    setDonChecked(false)
    setDonCheckResult(null)
  }, [])

  return {
    donKilled,
    donChecked,
    donCheckResult,
    performKill,
    performCheck,
    canContinue,
    resetDonActions,
  }
}
