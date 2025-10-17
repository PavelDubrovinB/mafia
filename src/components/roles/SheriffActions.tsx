import React from 'react'

import { Player } from '../../types/game'

interface SheriffActionsProps {
  // currentPlayer: Player
  players: Player[]
  lastCheckResult: string | null
  onAction: (action: string, target?: Player) => void
  onContinue: () => void
}

const SheriffActions: React.FC<SheriffActionsProps> = ({
  // currentPlayer,
  players,
  lastCheckResult,
  onAction,
  onContinue,
}) => {
  // const targets = alivePlayers.filter((p) => p.id !== currentPlayer.id)

  const handleCheck = (target: Player) => {
    onAction('check', target)
  }

  return (
    <div>
      {!lastCheckResult ? (
        <>
          <p>Проверьте игрока на мафию:</p>
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
        </>
      ) : (
        <div className="check-result">
          <p>{lastCheckResult}</p>
          <button onClick={onContinue} className="btn btn-primary">
            Продолжить
          </button>
        </div>
      )}
    </div>
  )
}

export default SheriffActions
