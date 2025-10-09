import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useGameContext } from '../hooks/useGameContext'

interface GameState {
  playerCount: number
}

const SetupPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const gameState = location.state as GameState
  const { gameState: contextGameState, clearGame } = useGameContext()

  const [playerCount, setPlayerCount] = useState<number>(gameState?.playerCount || 0)

  const handlePlayerCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const count = parseInt(value)
    setPlayerCount(count)
  }

  const handleStartGame = () => {
    if (playerCount > 0) {
      clearGame()
      navigate('/roles', { state: { playerCount } })
    }
  }

  const handleClearGame = () => {
    clearGame()
  }

  const handleContinueGame = () => {
    if (contextGameState) {
      navigate('/game')
    }
  }

  return (
    <div className="app">
      <h2>Настройка игры</h2>
      <div className="input-group">
        <label htmlFor="playerCount">Количество игроков:</label>
        <input
          id="playerCount"
          type="number"
          min="1"
          max="20"
          value={playerCount || ''}
          onChange={handlePlayerCountChange}
          placeholder="Введите количество игроков"
        />
      </div>
      <button onClick={handleStartGame} disabled={playerCount <= 0} className="btn btn-primary">
        Начать игру
      </button>
      {contextGameState && (
        <>
          <button onClick={handleContinueGame} className="btn btn-primary">
            Продолжить игру
          </button>
          <button onClick={handleClearGame} className="btn btn-secondary">
            Очистить игру
          </button>
        </>
      )}
    </div>
  )
}

export default SetupPage
