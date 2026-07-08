import { useState, useEffect, useCallback, useMemo } from 'react'
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
import './styles.css'

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
  // Check if any value is non-empty
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

/* ── App ────────────────────────────────────────────────────── */

export default function App() {
  const [businesses, setBusinesses] = useState(null) // null = loading, [] = loaded
  const [selectedId, setSelectedId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setBusinesses(data)
    } catch {
      setBusinesses([])
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function addBusiness(name, industry) {
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, industry })
    })
    setShowCreate(false)
    load()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await fetch(`${API}/${deleteTarget.id}`, { method: 'DELETE' })
    if (selectedId === deleteTarget.id) setSelectedId(null)
    setDeleteTarget(null)
    load()
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
      </header>

      <main className="dashboard">
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
          <div className="dashboard__grid">
            <button className="create-card" onClick={() => setShowCreate(true)}>
              <span className="create-card__icon">➕</span>
              <span className="create-card__label">Create New Plan</span>
              <span className="create-card__sub">Start a new business plan</span>
            </button>
            {businesses.map(b => {
              const completed = countCompletedSections(b.sections)
              const pct = Math.round((completed / 10) * 100)
              return (
                <div key={b.id} className="biz-card" onClick={() => setSelectedId(b.id)}>
                  <button className="biz-card__delete" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: b.id, name: b.name }) }}>✕</button>
                  <div className="biz-card__name">{b.name}</div>
                  {b.industry && <div className="biz-card__industry">{b.industry}</div>}
                  <div className="biz-card__date">Created {formatDate(b.createdAt || b.created_at)}</div>
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
    </>
  )
}

/* ── Create Modal ───────────────────────────────────────────── */

function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')

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
      </div>
    </div>
  )
}

/* ── Plan View ──────────────────────────────────────────────── */

function PlanView({ id, onBack }) {
  const [plan, setPlan] = useState(null)
  const [activeTab, setActiveTab] = useState('I')
  const [sectionData, setSectionData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then(r => r.json())
      .then(data => {
        setPlan(data)
        setSectionData(data.sections || {})
      })
      .catch(() => setPlan({ error: true }))
  }, [id])

  async function saveSection(key, content) {
    setSaving(true)
    await fetch(`${API}/${id}/sections/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    setSectionData(prev => ({ ...prev, [key]: content }))
    setSaving(false)
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

  return (
    <div className="plan-layout">
      {/* Sidebar */}
      <aside className="plan-sidebar">
        <div className="plan-sidebar__header">
          <button className="plan-sidebar__back" onClick={onBack}>← Dashboard</button>
          <div className="plan-sidebar__biz-name">{plan.name}</div>
          {plan.industry && <div className="plan-sidebar__biz-industry">{plan.industry}</div>}
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
                onClick={() => setActiveTab(s.key)}
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
          <div className="plan-header__status">
            <span className={`plan-header__status-dot ${saving ? 'plan-header__status-dot--saving' : 'plan-header__status-dot--saved'}`} />
            {saving ? 'Saving…' : 'All changes saved'}
          </div>
        </header>

        <div className="plan-content">
          <SectionRouter
            sectionKey={activeTab}
            sectionLabel={SECTIONS.find(s => s.key === activeTab)?.label || ''}
            sectionData={sectionData[activeTab]}
            onSave={(content) => saveSection(activeTab, content)}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Section Router ─────────────────────────────────────────── */

function SectionRouter({ sectionKey, sectionLabel, sectionData, onSave }) {
  const [localData, setLocalData] = useState(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    const parsed = typeof sectionData === 'string' ? JSON.parse(sectionData) : sectionData
    setLocalData(parsed || {})
    setDirty(false)
  }, [sectionKey, sectionData])

  const handleChange = useCallback((newData) => {
    setLocalData(newData)
    setDirty(true)
  }, [])

  const handleSave = useCallback(() => {
    onSave(localData)
    setDirty(false)
  }, [onSave, localData])

  const SectionComponent = SECTION_COMPONENTS[sectionKey]

  return (
    <div>
      {SectionComponent ? (
        <SectionComponent data={localData} onChange={handleChange} />
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">🚧</div>
          <div className="empty-state__title">Section not found</div>
          <div className="empty-state__text">This section component could not be loaded.</div>
        </div>
      )}

      <div className={`save-bar ${dirty ? 'save-bar--dirty' : ''}`}>
        <div className="save-bar__status">
          {dirty ? '✏️ Unsaved changes' : '✅ All changes saved'}
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={!dirty}>
          {dirty ? 'Save Section' : 'Saved'}
        </button>
      </div>
    </div>
  )
}