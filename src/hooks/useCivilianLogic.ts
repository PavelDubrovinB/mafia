import { useCallback } from 'react'

export const useCivilianLogic = () => {
  const continueTurn = useCallback(() => {
    return 'continue'
  }, [])

  return {
    continueTurn,
  }
}
