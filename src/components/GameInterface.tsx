import React from 'react'

import { useGameContext } from '../hooks/useGameContext'
import { ROLE_DESCRIPTIONS } from '../types/game'
import { getRoleColor } from '../utils/roleUtils'

import { MenuButton } from './MenuButton'
import { CivilianActions, DonActions, MafiaActions, SheriffActions, VotingActions } from './roles'

const GameInterface: React.FC = () => {
  const {
    gameState,
    roundResults,
    votingResults,
    showNextPlayerScreen,
    votingPhase,
    currentPlayer,
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
    processVoting,
  } = useGameContext()

  if (!gameState) {
    return <div>Загрузка игры...</div>
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
