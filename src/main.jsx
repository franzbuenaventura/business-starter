import React from 'react'
import ReactDOM from 'react-dom/client'
import { HeroUIProvider } from '@heroui/react'
import App from './App.jsx'
import AuthGate from './components/AuthGate.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroUIProvider>
      <AuthGate>
        <App />
      </AuthGate>
    </HeroUIProvider>
  </React.StrictMode>
)

// ── Register Service Worker for PWA / offline support ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service Worker registered:', reg.scope)
        // Auto-apply deploy updates: when a new SW is waiting, activate + reload once
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing
          if (!nw) return
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              nw.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        })
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!window.__swReloaded) { window.__swReloaded = true; location.reload() }
        })
      })
      .catch((err) => {
        console.error('[PWA] Service Worker registration failed:', err)
      })
  })
}