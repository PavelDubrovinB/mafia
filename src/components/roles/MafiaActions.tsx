import React from 'react'

import { Player } from '../../types/game'

interface MafiaActionsProps {
  alivePlayers: Player[]
  onAction: (action: string, target?: Player) => void
}

const MafiaActions: React.FC<MafiaActionsProps> = ({ alivePlayers, onAction }) => {
  const handleKill = (target: Player) => {
    onAction('kill', target)
  }

  return (
    <div>
      <p>Выберите кого убить:</p>
      {alivePlayers.map((player) => (
        <button key={player.id} onClick={() => handleKill(player)} className="btn btn-secondary">
          {player.name}
        </button>
      ))}
    </div>
  )
}

export default MafiaActions
