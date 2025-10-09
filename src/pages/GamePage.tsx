import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import GameInterface from '../components/GameInterface'
import { useGameContext } from '../hooks/useGameContext'

const GamePage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const playerCount = location.state?.playerCount as number

  const { gameState, startGame } = useGameContext()

  React.useEffect(() => {
    if (playerCount && !gameState) {
      startGame(playerCount)
      navigate('/game', { replace: true })
    }
  }, [playerCount, gameState, startGame, navigate])

  const goHome = () => {
    navigate('/')
  }

  if (!playerCount && !gameState) {
    return (
      <div className="app">
        <h2>Ошибка</h2>
        <p>Не удалось загрузить данные игры.</p>
        <button onClick={goHome} className="btn btn-primary">
          Вернуться назад
        </button>
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
