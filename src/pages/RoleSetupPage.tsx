import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import RoleReveal from '../components/RoleReveal'
import { useGameContext } from '../hooks/useGameContext'
import { GameState } from '../types/game'
import { createPlayers } from '../utils/gameUtils'

const RoleSetupPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialPlayerCount = location.state?.playerCount as number
  const { startGameWithState } = useGameContext()

  const players = useMemo(() => {
    if (initialPlayerCount && initialPlayerCount >= 4) {
      return createPlayers(initialPlayerCount)
    }
    return []
  }, [initialPlayerCount])

  const [gameState, setGameState] = useState<GameState>({
    playerCount: initialPlayerCount || 0,
    players,
    currentPlayerIndex: 0,
    phase: players.length > 0 ? 'role-reveal' : 'setup',
    round: 0,
    alivePlayers: players.filter((p) => p.isAlive),
    mafiaAlive: players.filter((p) => (p.role === 'mafia' || p.role === 'don') && p.isAlive).length,
    civiliansAlive: players.filter((p) => p.role === 'civilian' && p.isAlive).length,
    sheriffAlive: players.filter((p) => p.role === 'sheriff' && p.isAlive).length > 0,
  })

  const [isRevealing, setIsRevealing] = useState(false)

  const handleBackToSetup = () => {
    navigate('/')
  }

  const handleStartGame = () => {
    const gameStateWithRoles: GameState = {
      ...gameState,
      phase: 'game',
      currentPlayerIndex: 0,
    }
    startGameWithState(gameStateWithRoles)
    navigate('/game')
  }

  const handleContinue = () => {
    setIsRevealing(true)
  }

  const handleRoleConfirmed = () => {
    setIsRevealing(false)

    if (gameState.currentPlayerIndex < gameState.players.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        phase: 'completed',
      }))
    }
  }

  if (!initialPlayerCount || initialPlayerCount < 4) {
    return (
      <div className="app">
        <h2>Ошибка</h2>
        <p>Минимальное количество игроков для игры - 4</p>
        <button onClick={handleBackToSetup} className="btn btn-secondary">
          Настройки игры
        </button>
      </div>
    )
  }

  if (!initialPlayerCount || initialPlayerCount > 15) {
    return (
      <div className="app">
        <h2>Ошибка</h2>
        <p>Максимальное количество игроков для игры - 15</p>
        <button onClick={handleBackToSetup} className="btn btn-secondary">
          Настройки игры
        </button>
      </div>
    )
  }

  if (gameState.phase === 'setup') {
    return (
      <div className="app">
        <h2>Подготовка игры...</h2>
        <p>Распределяем роли...</p>
      </div>
    )
  }

  if (gameState.phase === 'role-reveal') {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex]

    if (!currentPlayer) {
      return null
    }

    return (
      <div className="app">
        <RoleReveal
          currentPlayer={currentPlayer}
          onContinue={handleContinue}
          onRoleConfirmed={handleRoleConfirmed}
          isRevealing={isRevealing}
        />
      </div>
    )
  }

  if (gameState.phase === 'completed') {
    return (
      <div className="app">
        <h2>Роли распределены!</h2>

        <button onClick={handleStartGame} className="btn btn-primary">
          Начать игру
        </button>
        <button onClick={handleBackToSetup} className="btn btn-secondary">
          Настройки игры
        </button>
      </div>
    )
  }

  return null
}

export default RoleSetupPage
