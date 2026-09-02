import { useState, useEffect, useCallback, useRef } from 'react'

/* ============================================================
   useOfflineSync — queue mutations while offline, sync when back
   Stores pending operations in localStorage under a queue key.
   Each op: { id, method, url, body, ts }
   ============================================================ */

const QUEUE_KEY = 'business-starter-offline-queue'

function readQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch (e) {
    console.error('Failed to write offline queue:', e)
  }
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingCount, setPendingCount] = useState(readQueue().length)
  const [syncing, setSyncing] = useState(false)
  const syncingRef = useRef(false)

  // Track online/offline state
  useEffect(() => {
    function goOnline() {
      setIsOnline(true)
    }
    function goOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  // Queue a mutation (PUT, POST, DELETE) for later sync
  const queueOperation = useCallback((method, url, body) => {
    const queue = readQueue()
    const op = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      method,
      url,
      body: body || null,
      ts: Date.now(),
    }
    queue.push(op)
    writeQueue(queue)
    setPendingCount(queue.length)
  }, [])

  // Attempt to flush all queued operations
  const syncQueue = useCallback(async () => {
    if (syncingRef.current) return
    const queue = readQueue()
    if (queue.length === 0) return

    syncingRef.current = true
    setSyncing(true)

    const remaining = []
    for (const op of queue) {
      try {
        const res = await fetch(op.url, {
          method: op.method,
          headers: op.body ? { 'Content-Type': 'application/json' } : undefined,
          body: op.body ? JSON.stringify(op.body) : undefined,
        })
        if (!res.ok && res.status >= 400 && res.status < 500) {
          // Permanent failure (client error) — drop the op
          console.warn('Dropping failed op:', op, res.status)
        } else {
          // Success or server error (retry later on 5xx)
          if (res.status >= 500) remaining.push(op)
        }
      } catch (e) {
        // Network still down — keep in queue
        remaining.push(op)
      }
    }
    writeQueue(remaining)
    setPendingCount(remaining.length)
    syncingRef.current = false
    setSyncing(false)
  }, [])

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncQueue()
    }
  }, [isOnline, pendingCount, syncQueue])

  return { isOnline, pendingCount, syncing, queueOperation, syncQueue }
}