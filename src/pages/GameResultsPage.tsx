import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useGameContext } from '../hooks/useGameContext'

const GameResultsPage: React.FC = () => {
  const navigate = useNavigate()
  const { gameState, getWinner, clearGame } = useGameContext()
  const winner = getWinner()

  const goHome = () => {
    clearGame()
    navigate('/')
  }

  if (!gameState || !winner) {
    return (
      <div className="container">
        <h2>Ошибка</h2>
        <p>Данные игры не найдены</p>
        <button onClick={goHome}>В главное меню</button>
      </div>
    )
  }

  const mafiaTeam = gameState.players.filter((p) => p.role === 'mafia' || p.role === 'don')
  const sheriff = gameState.players.find((p) => p.role === 'sheriff')
  const don = gameState.players.find((p) => p.role === 'don')

  return (
    <div className="app">
      <div>
        <h2>Игра окончена!</h2>
        <p>
          Победили: <strong>{winner === 'civilians' ? 'Мирные жители' : 'Мафия'}</strong>
        </p>

        <div>
          <h4>
            Команда мафии: <strong>{mafiaTeam.map((player) => player.id).join(', ')}</strong>
          </h4>
          {don && (
            <h4>
              Дон: <strong>{don.id}</strong>
            </h4>
          )}

          {sheriff && (
            <h4>
              Шериф: <strong>{sheriff.id}</strong>
            </h4>
          )}
        </div>
        <button onClick={goHome} className="btn btn-primary">
          Новая игра
        </button>
      </div>
    </div>
  )
}

export default GameResultsPage
