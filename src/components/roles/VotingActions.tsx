import React, { useState } from 'react'

import { Player } from '../../types/game'

interface VotingActionsProps {
  alivePlayers: Player[]
  processVoting: (targets: Player[]) => void
}

const VotingActions: React.FC<VotingActionsProps> = ({ alivePlayers, processVoting }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.some((p) => p.id === player.id) ? prev.filter((p) => p.id !== player.id) : [...prev, player],
    )
  }

  const handleEndVoting = () => {
    processVoting(selectedPlayers)
  }

  return (
    <div>
      <div className="voting-buttons">
        {alivePlayers.map((player) => (
          <button
            key={player.id}
            onClick={() => handlePlayerSelect(player)}
            className={`btn ${selectedPlayers.some((p) => p.id === player.id) ? 'btn-primary' : 'btn-secondary'}`}
          >
            {player.name}
          </button>
        ))}
      </div>
      <button onClick={handleEndVoting} className="btn btn-primary">
        Завершить голосование
      </button>
    </div>
  )
}

export default VotingActions
