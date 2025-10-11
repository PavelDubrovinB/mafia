import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW зарегистрирован: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW регистрация не удалась: ', registrationError)
      })
  })
}

createRoot(document.getElementById('app')!).render(<App />)
