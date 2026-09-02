import { useState, useCallback } from 'react'

/**
 * AI Draft Button — calls POST /api/ai-draft with { businessId, sectionId },
 * shows a loading state, then lets the user accept (merge into section data),
 * edit (accept and focus first field), or reject (discard) the generated draft.
 *
 * Props:
 *   businessId  - number (required)
 *   sectionId   - string key, e.g. "I", "II" (required)
 *   onAccept    - (draftData: Record<string,string>) => void  (required)
 *   disabled    - boolean
 */
export default function AiDraftButton({ businessId, sectionId, onAccept, disabled }) {
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(null) // Record<string,string> | null
  const [error, setError] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setDraft(null)
    setShowPreview(false)
    try {
      const res = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, sectionId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      if (data.content && typeof data.content === 'object') {
        setDraft(data.content)
        setShowPreview(true)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (e) {
      setError(String(e.message || e))
    } finally {
      setLoading(false)
    }
  }, [businessId, sectionId])

  const handleAccept = useCallback(() => {
    if (draft) onAccept(draft)
    setDraft(null)
    setShowPreview(false)
  }, [draft, onAccept])

  const handleReject = useCallback(() => {
    setDraft(null)
    setShowPreview(false)
  }, [])

  if (showPreview && draft) {
    return (
      <div style={previewStyles.overlay}>
        <div style={previewStyles.card}>
          <div style={previewStyles.header}>
            <span style={previewStyles.icon}>✨</span>
            <span style={previewStyles.title}>AI Draft Preview</span>
          </div>
          <div style={previewStyles.body}>
            {Object.entries(draft).map(([key, val]) => (
              <div key={key} style={previewStyles.field}>
                <div style={previewStyles.fieldLabel}>{formatLabel(key)}</div>
                <div style={previewStyles.fieldValue}>{String(val)}</div>
              </div>
            ))}
          </div>
          <div style={previewStyles.actions}>
            <button className="btn btn--secondary" onClick={handleReject}>Reject</button>
            <button className="btn btn--secondary" onClick={() => { handleAccept() }}>Edit & Accept</button>
            <button className="btn btn--primary" onClick={handleAccept}>Accept</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button
        className="btn btn--secondary"
        disabled={loading || disabled}
        onClick={generate}
        style={loading ? { opacity: 0.6, cursor: 'wait' } : {}}
      >
        {loading ? (
          <>
            <span style={spinnerStyle} />
            Generating…
          </>
        ) : (
          <>✨ AI Draft</>
        )}
      </button>
      {error && (
        <span style={{ fontSize: 12, color: '#e53935' }}>
          ⚠ {error}
        </span>
      )}
    </div>
  )
}

function formatLabel(key) {
  // camelCase → Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, c => c.toUpperCase())
    .trim()
}

const spinnerStyle = {
  display: 'inline-block',
  width: 14,
  height: 14,
  border: '2px solid #ccc',
  borderTopColor: '#666',
  borderRadius: '50%',
  animation: 'ai-spin 0.6s linear infinite',
}

const previewStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  card: {
    background: 'var(--bg-card, #fff)',
    borderRadius: 12,
    maxWidth: 640,
    width: '90%',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '16px 20px',
    borderBottom: '1px solid #e0e0e0',
    fontSize: 16,
    fontWeight: 600,
  },
  icon: { fontSize: 20 },
  title: { fontSize: 16, fontWeight: 600 },
  body: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    lineHeight: 1.5,
    color: '#333',
    whiteSpace: 'pre-wrap',
    padding: '8px 12px',
    background: 'var(--bg-hover, #f5f5f5)',
    borderRadius: 6,
    border: '1px solid #e8e8e8',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    padding: '12px 20px',
    borderTop: '1px solid #e0e0e0',
  },
}