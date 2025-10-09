import React from 'react'

import { Player } from '../../types/game'

interface DonActionsProps {
  currentPlayer: Player
  alivePlayers: Player[]
  donKilled: boolean
  donChecked: boolean
  lastCheckResult: string | null
  onAction: (action: string, target?: Player) => void
  onContinue: () => void
}

const DonActions: React.FC<DonActionsProps> = ({
  currentPlayer,
  alivePlayers,
  donKilled,
  donChecked,
  lastCheckResult,
  onAction,
  onContinue,
}) => {
  const killTargets = alivePlayers.filter(
    (p) => p.id !== currentPlayer.id && (p.role === 'civilian' || p.role === 'sheriff'),
  )

  const checkTargets = alivePlayers.filter((p) => p.id !== currentPlayer.id && p.role !== 'mafia' && p.role !== 'don')

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
          {killTargets.map((player) => (
            <button key={player.id} onClick={() => handleKill(player)} className="btn btn-secondary">
              {player.name}
            </button>
          ))}
        </div>
      )}

      {!donChecked && (
        <div>
          <p>Проверить игрока на шерифа:</p>
          {checkTargets.map((player) => (
            <button key={player.id} onClick={() => handleCheck(player)} className="btn btn-secondary">
              {player.name}
            </button>
          ))}
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
