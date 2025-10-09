import React from 'react'

import { Player } from '../../types/game'

interface MafiaActionsProps {
  currentPlayer: Player
  alivePlayers: Player[]
  onAction: (action: string, target?: Player) => void
}

const MafiaActions: React.FC<MafiaActionsProps> = ({ currentPlayer, alivePlayers, onAction }) => {
  const targets = alivePlayers.filter(
    (p) => p.id !== currentPlayer.id && (p.role === 'civilian' || p.role === 'sheriff'),
  )

  const handleKill = (target: Player) => {
    onAction('kill', target)
  }

  return (
    <div>
      <p>Выберите кого убить:</p>
      {targets.map((player) => (
        <button key={player.id} onClick={() => handleKill(player)} className="btn btn-secondary">
          {player.name}
        </button>
      ))}
    </div>
  )
}

export default MafiaActions
