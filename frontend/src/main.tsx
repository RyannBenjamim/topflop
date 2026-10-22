import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AuthProvider } from './context/AuthContext'

import App from './App'
import './styles/index.css'

window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash')
    const root = document.getElementById('root')

    if (splash) splash.remove()
    if (root) root.style.visibility = 'visible'
  }, 800)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
