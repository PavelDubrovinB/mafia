import React from 'react'
import { useNavigate } from 'react-router-dom'

import GameInterface from '../components/GameInterface'
import { useGameContext } from '../hooks/useGameContext'

const GamePage: React.FC = () => {
  const navigate = useNavigate()

  const { gameState } = useGameContext()

  const goHome = () => {
    navigate('/')
  }

  if (!gameState) {
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
