import React from 'react'

import { useGameContext } from '../hooks/useGameContext'
import { ROLE_DESCRIPTIONS } from '../types/game'
import { getRoleColor } from '../utils/roleUtils'

import { CivilianActions, DonActions, MafiaActions, SheriffActions, VotingActions } from './roles'

const MenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="btn btn-secondary"
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      fontSize: '14px',
      padding: '8px 16px',
    }}
  >
    Главное меню
  </button>
)

const GameInterface: React.FC = () => {
  const {
    gameState,
    roundResults,
    votingResults,
    showNextPlayerScreen,
    votingPhase,
    currentPlayer,
    winner,
    donKilled,
    donChecked,
    donCheckResult,
    sheriffCheckResult,
    handlePlayerAction,
    startNextPlayerTurn,
    moveToNextPlayer,
    startNextRound,
    startVoting,
    startNextGame,
    startNextGameAndClear,
    processVoting,
  } = useGameContext()

  if (!gameState) {
    return <div>Загрузка игры...</div>
  }

  if (winner) {
    const mafiaTeam = gameState.players.filter((p) => p.role === 'mafia' || p.role === 'don')
    const sheriff = gameState.players.find((p) => p.role === 'sheriff')
    const don = gameState.players.find((p) => p.role === 'don')

    return (
      <>
        <MenuButton onClick={startNextGame} />
        <h2>Игра окончена!</h2>
        <p>Победили: {winner === 'civilians' ? 'Мирные жители' : 'Мафия'}</p>

        <div className="game-results">
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

        <button onClick={startNextGameAndClear} className="btn btn-primary">
          Новая игра
        </button>
      </>
    )
  }

  if (roundResults) {
    return (
      <>
        <MenuButton onClick={startNextGame} />
        <h2>Круг {gameState.round}</h2>
        <p>Результат мафии</p>
        <div className="round-results">
          <p>{roundResults}</p>
          <button onClick={startVoting} className="btn btn-primary mt-4">
            Начать голосование
          </button>
        </div>
      </>
    )
  }

  if (votingResults) {
    return (
      <>
        <MenuButton onClick={startNextGame} />
        <h2>Круг {gameState.round}</h2>
        <p>Результаты голосования</p>
        <div className="round-results">
          <p>{votingResults}</p>
          <button onClick={startNextRound} className="btn btn-primary">
            Следующий круг
          </button>
        </div>
      </>
    )
  }

  if (votingPhase) {
    return (
      <>
        <MenuButton onClick={startNextGame} />
        <h2>Круг {gameState.round}</h2>
        <p>Голосование</p>
        <VotingActions alivePlayers={gameState.alivePlayers} processVoting={processVoting} />
      </>
    )
  }

  if (showNextPlayerScreen) {
    const currentPlayer = gameState.alivePlayers[gameState.currentPlayerIndex]
    return (
      <>
        <MenuButton onClick={startNextGame} />
        <h2>Круг {gameState.round}</h2>
        <p>
          Сейчас ходит: <strong>{currentPlayer?.name}</strong>
        </p>
        <button onClick={startNextPlayerTurn} className="btn btn-primary">
          Продолжить
        </button>
      </>
    )
  }

  if (!currentPlayer) {
    return <div>Загрузка...</div>
  }

  return (
    <>
      <MenuButton onClick={startNextGame} />
      <h2>Круг {gameState.round}</h2>
      <p>
        Сейчас ходит: <strong>{currentPlayer.name}</strong>
      </p>
      <p>
        Роль: <span style={{ color: getRoleColor(currentPlayer.role) }}>{ROLE_DESCRIPTIONS[currentPlayer.role]}</span>
      </p>

      {currentPlayer.role === 'civilian' && <CivilianActions onAction={handlePlayerAction} />}

      {currentPlayer.role === 'mafia' && (
        <MafiaActions alivePlayers={gameState.alivePlayers} onAction={handlePlayerAction} />
      )}

      {currentPlayer.role === 'don' && (
        <DonActions
          currentPlayer={currentPlayer}
          alivePlayers={gameState.alivePlayers}
          donKilled={donKilled}
          donChecked={donChecked}
          lastCheckResult={donCheckResult}
          onAction={handlePlayerAction}
          onContinue={moveToNextPlayer}
        />
      )}

      {currentPlayer.role === 'sheriff' && (
        <SheriffActions
          currentPlayer={currentPlayer}
          alivePlayers={gameState.alivePlayers}
          lastCheckResult={sheriffCheckResult}
          onAction={handlePlayerAction}
          onContinue={moveToNextPlayer}
        />
      )}
    </>
  )
}

export default GameInterface
