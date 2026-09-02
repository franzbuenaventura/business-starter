import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

/* ── Debounce Hook ─────────────────────────────────────────── */

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/* ── Status Helpers ────────────────────────────────────────── */

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
]

import SectionI from './sections/SectionI.jsx'
import SectionII from './sections/SectionII.jsx'
import SectionIII from './sections/SectionIII.jsx'
import SectionIV from './sections/SectionIV.jsx'
import SectionV from './sections/SectionV.jsx'
import SectionVI from './sections/SectionVI.jsx'
import SectionVII from './sections/SectionVII.jsx'
import SectionVIII from './sections/SectionVIII.jsx'
import SectionIX from './sections/SectionIX.jsx'
import SectionX from './sections/SectionX.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import OfflineIndicator from './components/OfflineIndicator.jsx'
import AiDraftButton from './components/AiDraftButton.jsx'
import { useOfflineSync } from './hooks/useOfflineSync.js'
import { apiFetch, clearToken } from './api.js'
import './styles.css'
import './print.css'

const API = '/api/businesses'
const SECTIONS = [
  { key: 'I', label: 'Executive Summary' },
  { key: 'II', label: 'Company Description' },
  { key: 'III', label: 'Products & Services' },
  { key: 'IV', label: 'Marketing Plan' },
  { key: 'V', label: 'Operational Plan' },
  { key: 'VI', label: 'Management & Organization' },
  { key: 'VII', label: 'Startup Expenses & Capitalization' },
  { key: 'VIII', label: 'Financial Plan' },
  { key: 'IX', label: 'Appendices' },
  { key: 'X', label: 'Refining the Plan' },
]

const SECTION_COMPONENTS = {
  I: SectionI, II: SectionII, III: SectionIII, IV: SectionIV,
  V: SectionV, VI: SectionVI, VII: SectionVII, VIII: SectionVIII,
  IX: SectionIX, X: SectionX,
}

/* ── Helpers ────────────────────────────────────────────────── */

function hasSectionData(data) {
  if (!data) return false
  let parsed = data
  if (typeof data === 'string') {
    try { parsed = JSON.parse(data) } catch { return false }
  }
  if (!parsed || typeof parsed !== 'object') return false
  return Object.values(parsed).some(v => {
    if (v == null) return false
    if (typeof v === 'string') return v.trim() !== ''
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.values(v).some(x => x != null && String(x).trim() !== '')
    return true
  })
}

function countCompletedSections(sections) {
  return SECTIONS.filter(s => hasSectionData(sections?.[s.key])).length
}

function formatDate(ts) {
  if (!ts) return ''
  try {
    const d = new Date(ts)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '' }
}

/* ── Status helpers ─────────────────────────────────────────── */

const STATUS_LABELS = { draft: 'Draft', 'in-progress': 'In Progress', complete: 'Complete' }
const STATUS_COLORS = {
  draft: 'status-badge--draft',
  'in-progress': 'status-badge--in-progress',
  complete: 'status-badge--complete',
}
const STATUSES_SET = new Set(['draft', 'in-progress', 'complete'])

function calcAutoStatus(sections) {
  const completed = countCompletedSections(sections)
  if (completed === 0) return 'draft'
  if (completed >= 10) return 'complete'
  return 'in-progress'
}

function getDisplayStatus(business) {
  if (business.status && STATUSES_SET.has(business.status)) return business.status
  return calcAutoStatus(business.sections)
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status
}

/* ── App ────────────────────────────────────────────────────── */

export default function App() {
  const [businesses, setBusinesses] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { isOnline, pendingCount, syncing, queueOperation, syncQueue } = useOfflineSync()
  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const debouncedSearch = useDebounced(searchQuery, 300)

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(API)
      const data = await res.json()
      setBusinesses(data)
    } catch {
      setBusinesses([])
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Collect unique industries for the filter dropdown
  const industries = useMemo(() => {
    if (!businesses) return []
    const set = new Set(businesses.map(b => b.industry).filter(Boolean))
    return Array.from(set).sort()
  }, [businesses])

  // Filter businesses based on search + filters
  const filteredBusinesses = useMemo(() => {
    if (!businesses) return null
    const q = debouncedSearch.trim().toLowerCase()
    return businesses.filter(b => {
      if (q) {
        const name = (b.name || '').toLowerCase()
        const industry = (b.industry || '').toLowerCase()
        if (!name.includes(q) && !industry.includes(q)) return false
      }
      if (industryFilter !== 'all' && b.industry !== industryFilter) return false
      if (statusFilter !== 'all') {
        if (getDisplayStatus(b) !== statusFilter) return false
      }
      return true
    })
  }, [businesses, debouncedSearch, statusFilter, industryFilter])

  const hasActiveFilters = searchQuery.trim() || statusFilter !== 'all' || industryFilter !== 'all'

  async function addBusiness(name, industry) {
    if (!isOnline) {
      queueOperation('POST', API, { name, industry })
    } else {
      await apiFetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, industry })
      })
    }
    setShowCreate(false)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    if (!isOnline) {
      queueOperation('DELETE', `${API}/${deleteTarget.id}`)
    } else {
      await apiFetch(`${API}/${deleteTarget.id}`, { method: 'DELETE' })
    }
    if (selectedId === deleteTarget.id) setSelectedId(null)
    setDeleteTarget(null)
    load()
  }

  async function handleExport() {
    try {
      const res = await apiFetch('/api/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'business-starter-backup.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export failed:', e)
    }
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const res = await apiFetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Import failed')
      load()
    } catch (err) {
      console.error('Import failed:', err)
      alert('Import failed: ' + err.message)
    }
    e.target.value = ''
  }

  if (selectedId) {
    return <PlanView id={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <>
      <header className="app-header">
        <span className="app-header__logo">🚀</span>
        <div>
          <div className="app-header__title">Business Starter</div>
          <div className="app-header__subtitle">SCORE Business Plan Builder</div>
        </div>
        <ThemeToggle />
      </header>

      <main className="dashboard">
        <div className="dashboard__toolbar">
          <button className="btn btn--secondary" onClick={handleExport}>
            ⬇ Export All
          </button>
          <label className="btn btn--secondary" style={{ cursor: 'pointer' }}>
            ⬆ Import
            <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
          </label>
        </div>
        {businesses === null ? (
          <div className="skeleton-grid">
            {[0,1,2].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        ) : businesses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h2 className="empty-state__title">No business plans yet</h2>
            <p className="empty-state__text">Create your first business plan to get started with the 10-section SCORE builder.</p>
            <button className="btn btn--primary" onClick={() => setShowCreate(true)}>
              + Create Your First Plan
            </button>
          </div>
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div className="dashboard__search-filter">
              <div className="search-bar">
                <span className="search-bar__icon">🔍</span>
                <input
                  className="search-bar__input form-input"
                  type="text"
                  placeholder="Search by business name or industry…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="search-bar__clear" onClick={() => setSearchQuery('')} title="Clear search">✕</button>
                )}
              </div>
              <div className="filter-bar">
                <select
                  className="filter-bar__select form-input"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <select
                  className="filter-bar__select form-input"
                  value={industryFilter}
                  onChange={e => setIndustryFilter(e.target.value)}
                >
                  <option value="all">All Industries</option>
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                {hasActiveFilters && (
                  <button className="filter-bar__clear" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setIndustryFilter('all') }}>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">🔍</div>
                <h2 className="empty-state__title">No results found</h2>
                <p className="empty-state__text">
                  {hasActiveFilters
                    ? 'No business plans match your search or filters. Try adjusting your criteria.'
                    : 'No business plans match your search.'}
                </p>
                {hasActiveFilters && (
                  <button className="btn btn--secondary" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setIndustryFilter('all') }}>
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="dashboard__grid">
                <button className="create-card" onClick={() => setShowCreate(true)}>
                  <span className="create-card__icon">➕</span>
                  <span className="create-card__label">Create New Plan</span>
                  <span className="create-card__sub">Start a new business plan</span>
                </button>
                {filteredBusinesses.map(b => {
                  const completed = countCompletedSections(b.sections)
                  const pct = Math.round((completed / 10) * 100)
                  const status = getDisplayStatus(b)
                  return (
                    <div key={b.id} className="biz-card" onClick={() => setSelectedId(b.id)}>
                      <button className="biz-card__delete" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: b.id, name: b.name }) }}>✕</button>
                      <div className="biz-card__top">
                        <span className={`status-badge ${STATUS_COLORS[status]}`}>{STATUS_LABELS[status]}</span>
                      </div>
                      <div className="biz-card__name">{b.name}</div>
                      {b.industry && <div className="biz-card__industry">{b.industry}</div>}
                      <div className="biz-card__meta">
                        <span className="biz-card__date">Created {formatDate(b.createdAt || b.created_at)}</span>
                      </div>
                      <div className="biz-card__progress">
                        <div className="biz-card__progress-bar">
                          <div className="biz-card__progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="biz-card__progress-text">{completed}/10</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreate={addBusiness} />
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal confirm" onClick={e => e.stopPropagation()}>
            <div className="confirm__icon">⚠️</div>
            <div className="confirm__text">
              Delete <strong>{deleteTarget.name}</strong>?<br />
              This action cannot be undone.
            </div>
            <div className="modal__actions">
              <button className="btn btn--secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn--danger" onClick={confirmDelete}>Delete Plan</button>
            </div>
          </div>
        </div>
      )}

      <OfflineIndicator isOnline={isOnline} pendingCount={pendingCount} syncing={syncing} />
    </>
  )
}

/* ── Status Override ─────────────────────────────────────────── */

function StatusOverride({ plan, onUpdate }) {
  const current = getDisplayStatus(plan)
  const [status, setStatus] = useState(plan.status || 'auto')

  useEffect(() => {
    setStatus(plan.status || 'auto')
  }, [plan.id, plan.status])

  async function handleChange(e) {
    const value = e.target.value
    setStatus(value)
    try {
      const res = await apiFetch(`${API}/${plan.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value === 'auto' ? null : value })
      })
      const updated = await res.json()
      onUpdate(updated)
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  return (
    <div className="status-override">
      <label className="status-override__label">Status</label>
      <select className="status-override__select form-input" value={status} onChange={handleChange}>
        <option value="auto">Auto ({STATUS_LABELS[current]})</option>
        <option value="draft">Draft</option>
        <option value="in-progress">In Progress</option>
        <option value="complete">Complete</option>
      </select>
    </div>
  )
}

/* ── Create Modal ───────────────────────────────────────────── */

function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [mode, setMode] = useState('blank') // 'blank' | 'template'
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'template' && templates.length === 0) {
      fetch('/api/templates').then(r => r.json()).then(setTemplates).catch(() => {})
    }
  }, [mode, templates.length])

  async function handleTemplateSubmit(e) {
    e.preventDefault()
    if (!selectedTemplate) return
    setLoading(true)
    try {
      const res = await fetch('/api/businesses/from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: selectedTemplate, name: name.trim() || undefined })
      })
      if (!res.ok) throw new Error('Failed to create from template')
      onClose()
      window.location.reload()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), industry.trim())
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal__title">New Business Plan</h2>
        <p className="modal__subtitle">Start building your SCORE business plan.</p>

        <div className="modal__tabs">
          <button
            className={`modal__tab ${mode === 'blank' ? 'modal__tab--active' : ''}`}
            onClick={() => { setMode('blank'); setSelectedTemplate(null) }}
          >Start Blank</button>
          <button
            className={`modal__tab ${mode === 'template' ? 'modal__tab--active' : ''}`}
            onClick={() => setMode('template')}
          >From Template</button>
        </div>

        {mode === 'blank' ? (
          <form onSubmit={handleSubmit}>
            <div className="modal__field">
              <label className="modal__label">Business Name</label>
              <input className="form-input" placeholder="e.g. Acme Coffee Co." value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
            <div className="modal__field">
              <label className="modal__label">Industry (optional)</label>
              <input className="form-input" placeholder="e.g. Food & Beverage" value={industry} onChange={e => setIndustry(e.target.value)} />
            </div>
            <div className="modal__actions">
              <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={!name.trim()}>Create Plan</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTemplateSubmit}>
            <div className="modal__field">
              <label className="modal__label">Choose a Template</label>
              <div className="template-list">
                {templates.map(t => (
                  <button
                    type="button"
                    key={t.id}
                    className={`template-card ${selectedTemplate === t.id ? 'template-card--selected' : ''}`}
                    onClick={() => { setSelectedTemplate(t.id); setName(''); setIndustry('') }}
                  >
                    <span className="template-card__name">{t.name}</span>
                    <span className="template-card__desc">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>
            {selectedTemplate && (
              <div className="modal__field">
                <label className="modal__label">Business Name (optional — uses template default if blank)</label>
                <input className="form-input" placeholder="Custom name or leave blank for template default" value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div className="modal__actions">
              <button type="button" className="btn btn--secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={!selectedTemplate || loading}>
                {loading ? 'Creating...' : 'Create from Template'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ── Plan View ──────────────────────────────────────────────── */

function PlanView({ id, onBack }) {
  const [plan, setPlan] = useState(null)
  const [activeTab, setActiveTab] = useState('I')
  const [sectionData, setSectionData] = useState({})
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved'
  const [printMode, setPrintMode] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const saveTimerRef = useRef(null)
  const pendingDataRef = useRef(null)
  const activeTabRef = useRef('I')
  const contentRef = useRef(null)

  useEffect(() => {
    apiFetch(`${API}/${id}`)
      .then(r => r.json())
      .then(data => {
        setPlan(data)
        setSectionData(data.sections || {})
      })
      .catch(() => setPlan({ error: true }))
  }, [id])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  // Keep ref in sync
  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  // Move focus to the new section content after tab switch (accessibility)
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus()
    }
  }, [activeTab])

  // Keyboard shortcuts: Ctrl+Left/Right to navigate sections, Ctrl+S to save
  useEffect(() => {
    function handleKeyDown(e) {
      // Ctrl+Left → previous section
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        const idx = SECTIONS.findIndex(s => s.key === activeTabRef.current)
        if (idx > 0) {
          handleTabSwitch(SECTIONS[idx - 1].key)
        }
        return
      }
      // Ctrl+Right → next section
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        const idx = SECTIONS.findIndex(s => s.key === activeTabRef.current)
        if (idx < SECTIONS.length - 1) {
          handleTabSwitch(SECTIONS[idx + 1].key)
        }
        return
      }
      // Ctrl+S → flush save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        flushSave()
        return
      }
      // '?' → toggle shortcut hints (Shift+/ = ?)
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(prev => !prev)
        return
      }
      // Escape → close shortcut hints
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false)
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flushSave, showShortcuts])

  // Debounced save function
  const scheduleSave = useCallback((key, content) => {
    pendingDataRef.current = { key, content }
    setSaveStatus('saving')

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    saveTimerRef.current = setTimeout(async () => {
      const { key: k, content: c } = pendingDataRef.current
      const url = `${API}/${id}/sections/${k}`
      const body = { content: c }
      if (!navigator.onLine) {
        // Queue for later sync
        const queue = JSON.parse(localStorage.getItem('business-starter-offline-queue') || '[]')
        queue.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, method: 'PUT', url, body, ts: Date.now() })
        localStorage.setItem('business-starter-offline-queue', JSON.stringify(queue))
        setSectionData(prev => ({ ...prev, [k]: c }))
      } else {
        try {
          await apiFetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          })
          setSectionData(prev => ({ ...prev, [k]: c }))
        } catch (e) {
          console.error('Autosave failed:', e)
        }
      }
      setSaveStatus('saved')
      setTimeout(() => {
        setSaveStatus('idle')
      }, 2000)
      saveTimerRef.current = null
    }, 1500)
  }, [id])

  // Flush pending save immediately (used on tab switch)
  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
      const { key, content } = pendingDataRef.current
      if (key && content !== undefined) {
        const url = `${API}/${id}/sections/${key}`
        const body = { content }
        setSaveStatus('saving')
        if (!navigator.onLine) {
          const queue = JSON.parse(localStorage.getItem('business-starter-offline-queue') || '[]')
          queue.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, method: 'PUT', url, body, ts: Date.now() })
          localStorage.setItem('business-starter-offline-queue', JSON.stringify(queue))
          setSectionData(prev => ({ ...prev, [key]: content }))
        } else {
          try {
            await apiFetch(url, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            })
            setSectionData(prev => ({ ...prev, [key]: content }))
          } catch (e) {
            console.error('Flush save failed:', e)
          }
        }
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    }
  }, [id])

  function handleTabSwitch(newKey) {
    if (newKey === activeTab) return
    // Flush any pending save before switching
    if (saveTimerRef.current) {
      flushSave()
    }
    setActiveTab(newKey)
  }

  function handleExportPDF() {
    setPrintMode(true)
    // Give React time to render all sections before printing
    setTimeout(() => {
      window.print()
      setPrintMode(false)
    }, 300)
  }

  const completedCount = useMemo(() => countCompletedSections(sectionData), [sectionData])
  const pct = Math.round((completedCount / 10) * 100)

  if (!plan) {
    return (
      <div className="plan-layout">
        <div className="plan-sidebar">
          <div className="plan-sidebar__header">
            <button className="plan-sidebar__back" onClick={onBack}>← Back</button>
          </div>
        </div>
        <div className="plan-main">
          <div className="spinner">
            <div className="spinner__ring" />
            <div className="spinner__text">Loading plan…</div>
          </div>
        </div>
      </div>
    )
  }

  if (plan.error) {
    return (
      <div className="plan-layout">
        <div className="plan-main">
          <div className="spinner">
            <div className="empty-state__icon">⚠️</div>
            <div className="spinner__text">Failed to load plan.</div>
            <button className="btn btn--secondary" onClick={onBack}>← Back</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Print Mode: render all sections stacked ──
  if (printMode) {
    return (
      <div className="plan-layout">
        <div className="plan-main">
          <div className="plan-content">
            <div className="print-doc-header">
              <div className="print-doc-header__name">{plan.name}</div>
              {plan.industry && <div className="print-doc-header__industry">{plan.industry}</div>}
              <hr className="print-doc-header__rule" />
            </div>
            {SECTIONS.map(s => {
              const SectionComponent = SECTION_COMPONENTS[s.key]
              const raw = sectionData[s.key]
              const parsed = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : {}
              return (
                <div className="print-section" key={s.key}>
                  <div className="print-section__number">Section {s.key}</div>
                  <h2 className="print-section__title">{s.label}</h2>
                  {SectionComponent ? (
                    <SectionComponent data={parsed} onChange={() => {}} />
                  ) : (
                    <div>Section not available.</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="plan-layout">
      {/* Keyboard shortcut hints overlay */}
      {showShortcuts && (
        <div className="shortcut-hints" onClick={() => setShowShortcuts(false)}>
          <div className="shortcut-hints__panel" onClick={e => e.stopPropagation()}>
            <div className="shortcut-hints__title">Keyboard Shortcuts</div>
            <div className="shortcut-hints__row">
              <span className="shortcut-hints__keys"><kbd>Ctrl</kbd> + <kbd>←</kbd></span>
              <span className="shortcut-hints__desc">Previous section</span>
            </div>
            <div className="shortcut-hints__row">
              <span className="shortcut-hints__keys"><kbd>Ctrl</kbd> + <kbd>→</kbd></span>
              <span className="shortcut-hints__desc">Next section</span>
            </div>
            <div className="shortcut-hints__row">
              <span className="shortcut-hints__keys"><kbd>Ctrl</kbd> + <kbd>S</kbd></span>
              <span className="shortcut-hints__desc">Save now</span>
            </div>
            <div className="shortcut-hints__row">
              <span className="shortcut-hints__keys"><kbd>?</kbd></span>
              <span className="shortcut-hints__desc">Toggle this help</span>
            </div>
            <div className="shortcut-hints__row">
              <span className="shortcut-hints__keys"><kbd>Esc</kbd></span>
              <span className="shortcut-hints__desc">Close this help</span>
            </div>
            <button className="btn btn--secondary shortcut-hints__close" onClick={() => setShowShortcuts(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="plan-sidebar">
        <div className="plan-sidebar__header">
          <button className="plan-sidebar__back" onClick={onBack}>← Dashboard</button>
          <div className="plan-sidebar__biz-name">{plan.name}</div>
          {plan.industry && <div className="plan-sidebar__biz-industry">{plan.industry}</div>}
          <StatusOverride plan={plan} onUpdate={setPlan} />
        </div>

        <div className="plan-progress">
          <div className="plan-progress__bar">
            <div className="plan-progress__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="plan-progress__text">{completedCount}/10 sections completed · {pct}%</div>
        </div>

        <nav className="plan-nav">
          {SECTIONS.map(s => {
            const completed = hasSectionData(sectionData[s.key])
            const active = activeTab === s.key
            return (
              <button
                key={s.key}
                className={`plan-nav__item ${active ? 'plan-nav__item--active' : ''} ${completed ? 'plan-nav__item--completed' : ''}`}
                onClick={() => handleTabSwitch(s.key)}
              >
                <span className="plan-nav__num">
                  {completed && !active ? '✓' : s.key}
                </span>
                <span className="plan-nav__label">{s.label}</span>
                {completed && active && <span className="plan-nav__check">✓</span>}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="plan-main">
        <header className="plan-header">
          <span className="plan-header__title">Section {activeTab}</span>
          <span className="plan-header__badge">{SECTIONS.find(s => s.key === activeTab)?.label}</span>
          <div className="plan-header__status save-status">
            <span className={`plan-header__status-dot ${saveStatus === 'saving' ? 'plan-header__status-dot--saving' : 'plan-header__status-dot--saved'}`} style={{ opacity: saveStatus === 'idle' ? 0.3 : 1 }} />
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : 'All changes saved'}
          </div>
          <button className="btn btn--secondary plan-header__export" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
        </header>

        <div
          className="plan-content"
          ref={contentRef}
          tabIndex={-1}
          aria-label={`Section ${activeTab}: ${SECTIONS.find(s => s.key === activeTab)?.label || ''}`}
        >
          <SectionRouter
            sectionKey={activeTab}
            sectionLabel={SECTIONS.find(s => s.key === activeTab)?.label || ''}
            sectionData={sectionData[activeTab]}
            businessId={plan.id}
            onSave={(content) => scheduleSave(activeTab, content)}
            saveStatus={saveStatus}
          />
        </div>

        {/* Keyboard shortcut hint footer */}
        <footer className="plan-footer">
          <span className="plan-footer__hint">
            <kbd>Ctrl</kbd>+<kbd>←</kbd>/<kbd>→</kbd> switch sections · <kbd>Ctrl</kbd>+<kbd>S</kbd> save · <kbd>?</kbd> shortcuts
          </span>
        </footer>
      </div>
    </div>
  )
}

/* ── Section Router ─────────────────────────────────────────── */

function SectionRouter({ sectionKey, sectionLabel, sectionData, businessId, onSave, saveStatus }) {
  const [localData, setLocalData] = useState(null)
  const dirtyRef = useRef(false)
  const localDataRef = useRef(null)
  const onSaveRef = useRef(onSave)

  // Keep onSaveRef current
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  useEffect(() => {
    const parsed = typeof sectionData === 'string' ? JSON.parse(sectionData) : sectionData
    setLocalData(parsed || {})
    localDataRef.current = parsed || {}
    dirtyRef.current = false
  }, [sectionKey, sectionData])

  const handleChange = useCallback((newData) => {
    setLocalData(newData)
    localDataRef.current = newData
    dirtyRef.current = true
    onSaveRef.current(newData)
  }, [])

  const handleAiAccept = useCallback((draft) => {
    const merged = { ...(localData || {}), ...draft }
    setLocalData(merged)
    localDataRef.current = merged
    dirtyRef.current = true
    onSaveRef.current(merged)
  }, [localData])

  const SectionComponent = SECTION_COMPONENTS[sectionKey]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <AiDraftButton businessId={businessId} sectionId={sectionKey} onAccept={handleAiAccept} />
      </div>
      {SectionComponent ? (
        <SectionComponent data={localData} onChange={handleChange} />
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🚧</div>
          <div className="empty-state__title">Section not found</div>
          <div className="empty-state__text">This section component could not be loaded.</div>
        </div>
      )}

      <div className="save-bar save-status">
        <div className="save-bar__status">
          {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : 'All changes saved'}
        </div>
      </div>
    </div>
  )
}
