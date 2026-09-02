/* ============================================================
   OfflineIndicator — shows a banner when offline or syncing
   ============================================================ */

export default function OfflineIndicator({ isOnline, pendingCount, syncing }) {
  if (isOnline && pendingCount === 0) return null

  return (
    <div className={`offline-indicator ${isOnline ? 'offline-indicator--syncing' : ''}`}>
      {!isOnline ? (
        <>
          <span className="offline-indicator__dot">●</span>
          <span>You're offline. Changes will be saved locally and synced when you reconnect.</span>
        </>
      ) : syncing ? (
        <>
          <span className="offline-indicator__dot offline-indicator__dot--syncing">⟳</span>
          <span>Syncing {pendingCount} pending change{pendingCount !== 1 ? 's' : ''}…</span>
        </>
      ) : (
        <>
          <span className="offline-indicator__dot">●</span>
          <span>{pendingCount} change{pendingCount !== 1 ? 's' : ''} queued for sync.</span>
        </>
      )}
    </div>
  )
}