import { useState, useEffect, useCallback } from 'react'
import { apiFetch, getToken, setToken, clearToken } from '../api.js'
import './AuthGate.css'

/**
 * AuthGate – wraps the app and handles:
 * 1. First-launch PIN setup
 * 2. Login screen when not authenticated
 * 3. Renders children when authenticated
 */
export default function AuthGate({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'setup' | 'login' | 'authenticated'
  const [error, setError] = useState('')

  const checkAuth = useCallback(async () => {
    try {
      const res = await apiFetch('/api/auth/status')
      const data = await res.json()
      if (!data.pinSet) {
        setStatus('setup')
        return
      }
      if (!getToken()) {
        setStatus('login')
        return
      }
      // Verify token is still valid by hitting a protected endpoint
      try {
        await apiFetch('/api/businesses')
        setStatus('authenticated')
      } catch {
        clearToken()
        setStatus('login')
      }
    } catch {
      // If auth/status itself fails (e.g. network), assume not authenticated
      setStatus('login')
    }
  }, [])

  useEffect(() => { checkAuth() }, [checkAuth])

  async function handleSetup(pin, confirmPin) {
    setError('')
    if (pin.length < 4) { setError('PIN must be at least 4 characters'); return }
    if (pin !== confirmPin) { setError('PINs do not match'); return }
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Setup failed'); return }
      setToken(data.token)
      setStatus('authenticated')
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  async function handleLogin(pin) {
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      setToken(data.token)
      setStatus('authenticated')
    } catch (e) {
      setError('Network error. Please try again.')
    }
  }

  if (status === 'loading') {
    return (
      <div className="auth-gate__loading">
        <div className="auth-gate__spinner" />
        <p>Loading…</p>
      </div>
    )
  }

  if (status === 'setup') {
    return <SetupScreen onSubmit={handleSetup} error={error} />
  }

  if (status === 'login') {
    return <LoginScreen onSubmit={handleLogin} error={error} />
  }

  return children
}

/* ── Setup Screen (first launch) ────────────────────────────── */

function SetupScreen({ onSubmit, error }) {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(pin, confirmPin)
  }

  return (
    <div className="auth-gate">
      <div className="auth-gate__card">
        <div className="auth-gate__icon">🔐</div>
        <h1 className="auth-gate__title">Set Up Your PIN</h1>
        <p className="auth-gate__subtitle">
          First time here? Create a PIN to secure your business plans.
          You'll need this PIN every time you access the app.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="auth-gate__field">
            <label className="auth-gate__label">Create PIN</label>
            <input
              className="form-input"
              type="password"
              placeholder="At least 4 characters"
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
              inputMode="numeric"
            />
          </div>
          <div className="auth-gate__field">
            <label className="auth-gate__label">Confirm PIN</label>
            <input
              className="form-input"
              type="password"
              placeholder="Re-enter your PIN"
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
            />
          </div>
          {error && <div className="auth-gate__error">{error}</div>}
          <button type="submit" className="btn btn--primary auth-gate__submit">
            Create PIN
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Login Screen ────────────────────────────────────────────── */

function LoginScreen({ onSubmit, error }) {
  const [pin, setPin] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(pin)
  }

  return (
    <div className="auth-gate">
      <div className="auth-gate__card">
        <div className="auth-gate__icon">🔐</div>
        <h1 className="auth-gate__title">Enter Your PIN</h1>
        <p className="auth-gate__subtitle">
          Enter your PIN to access your business plans.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="auth-gate__field">
            <label className="auth-gate__label">PIN</label>
            <input
              className="form-input"
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
              inputMode="numeric"
            />
          </div>
          {error && <div className="auth-gate__error">{error}</div>}
          <button type="submit" className="btn btn--primary auth-gate__submit">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}