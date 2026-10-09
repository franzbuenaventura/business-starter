import { useState, useEffect, useCallback } from 'react'
import { Card, CardBody, Input, Button } from '@heroui/react'
import { apiFetch, getToken, setToken, clearToken } from '../api.js'

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground-500">
        <div className="w-8 h-8 rounded-full border-2 border-divider border-t-primary animate-spin" />
        <p className="text-sm">Loading…</p>
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

/* ── PIN Card shell ─────────────────────────────────────────── */

function AuthCard({ icon, title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card shadow="none" className="border border-divider bg-content1 w-full max-w-sm">
        <CardBody className="px-6 py-8 flex flex-col items-center text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-sm text-foreground-500 mb-6 leading-relaxed">{subtitle}</p>
          {children}
        </CardBody>
      </Card>
    </div>
  )
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
    <AuthCard
      title="Set Up Your PIN"
      subtitle="First time here? Create a PIN to secure your business plans. You'll need this PIN every time you access the app."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          type="password" variant="bordered" label="Create PIN"
          placeholder="At least 4 characters"
          value={pin}
          onValueChange={setPin}
          autoFocus
          inputMode="numeric"
        />
        <Input
          type="password" variant="bordered" label="Confirm PIN"
          placeholder="Re-enter your PIN"
          value={confirmPin}
          onValueChange={setConfirmPin}
        />
        {error && <div className="text-xs text-danger px-3 py-2 rounded-lg bg-danger-100/20">{error}</div>}
        <Button type="submit" color="primary" className="w-full">Create PIN</Button>
      </form>
    </AuthCard>
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
    <AuthCard title="Enter Your PIN" subtitle="Enter your PIN to access your business plans.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          type="password" variant="bordered" label="PIN"
          placeholder="Enter your PIN"
          value={pin}
          onValueChange={setPin}
          autoFocus
          inputMode="numeric"
        />
        {error && <div className="text-xs text-danger px-3 py-2 rounded-lg bg-danger-100/20">{error}</div>}
        <Button type="submit" color="primary" className="w-full">Unlock</Button>
      </form>
    </AuthCard>
  )
}