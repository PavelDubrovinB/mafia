import React from 'react'

import { MISS_PLAYER } from '~/const'

import { Player } from '../../types/game'

interface DonActionsProps {
  // currentPlayer: Player
  players: Player[]
  donKilled: boolean
  donChecked: boolean
  lastCheckResult: string | null
  onAction: (action: string, target?: Player) => void
  onContinue: () => void
}

const DonActions: React.FC<DonActionsProps> = ({
  // currentPlayer,
  players,
  donKilled,
  donChecked,
  lastCheckResult,
  onAction,
  onContinue,
}) => {
  // const checkTargets = alivePlayers.filter((p) => p.id !== currentPlayer.id && p.role !== 'mafia' && p.role !== 'don')

  const handleKill = (target: Player) => {
    onAction('kill', target)
  }

  const handleCheck = (target: Player) => {
    onAction('check', target)
  }

  return (
    <div>
      {!donKilled && (
        <div>
          <p>Убить игрока:</p>
          <div className="player-buttons">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => handleKill(player)}
                className={`btn btn-secondary ${!player.isAlive ? 'dead-player' : ''}`}
              >
                {player.name}
              </button>
            ))}
            <button key="continue" onClick={() => handleKill(MISS_PLAYER)} className="btn btn-secondary">
              {MISS_PLAYER.name}
            </button>
          </div>
        </div>
      )}

      {!donChecked && (
        <div>
          <p>Проверить игрока на шерифа:</p>
          <div className="player-buttons">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => handleCheck(player)}
                className={`btn btn-secondary ${!player.isAlive ? 'dead-player' : ''}`}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {lastCheckResult && (
        <div className="check-result">
          <p>{lastCheckResult}</p>
          {donKilled && donChecked && (
            <button onClick={onContinue} className="btn btn-primary">
              Продолжить
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DonActions
