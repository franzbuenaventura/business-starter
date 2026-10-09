/* ============================================================
   OfflineIndicator — shows a banner when offline or syncing
   ============================================================ */

export default function OfflineIndicator({ isOnline, pendingCount, syncing }) {
  if (isOnline && pendingCount === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full border border-divider bg-content1/90 backdrop-blur text-xs shadow-lg">
      {!isOnline ? (
        <>
          <span className="text-warning">●</span>
          <span>You're offline. Changes will be saved locally and synced when you reconnect.</span>
        </>
      ) : syncing ? (
        <>
          <span className="text-primary animate-spin inline-block">⟳</span>
          <span>Syncing {pendingCount} pending change{pendingCount !== 1 ? 's' : ''}…</span>
        </>
      ) : (
        <>
          <span className="text-warning">●</span>
          <span>{pendingCount} change{pendingCount !== 1 ? 's' : ''} queued for sync.</span>
        </>
      )}
    </div>
  )
}