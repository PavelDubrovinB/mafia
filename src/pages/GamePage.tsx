import React from 'react'
import { useLocation } from 'react-router-dom'

import GameInterface from '../components/GameInterface'
import { useGameContext } from '../hooks/useGameContext'

const GamePage: React.FC = () => {
  const location = useLocation()
  const playerCount = location.state?.playerCount as number
  const { gameState, startGame } = useGameContext()

  React.useEffect(() => {
    if (playerCount && !gameState) {
      startGame(playerCount)
    }
  }, [playerCount, gameState, startGame])

  if (!playerCount && !gameState) {
    return (
      <div className="app">
        <h2>Ошибка</h2>
        <p>Не удалось загрузить данные игры</p>
      </div>
    )
  }

  return (
    <div className="app">
      <GameInterface />
    </div>
  )
}

export default GamePage
