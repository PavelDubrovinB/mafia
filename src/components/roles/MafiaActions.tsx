import React, { useState } from 'react'

import { Player } from '../../types/game'

interface MafiaActionsProps {
  alivePlayers: Player[]
  onAction: (action: string, target?: Player) => void
}

const MafiaActions: React.FC<MafiaActionsProps> = ({ alivePlayers, onAction }) => {
  const [selectedTarget, setSelectedTarget] = useState<Player | null>(null)

  const handleKill = (target: Player) => {
    setSelectedTarget(target)
    onAction('kill', target)
  }

  const handleContinue = () => {
    setSelectedTarget(null)
    onAction('continue')
  }

  const handleCancel = () => {
    setSelectedTarget(null)
    onAction('cancel')
  }

  if (selectedTarget) {
    return (
      <div>
        <p>
          Вы выбрали: <strong>{selectedTarget.name}</strong>
        </p>
        <div className="action-buttons">
          <button onClick={handleCancel} className="btn btn-secondary">
            Отменить
          </button>
          <button onClick={handleContinue} className="btn btn-primary">
            Продолжить
          </button>
        </div>
      </div>
    )
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
