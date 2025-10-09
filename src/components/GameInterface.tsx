import React from 'react'

import { useGameContext } from '../hooks/useGameContext'
import { ROLE_DESCRIPTIONS } from '../types/game'
import { getRoleColor } from '../utils/roleUtils'

import { CivilianActions, DonActions, MafiaActions, SheriffActions, VotingActions } from './roles'

const GameInterface: React.FC = () => {
  const {
    gameState,
    roundResults,
    showNextPlayerScreen,
    votingPhase,
    isVotingResults,
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

  if (showNextPlayerScreen) {
    const currentPlayer = gameState.alivePlayers[gameState.currentPlayerIndex]
    return (
      <>
        <h2>Круг {gameState.round}</h2>
        <p>
          Сейчас ходит: <strong>{currentPlayer?.name}</strong>
        </p>
        <button onClick={startNextPlayerTurn} className="btn btn-primary">
          Продолжить
        </button>
        <button onClick={startNextGame} className="btn btn-secondary">
          Главное меню
        </button>
      </>
    )
  }

  if (winner) {
    return (
      <>
        <h2>Игра окончена!</h2>
        <p>Победили: {winner === 'civilians' ? 'Мирные жители' : 'Мафия'}</p>
        <button onClick={startNextGameAndClear} className="btn btn-secondary">
          Главное меню
        </button>
      </>
    )
  }

  if (roundResults) {
    return (
      <>
        <h2>Результаты круга {gameState.round}</h2>
        <div className="round-results">
          <p>{roundResults}</p>
          {isVotingResults ? (
            <button onClick={startNextRound} className="btn btn-primary">
              Начать следующий круг
            </button>
          ) : (
            <button onClick={startVoting} className="btn btn-primary">
              Начать голосование
            </button>
          )}
          <button onClick={startNextGame} className="btn btn-secondary">
            Главное меню
          </button>
        </div>
      </>
    )
  }

  if (!currentPlayer) {
    return <div>Загрузка...</div>
  }

  if (votingPhase) {
    return (
      <>
        <h2>Голосование - Круг {gameState.round}</h2>
        <VotingActions alivePlayers={gameState.alivePlayers} processVoting={processVoting} />
      </>
    )
  }

  return (
    <>
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
