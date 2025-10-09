import React from 'react'

import { Player } from '../../types/game'

interface VotingActionsProps {
  alivePlayers: Player[]
  onAction: (action: string, target?: Player) => void
}

const VotingActions: React.FC<VotingActionsProps> = ({ alivePlayers, onAction }) => {
  const handleVote = (target: Player) => {
    onAction('vote', target)
  }
  return (
    <div>
      <p>Выберите игрока для голосования:</p>
      {alivePlayers.map((player) => (
        <button key={player.id} onClick={() => handleVote(player)} className="btn btn-secondary">
          {player.name}
        </button>
      ))}
    </div>
  )
}

export default VotingActions
