import React from 'react'

import { getRoleColor } from '~/utils/roleUtils'

import { Player, ROLE_DESCRIPTIONS } from '../types/game'

interface RoleRevealProps {
  currentPlayer: Player
  onContinue: () => void
  onRoleConfirmed: () => void
  isRevealing: boolean
}

const RoleReveal: React.FC<RoleRevealProps> = ({ currentPlayer, onContinue, onRoleConfirmed, isRevealing }) => {
  const roleColor = getRoleColor(currentPlayer.role)

  if (isRevealing) {
    return (
      <>
        <h2>Твоя роль</h2>
        <div className="role-name" style={{ color: roleColor }}>
          {ROLE_DESCRIPTIONS[currentPlayer.role].toUpperCase()}
        </div>
        <button onClick={onRoleConfirmed} className="btn btn-primary">
          Продолжить
        </button>
      </>
    )
  }

  return (
    <>
      <h2>Показ ролей</h2>
      <p>
        <strong>{currentPlayer.name}</strong>
      </p>
      <button onClick={onContinue} className="btn btn-primary">
        Продолжить
      </button>
    </>
  )
}

export default RoleReveal
