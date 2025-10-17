import React from 'react'
import { FaHome } from 'react-icons/fa'

export const MenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="btn btn-secondary"
    style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      fontSize: '20px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      opacity: 0.8,
    }}
  >
    <FaHome />
  </button>
)
