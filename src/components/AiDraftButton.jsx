import { useState, useCallback } from 'react'
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from '@heroui/react'
import { apiFetch } from '../api.js'

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
      const res = await apiFetch('/api/ai-draft', {
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
      <Modal isOpen onClose={handleReject} size="lg" backdrop="blur">
        <ModalContent>
          <ModalHeader className="gap-2"><span>✨</span> AI Draft Preview</ModalHeader>
          <ModalBody>
            {Object.entries(draft).map(([key, val]) => (
              <div key={key}>
                <div className="text-xs font-semibold text-foreground-500 mb-1">{formatLabel(key)}</div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap px-3 py-2 rounded-lg bg-content2 border border-divider">
                  {String(val)}
                </div>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" variant="flat" onPress={handleReject}>Reject</Button>
            <Button size="sm" variant="flat" onPress={handleAccept}>Edit & Accept</Button>
            <Button size="sm" color="primary" onPress={handleAccept}>Accept</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        size="sm" variant="light" className="text-foreground-500 hover:text-primary data-[hover=true]:bg-content3"
        isDisabled={loading || disabled}
        onClick={generate}
        startContent={loading ? <Spinner size="sm" /> : <span>✨</span>}
      >
        {loading ? 'Generating…' : 'AI Draft'}
      </Button>
      {error && (
        <span className="text-xs text-danger">⚠ {error}</span>
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