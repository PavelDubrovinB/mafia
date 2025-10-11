import React from 'react'

export const MenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="btn btn-secondary"
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      fontSize: '14px',
      padding: '8px 16px',
    }}
  >
    Главное меню
  </button>
)
