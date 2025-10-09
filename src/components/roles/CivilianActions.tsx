import React from 'react'

interface CivilianActionsProps {
  onAction: (action: string) => void
}

const CivilianActions: React.FC<CivilianActionsProps> = ({ onAction }) => {
  const handleContinue = () => {
    onAction('continue')
  }

  return (
    <div>
      <button onClick={handleContinue} className="btn btn-primary">
        Продолжить
      </button>
    </div>
  )
}

export default CivilianActions
