import React, { useState } from 'react'

interface CivilianActionsProps {
  onAction: (action: string) => void
}

const CivilianActions: React.FC<CivilianActionsProps> = ({ onAction }) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      onAction('continue')
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div>
      <button onClick={handleContinue} className="btn btn-primary">
        {isLoading ? 'Загрузка...' : 'Продолжить'}
      </button>
    </div>
  )
}

export default CivilianActions
