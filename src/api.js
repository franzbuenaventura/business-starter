/**
 * API helper – wraps fetch with auth token injection and 401 handling.
 */

const TOKEN_KEY = 'bs_auth_token'

function safeStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null
  } catch {
    return null
  }
}

export function getToken() {
  const s = safeStorage()
  return s ? s.getItem(TOKEN_KEY) : null
}

export function setToken(token) {
  const s = safeStorage()
  if (s) s.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  const s = safeStorage()
  if (s) s.removeItem(TOKEN_KEY)
}

/**
 * Authenticated fetch wrapper.
 * Adds Authorization header if a token exists.
 * On 401, clears the token and reloads to trigger login screen.
 */
export async function apiFetch(url, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.headers || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    clearToken()
    // Trigger a page reload so AuthGate shows the login screen
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload()
    }
    throw new Error('Session expired')
  }

  return res
}