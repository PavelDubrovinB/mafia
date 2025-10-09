import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import './App.css'

import { GameProvider } from './contexts/GameContext'
import GamePage from './pages/GamePage'
import RoleSetupPage from './pages/RoleSetupPage'
import SetupPage from './pages/SetupPage'

const App: React.FC = () => {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<SetupPage />} />
          <Route path="/roles" element={<RoleSetupPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </GameProvider>
    </Router>
  )
}

export default App
