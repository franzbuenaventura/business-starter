import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Navbar, NavbarBrand, NavbarContent,
  Card, CardBody,
  Button, Input, Select, SelectItem,
  Chip, Progress, Tabs, Tab,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@heroui/react'

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
import { PrintModeContext } from './components/RichText.jsx'
import { useOfflineSync } from './hooks/useOfflineSync.js'
import ScenarioBar from './components/ScenarioBar.jsx'
import HeadlineStrip from './components/HeadlineStrip.jsx'
import { scenarioMetrics } from './components/ScenarioBar.jsx'
import PortfolioView from './components/PortfolioView.jsx'
import { apiFetch, clearToken } from './api.js'
import './styles.css'
import './print.css'

const API = '/api/businesses'
const SECTIONS = [
  { key: 'I', label: 'Executive Summary', tab: 'Summary' },
  { key: 'II', label: 'Company Description', tab: 'Company & Org', merged: ['VI'] },
  { key: 'III', label: 'Products & Services', tab: 'Products' },
  { key: 'IV', label: 'Marketing Plan', tab: 'Marketing' },
  { key: 'V', label: 'Operational Plan', tab: 'Operations' },
  { key: 'VI', label: 'Management & Organization', tab: 'Team' },
  { key: 'VII', label: 'Startup Expenses & Capitalization', tab: 'Startup Costs' },
  { key: 'VIII', label: 'Financial Plan', tab: 'Financials' },
  { key: 'IX', label: 'Appendices', tab: 'Appendices' },
  { key: 'X', label: 'Funding & Final Steps', tab: 'Funding' },
]

// Tabs that actually appear in the UI (VI renders inside the merged II tab)
const VISIBLE_SECTIONS = SECTIONS.filter(s => s.key !== 'VI')

const SECTION_COMPONENTS = {
  I: SectionI, II: SectionII, III: SectionIII, IV: SectionIV,
  V: SectionV, VI: SectionVI, VII: SectionVII, VIII: SectionVIII,
  IX: SectionIX, X: SectionX,
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
]

/* ── Helpers ────────────────────────────────────────────────── */

function hasSectionData(data) {
  if (data === true) return true   // list-payload fill-mask form (server-precomputed)
  if (data === false || data == null) return false
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
const STATUS_CHIP = {
  draft: { color: 'warning', variant: 'flat' },
  'in-progress': { color: 'primary', variant: 'flat' },
  complete: { color: 'success', variant: 'flat' },
}
const STATUSES_SET = new Set(['draft', 'in-progress', 'complete'])

function calcAutoStatus(sections) {
  const completed = countCompletedSections(sections)
  if (completed === 0) return 'draft'
  if (completed >= 10) return 'complete'
  return 'in-progress'
}

function getDisplayStatus(business) {
  // 2026-10-16: display the COMPUTED status (sections-attached cards) — stored
  // creation-time 'draft' made every card read Draft forever; the stored field
  // remains for explicit overrides set later by the user UI (none exists yet).
  const computed = calcAutoStatus(business.sections)
  if (!business.sections || Object.keys(business.sections).length === 0) {
    // No sections map on the payload (old server payload) — fall back to stored.
    if (business.status && STATUSES_SET.has(business.status)) return business.status
  }
  return computed
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status
}

/* ── Debounce Hook ─────────────────────────────────────────── */

function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/* ── App ────────────────────────────────────────────────────── */

function SectionPager({ activeTab, onSwitch, sectionData, contentRef }) {
  const idx = VISIBLE_SECTIONS.findIndex(s => s.key === activeTab)
  const prev = VISIBLE_SECTIONS[idx - 1]
  const next = VISIBLE_SECTIONS[idx + 1]
  const go = k => { onSwitch(k); requestAnimationFrame(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }
  return (
    <div className="app-chrome max-w-3xl mx-auto px-4 sm:px-6 pt-1 flex items-center justify-between text-xs no-print">
      <button type="button" disabled={!prev} onClick={() => prev && go(prev.key)}
        className={`flex items-center gap-1.5 py-1.5 px-2 rounded-medium transition-colors ${prev ? 'text-foreground-500 hover:text-foreground hover:bg-content2/50' : 'opacity-0 pointer-events-none'}`}>
        <span aria-hidden>←</span><span className="hidden sm:inline">{prev && <>{prev.key} {prev.tab || prev.label}</>}</span><span className="sm:hidden">Prev</span>
      </button>
      <span className="text-foreground-400">{idx + 1} of {VISIBLE_SECTIONS.length}</span>
      <button type="button" disabled={!next} onClick={() => next && go(next.key)}
        className={`flex items-center gap-1.5 py-1.5 px-2 rounded-medium transition-colors ${next ? 'text-foreground-500 hover:text-foreground hover:bg-content2/50' : 'opacity-0 pointer-events-none'}`}>
        <span className="sm:hidden">Next</span><span className="hidden sm:inline">{next && <>{next.key} {next.tab || next.label}</>}</span><span aria-hidden>→</span>
      </button>
    </div>
  )
}

export default function App() {
  const [businesses, setBusinesses] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [listView, setListView] = useState('plans') // 'plans' | 'portfolio'
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
      <Navbar maxWidth="full" isBordered className="app-chrome navbar-maxw7" height="3.5rem">
        <NavbarBrand className="gap-2.5 mr-auto">
          <span className="text-xl leading-none">🚀</span>
          <div className="leading-tight">
            <div className="text-sm font-bold text-foreground">Business Starter</div>
            <div className="text-[11px] text-foreground-500 hidden sm:block">SCORE Plan Builder</div>
          </div>
        </NavbarBrand>
        <NavbarContent justify="end" className="gap-2 items-center">
          <Button size="sm" variant={listView === 'plans' ? 'solid' : 'flat'} color={listView === 'plans' ? 'primary' : 'default'} className="no-print h-9" onClick={() => setListView('plans')}>Plans</Button>
          <Button size="sm" variant={listView === 'portfolio' ? 'solid' : 'flat'} color={listView === 'portfolio' ? 'primary' : 'default'} className="no-print h-9" onClick={() => setListView('portfolio')}>Portfolio</Button>
          <Button size="sm" variant="flat" className="no-print h-9" startContent={<span className="text-base leading-none">⬇</span>} onClick={handleExport}>Export All</Button>
          <label className="no-print cursor-pointer">
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
            <span className="inline-flex items-center gap-1 h-9 px-3 rounded-medium bg-content2 text-foreground text-sm font-medium hover:bg-content3 transition-colors"><span className="text-base leading-none">⬆</span> Import</span>
          </label>
          <ThemeToggle />
        </NavbarContent>
      </Navbar>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        {listView === 'portfolio' ? (
          <PortfolioView onOpenPlan={id => setSelectedId(id)} />
        ) : businesses === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0,1,2].map(i => (
              <div key={i} className="h-52 rounded-2xl border border-divider bg-content1 animate-pulse" />
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2">No business plans yet</h2>
            <p className="text-sm text-foreground-500 mb-6 max-w-md mx-auto">
              Create your first business plan to get started with the 10-section SCORE builder.
            </p>
            <Button color="primary" onClick={() => setShowCreate(true)}>+ Create Your First Plan</Button>
          </div>
        ) : (
          <>
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Input
                isClearable
                size="sm"
                variant="bordered"
                placeholder="Search by business name or industry…"
                value={searchQuery}
                onValueChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                className="sm:flex-1 sm:max-w-md"
              />
              <div className="flex gap-3 flex-wrap items-center">
                <Select
                  size="sm" variant="bordered" aria-label="Filter by status"
                  className="w-40"
                  selectedKeys={[statusFilter]}
                  onSelectionChange={keys => setStatusFilter(Array.from(keys)[0] ?? 'all')}
                >
                  {STATUS_OPTIONS.map(s => <SelectItem key={s.value}>{s.label}</SelectItem>)}
                </Select>
                <Select
                  size="sm" variant="bordered" aria-label="Filter by industry"
                  className="w-44"
                  selectedKeys={[industryFilter]}
                  onSelectionChange={keys => setIndustryFilter(Array.from(keys)[0] ?? 'all')}
                >
                  <SelectItem key="all">All Industries</SelectItem>
                  {industries.map(ind => <SelectItem key={ind}>{ind}</SelectItem>)}
                </Select>
                {hasActiveFilters && (
                  <Button size="sm" variant="light" className="text-foreground-500"
                    onClick={() => { setSearchQuery(''); setStatusFilter('all'); setIndustryFilter('all') }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-sm text-foreground-500 mb-6 max-w-md mx-auto">
                  {hasActiveFilters
                    ? 'No business plans match your search or filters. Try adjusting your criteria.'
                    : 'No business plans match your search.'}
                </p>
                {hasActiveFilters && (
                  <Button variant="flat" onClick={() => { setSearchQuery(''); setStatusFilter('all'); setIndustryFilter('all') }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card
                  isPressable shadow="none"
                  className="border border-dashed border-divider bg-content1/40 hover:border-primary min-h-52 justify-center"
                  onPress={() => setShowCreate(true)}
                >
                  <CardBody className="items-center gap-2 py-10">
                    <span className="text-3xl">➕</span>
                    <span className="text-sm font-semibold">Create New Plan</span>
                    <span className="text-xs text-foreground-500">Start a new business plan</span>
                  </CardBody>
                </Card>
                {filteredBusinesses.map(b => {
                  const completed = countCompletedSections(b.sections)
                  const pct = Math.round((completed / 10) * 100)
                  const status = getDisplayStatus(b)
                  return (
                    <Card
                      key={b.id}
                      isPressable shadow="none"
                      className="border border-divider bg-content1 hover:border-primary/60 transition-colors"
                      onPress={() => setSelectedId(b.id)}
                    >
                      <CardBody className="px-5 py-4">
                        <div className="flex items-start justify-between mb-3">
                          <Chip size="sm" variant="flat" {...STATUS_CHIP[status]}>{STATUS_LABELS[status]}</Chip>
                          <Button
                            isIconOnly size="sm" variant="light" radius="full"
                            className="text-foreground-500 hover:text-danger"
                            aria-label={`Delete ${b.name}`}
                            onPress={e => { e?.stopPropagation?.(); setDeleteTarget({ id: b.id, name: b.name }) }}
                          >
                            ✕
                          </Button>
                        </div>
                        <div className="text-lg font-bold text-foreground leading-snug mb-0.5">{b.name}</div>
                        {b.industry && <div className="text-sm text-foreground-500 mb-1">{b.industry}</div>}
                        <div className="text-xs text-foreground-400 mb-4">Created {formatDate(b.createdAt || b.created_at)}</div>
                        <div className="flex items-center gap-3">
                          <Progress
                            aria-label={`${b.name} progress`}
                            size="sm" value={pct} color="primary" className="flex-1"
                          />
                          <span className="text-xs font-medium text-foreground-500 shrink-0">{completed}/10</span>
                        </div>
                      </CardBody>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      <CreateModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreate={addBusiness} />

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col gap-1">
                <span className="text-2xl">⚠️</span>
                <span>Delete plan</span>
              </ModalHeader>
              <ModalBody>
                Delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancel</Button>
                <Button color="danger" onPress={confirmDelete}>Delete Plan</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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

  async function handleChange(value) {
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
    <Select
      size="sm" variant="bordered" aria-label="Plan status"
      className="w-40"
      selectedKeys={[status]}
      onSelectionChange={keys => handleChange(Array.from(keys)[0] ?? 'auto')}
    >
      <SelectItem key="auto">Auto ({STATUS_LABELS[current]})</SelectItem>
      <SelectItem key="draft">Draft</SelectItem>
      <SelectItem key="in-progress">In Progress</SelectItem>
      <SelectItem key="complete">Complete</SelectItem>
    </Select>
  )
}

/* ── Create Modal ───────────────────────────────────────────── */

function CreateModal({ isOpen, onClose, onCreate }) {
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

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setIndustry('')
      setMode('blank')
      setSelectedTemplate(null)
    }
  }, [isOpen])

  async function handleTemplateSubmit(e) {
    if (e?.preventDefault) e.preventDefault()
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
    if (e?.preventDefault) e.preventDefault()
    if (!name.trim()) return
    onCreate(name.trim(), industry.trim())
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader>New Business Plan</ModalHeader>
        <ModalBody>
          <Tabs
            size="sm" variant="underlined"
            selectedKey={mode}
            onSelectionChange={key => { setMode(key); setSelectedTemplate(null) }}
          >
            <Tab key="blank" title="Start Blank" />
            <Tab key="template" title="From Template" />
          </Tabs>

          {mode === 'blank' ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2 pb-2">
              <Input
                label="Business Name" variant="bordered"
                placeholder="e.g. Acme Coffee Co."
                value={name}
                onValueChange={setName}
                autoFocus
                isRequired
              />
              <Input
                label="Industry (optional)" variant="bordered"
                placeholder="e.g. Food & Beverage"
                value={industry}
                onValueChange={setIndustry}
              />
            </form>
          ) : (
            <form onSubmit={handleTemplateSubmit} className="flex flex-col gap-4 pt-2 pb-2">
              <div className="text-sm font-medium">Choose a Template</div>
              <div className="flex flex-col gap-2">
                {templates.map(t => (
                  <button
                    type="button" key={t.id}
                    className={`text-left px-4 py-3 rounded-xl border transition-colors ${
                      selectedTemplate === t.id
                        ? 'border-primary bg-primary-100/30'
                        : 'border-divider bg-content1 hover:border-foreground-400'
                    }`}
                    onClick={() => { setSelectedTemplate(t.id); setName(''); setIndustry('') }}
                  >
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-xs text-foreground-500">{t.description}</span>
                  </button>
                ))}
              </div>
              {selectedTemplate && (
                <Input
                  label="Business Name (optional — uses template default if blank)" variant="bordered"
                  placeholder="Custom name or leave blank for template default"
                  value={name}
                  onValueChange={setName}
                />
              )}
            </form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>Cancel</Button>
          {mode === 'blank' ? (
            <Button color="primary" isDisabled={!name.trim()} onClick={handleSubmit}>Create Plan</Button>
          ) : (
            <Button color="primary" isDisabled={!selectedTemplate || loading} onClick={handleTemplateSubmit}>
              {loading ? 'Creating…' : 'Create from Template'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
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
  const [activeScenario, setActiveScenario] = useState(null) // null | scenario object from ScenarioBar
  const scenarioOverride = useMemo(() => {
    // When a scenario is active, VII/VIII edits target the scenario copy, not the base rows.
    if (!activeScenario?.content) return sectionData
    const merged = { ...sectionData }
    if (activeScenario.content.VII) merged['VII'] = activeScenario.content.VII
    if (activeScenario.content.VIII) merged['VIII'] = activeScenario.content.VIII
    return merged
  }, [sectionData, activeScenario])

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

  // Debounced save function
  const scheduleSave = useCallback((key, content) => {
    // Merged-tab guard (Company & Org renders TWO routers sharing one debounce slot):
    // never let a save for a different section silently overwrite a pending one.
    if (saveTimerRef.current && pendingDataRef.current && pendingDataRef.current.key !== key) {
      // immediate write of the older pending edit before scheduling the new key
      const { key: pk, content: pc } = pendingDataRef.current
      pendingDataRef.current = null
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
      const url0 = `${API}/${id}/sections/${pk}`
      if (!navigator.onLine) {
        const q = JSON.parse(localStorage.getItem('business-starter-offline-queue') || '[]')
        q.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, method: 'PUT', url: url0, body: { content: pc }, ts: Date.now() })
        localStorage.setItem('business-starter-offline-queue', JSON.stringify(q))
        setSectionData(prev => ({ ...prev, [pk]: pc }))
      } else {
        apiFetch(url0, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: pc }) })
          .then(r => { if (r.ok) setSectionData(prev => ({ ...prev, [pk]: pc })) })
          .catch(e => console.error('Merged-tab pending flush failed:', pk, e))
      }
    }
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

  // Scenario section save: writes VII/VIII edits into the ACTIVE scenario's copy
  const saveScenarioSection = useCallback(async (scenario, key, content) => {
    const body = { notes: scenario.notes, content: { ...(scenario.content || {}), [key]: content } }
    setSaveStatus('saving')
    if (!navigator.onLine) {
      setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000)
      return
    }
    try {
      const res = await apiFetch(`${API}/${id}/scenarios/${scenario.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      if (res.ok) {
        const updated = await res.json()
        setActiveScenario(updated)
        // NOTE: sectionData (base rows) intentionally NOT touched here — the editor +
        // dashboard read the scenario copy via scenarioOverride; base PDF/compare stay base.
      }
    } catch (e) { console.error('Scenario save failed:', e) }
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }, [id])

  // Flush pending save immediately (used on tab switch) — declared before the
  // keyboard effect that references it (TDZ guard, see commit e858e22).
  const flushSave = useCallback(async () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
      const pending = pendingDataRef.current
      const { key, content } = pending || { key: null, content: undefined }
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

  // Tab switching + export (declared after flushSave to avoid TDZ)
  function handleTabSwitch(newKey) {
    if (newKey === activeTab) return
    if (saveTimerRef.current) flushSave()
    setActiveTab(newKey)
  }

  function handleExportPDF() {
    setPrintMode(true)
    setTimeout(() => { window.print(); setPrintMode(false) }, 300)
  }

  const completedCount = useMemo(() => countCompletedSections(sectionData), [sectionData])
  const pct = Math.round((completedCount / 10) * 100)

  // Keyboard shortcuts: Ctrl+Left/Right to navigate sections, Ctrl+S to save
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        const idx = SECTIONS.findIndex(s => s.key === activeTabRef.current)
        if (idx > 0) handleTabSwitch(SECTIONS[idx - 1].key)
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        const idx = SECTIONS.findIndex(s => s.key === activeTabRef.current)
        if (idx < SECTIONS.length - 1) handleTabSwitch(SECTIONS[idx + 1].key)
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        flushSave()
        return
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        setShowShortcuts(prev => !prev)
        return
      }
      if (e.key === 'Escape' && showShortcuts) {
        setShowShortcuts(false)
        return
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flushSave, showShortcuts])

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Button size="sm" variant="flat" className="mb-6" onClick={onBack}>← Back</Button>
          <div className="text-sm text-foreground-500">Loading plan…</div>
        </div>
      </div>
    )
  }

  if (plan.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="text-sm text-foreground-500 mb-6">Failed to load plan.</div>
          <Button variant="flat" onClick={onBack}>← Back</Button>
        </div>
      </div>
    )
  }

  // ── Print Mode: render all sections stacked ──
  if (printMode) {
    return (
      <PrintModeContext.Provider value={true}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="print-doc-header">
            <div className="print-doc-header__name">{plan.name}</div>
            {plan.industry && <div className="print-doc-header__industry">{plan.industry}</div>}
            <hr className="print-doc-header__rule" />
          </div>
                    {/* BUILD 5 (2026-10-16): financial snapshot + scenario appendix in print */}
          <PrintSnapshot viii={sectionData?.VIII} vii={sectionData?.VII} planName={plan.name} activeScenario={activeScenario} />
{SECTIONS.map(s => {
            const SectionComponent = SECTION_COMPONENTS[s.key]
            const raw = sectionData[s.key]
            let parsed = {}
            if (raw) {
              try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw } catch { parsed = {} }
            }
            return (
              <div className="print-section mb-10" key={s.key}>
                <div className="print-section__number">Section {s.key}</div>
                <h2 className="print-section__title text-2xl font-bold border-b-2 border-black pb-1 mb-4">{s.label}</h2>
                {SectionComponent ? (
                  <SectionComponent data={parsed} onChange={() => {}} />
                ) : (
                  <div>Section not available.</div>
                )}
              </div>
            )
          })}
        </div>
      </PrintModeContext.Provider>
    )
  }

  const saveLabel = saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : 'All changes saved'
  const saveColor = saveStatus === 'saving' ? 'warning' : saveStatus === 'saved' ? 'success' : 'default'

  return (
    <div className="min-h-screen">
      {/* Sticky plan header */}
      <div className="app-chrome sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-divider">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-1.5 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <Button size="sm" variant="flat" onClick={onBack}>← Dashboard</Button>
              <div className="min-w-0 flex-1 flex items-baseline gap-2 justify-start">
                <span className="text-sm font-bold truncate">{plan.name}</span>
                {plan.industry && <span className="text-[11px] text-foreground-500 truncate hidden sm:inline">{plan.industry}</span>}
              </div>
              <Chip
                size="sm" variant="flat" color={saveColor}
                className={saveStatus === 'idle' ? 'text-foreground-500 shrink-0' : 'shrink-0'}
              >
                {saveLabel}
              </Chip>
            </div>
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <StatusOverride plan={plan} onUpdate={setPlan} />
                <div className="flex items-center gap-2 w-40">
                  <Progress aria-label="Plan progress" size="sm" value={pct} color="primary" className="flex-1" />
                  <span className="text-xs text-foreground-500 shrink-0">{completedCount}/10</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="flat" onClick={handleExportPDF}>📄 Export PDF</Button>
                <ThemeToggle />
              </div>
            </div>
          </div>

{/* Section map nav I–X (replaces scrollable tab strip) */}
          <nav aria-label="Plan sections" className="pb-2">
            <div className="grid grid-cols-5 gap-1.5">
              {SECTIONS.filter(s => s.key !== 'VI').map(s => {
                const completed = hasSectionData(scenarioOverride[s.key])
                const active = activeTab === s.key
                return (
                  <button
                    key={s.key}
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    title={s.label}
                    onClick={() => { handleTabSwitch(s.key); requestAnimationFrame(() => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }}
                    className={`group flex flex-col items-start rounded-medium px-2 py-1.5 text-left transition-colors border border-transparent
                      ${active ? 'bg-content2/80 border-divider' : 'hover:bg-content2/40'}
                      focus-visible:outline-2 focus-visible:outline-primary`}
                  >
                    <span className="flex items-center gap-1">
                      <span className={`text-[11px] leading-none font-semibold ${active ? 'text-primary' : completed ? 'text-primary/80' : 'text-foreground-400'}`}>{s.key}</span>
                      <span aria-hidden className={`w-1.5 h-1.5 rounded-full shrink-0 ${completed ? 'bg-success' : 'bg-default-300'}`} />
                    </span>
                    <span className={`text-[11px] leading-tight sm:text-xs ${active ? 'text-foreground font-medium' : 'text-foreground-500 group-hover:text-foreground'}`}>{s.tab || s.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      <ScenarioBar planId={id} baseVIII={sectionData?.VIII} baseVII={sectionData?.VII} planName={plan.name} activeScenario={activeScenario} onActiveChange={(sc) => {
            if (saveTimerRef.current) flushSave()   // land pending base edits on the base rows first (AGY A2)
            setActiveScenario(sc)
            if (sc && activeTab !== 'VII' && activeTab !== 'VIII') handleTabSwitch('VII')  // jump only out of locked tabs (AGY D2)
          }} />
      <HeadlineStrip viii={scenarioOverride?.VIII} vii={scenarioOverride?.VII} activeScenarioName={activeScenario ? activeScenario.name : null} />

      {/* Prev / Next section quick nav */}
      <SectionPager activeTab={activeTab} onSwitch={handleTabSwitch} sectionData={sectionData} contentRef={contentRef} />

      {/* Main content */}
      <div
        className="editor-content-anchor max-w-3xl mx-auto px-4 sm:px-6 pt-6 outline-none"
        ref={contentRef}
        tabIndex={-1}
        aria-label={`Section ${activeTab}: ${SECTIONS.find(s => s.key === activeTab)?.label || ''}`}
      >
                {activeTab === 'II' ? (
          <>
            <SectionRouter
          sectionKey={'II'}
          sectionLabel={'Company Description'}
          sectionData={scenarioOverride['II']}
          businessId={plan.id}
          locked={!!activeScenario}
          lockBanner={activeScenario ? `Scenario mode — editing “${activeScenario.name}”. Only VII/VIII change; Company & Organization is readonly.` : null}
          onSave={(content) => {
            // merged Company & Organization tab — never financial; scenario mode locks it
            if (!activeScenario) scheduleSave('II', content)
            else console.warn('Scenario mode: section II locked (financials only)')
          }}
          saveStatus={saveStatus}
        />
            <SectionRouter
          sectionKey={'VI'}
          sectionLabel={'Management & Organization'}
          sectionData={scenarioOverride['VI']}
          businessId={plan.id}
          locked={!!activeScenario}
          lockBanner={activeScenario ? `Scenario mode — editing “${activeScenario.name}”. Only VII/VIII change.` : null}
          onSave={(content) => {
            if (!activeScenario) scheduleSave('VI', content)
            else console.warn('Scenario mode: section VI locked (financials only)')
          }}
          saveStatus={saveStatus}
        />
          </>
        ) : (
<SectionRouter
          sectionKey={activeTab}
          sectionLabel={SECTIONS.find(s => s.key === activeTab)?.label || ''}
          sectionData={scenarioOverride[activeTab]}
          businessId={plan.id}
          locked={!!activeScenario && activeTab !== 'VII' && activeTab !== 'VIII'}
          lockBanner={activeScenario ? `Scenario mode — editing “${activeScenario.name}”. Only Startup Costs (VII) and Financial Plan (VIII) change; this section is readonly and the base plan is untouched.` : null}
          onSave={(content) => {
            if (activeScenario) {
              if (activeTab === 'VII' || activeTab === 'VIII') {
                saveScenarioSection(activeScenario, activeTab, content)
              }
              // scenario mode: non-financial tabs are locked — never write base rows
              else { console.warn('Scenario mode: section', activeTab, 'is locked (financials only)') }
            } else {
              scheduleSave(activeTab, content)
            }
          }}
          saveStatus={saveStatus}
        />
        )}
      </div>

      {/* Keyboard shortcut hint footer */}
      <footer className="app-chrome max-w-7xl mx-auto px-4 sm:px-6 pb-6 text-xs text-foreground-400">
        <kbd>Ctrl</kbd>+<kbd>←</kbd>/<kbd>→</kbd> switch sections · <kbd>Ctrl</kbd>+<kbd>S</kbd> save · <kbd>?</kbd> shortcuts
      </footer>

      {/* Keyboard shortcut hints modal */}
      <Modal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} size="sm">
        <ModalContent>
          <ModalHeader>Keyboard Shortcuts</ModalHeader>
          <ModalBody>
            {[
              ['Ctrl + ←', 'Previous section'],
              ['Ctrl + →', 'Next section'],
              ['Ctrl + S', 'Save now'],
              ['?', 'Toggle this help'],
              ['Esc', 'Close this help'],
            ].map(([keys, desc]) => (
              <div key={keys} className="flex justify-between items-center text-sm">
                <span className="font-mono text-xs bg-content2 px-2 py-1 rounded-md border border-divider">{keys}</span>
                <span className="text-foreground-500">{desc}</span>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setShowShortcuts(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

/* ── Section Router ─────────────────────────────────────────── */


/* ── Print financial snapshot (BUILD 5) ──────────────────────
   Print/PDF export gains the headline numbers + scenario compare
   appendix so the exported document matches the on-screen money
   story, not just the raw SCORE form mirror.                       */
function PrintSnapshot({ viii, vii, planName, activeScenario }) {
  const m = scenarioMetrics(viii)
  if (!m) return null
  const fmtPhp = v => (v == null || isNaN(v)) ? '—' : (v < 0 ? '−₱' + Math.round(-v).toLocaleString('en-PH') : '₱' + Math.round(v).toLocaleString('en-PH'))
  const capex = (() => {
    if (!vii) return null
    const sum = list => (Array.isArray(list) ? list.reduce((a, r) => a + (parseFloat(String(r?.amount == null ? 0 : r.amount).replace(/,/g, '')) || 0), 0) : 0)
    const cat = vii.startupCosts && Array.isArray(vii.startupCosts.categories) ? sum(vii.startupCosts.categories) : 0
    return Math.max(cat, sum(vii.expenses || [])) || null
  })()
  const sm = activeScenario ? scenarioMetrics(activeScenario.content?.VIII || activeScenario.content) : null
  return (
    <div className="print-section mb-10">
      <div className="print-section__number">Financial Snapshot</div>
      <h2 className="print-section__title text-2xl font-semibold mb-3">Headline numbers (12-month Year 1)</h2>
      <table className="w-full text-sm" style={{ maxWidth: '32rem' }}>
        <tbody>
          <tr><td className="py-1 pr-3 text-foreground-500">Total revenue (12-mo)</td><td className="text-right tabular-nums font-medium">{fmtPhp(m.rev)}</td></tr>
          <tr><td className="py-1 pr-3 text-foreground-500">COGS</td><td className="text-right tabular-nums">{fmtPhp(m.cogs)}</td></tr>
          <tr><td className="py-1 pr-3 text-foreground-500">Operating expenses</td><td className="text-right tabular-nums">{fmtPhp(m.opex)}</td></tr>
          <tr><td className="py-1 pr-3 text-foreground-500">Net operating income</td><td className="text-right tabular-nums font-medium">{fmtPhp(m.net)}</td></tr>
          <tr><td className="py-1 pr-3 text-foreground-500">Net margin</td><td className="text-right tabular-nums">{m.margin == null ? '—' : m.margin.toFixed(1) + '%'}</td></tr>
          {capex != null && <tr><td className="py-1 pr-3 text-foreground-500">Total capital required (VII)</td><td className="text-right tabular-nums">{fmtPhp(capex)}</td></tr>}
          {capex != null && <tr><td className="py-1 pr-3 text-foreground-500">Payback @ Y1 net pace</td><td className="text-right tabular-nums">{m.net <= 0 ? 'ramp year — see VIII notes' : (capex / m.net > 25 ? 'ramp year — stabilized payback per VIII' : (capex / m.net).toFixed(1) + ' years')}</td></tr>}
        </tbody>
      </table>
      {sm && activeScenario && (
        <div className="mt-5">
          <h3 className="text-base font-semibold mb-2">Scenario appendix — {activeScenario.name}</h3>
          {activeScenario.notes && <p className="text-xs text-foreground-500 mb-2">Assumptions: {activeScenario.notes}</p>}
          <table className="w-full text-sm" style={{ maxWidth: '36rem' }}>
            <thead>
              <tr className="border-b border-divider text-xs text-foreground-500 text-left">
                <th className="py-1 pr-3">Metric</th><th className="py-1 px-3 text-right">Base</th><th className="py-1 px-3 text-right">{activeScenario.name}</th><th className="py-1 px-3 text-right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: '12-mo revenue', get: x => x?.rev, isCost: false },
                { label: 'Operating expenses', get: x => x?.opex, isCost: true },
                { label: 'Net operating income', get: x => x?.net, isCost: false },
              ].map(row => {
                const b = row.get(m), s = row.get(sm)
                const d = (b != null && s != null) ? s - b : null
                // AGY-final: lower cost = green; keep the ₱ symbol on deltas
                const tone = d == null ? '' : ((row.isCost ? d < 0 : d > 0) ? 'text-success' : d === 0 ? '' : 'text-danger')
                const dstr = d == null ? '—' : (d < 0 ? '−' : '+') + fmtPhp(Math.abs(d))
                return (
                  <tr key={row.label} className="border-b border-divider/50">
                    <td className="py-1 pr-3 text-foreground-500">{row.label}</td>
                    <td className="py-1 px-3 text-right tabular-nums">{fmtPhp(b)}</td>
                    <td className="py-1 px-3 text-right tabular-nums">{fmtPhp(s)}</td>
                    <td className={`py-1 px-3 text-right tabular-nums ${tone}`}>{dstr}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SectionRouter({ sectionKey, sectionLabel, sectionData, businessId, onSave, saveStatus, locked, lockBanner }) {
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
      {!locked && (
        <div className="flex justify-end mb-3">
          <AiDraftButton businessId={businessId} sectionId={sectionKey} onAccept={handleAiAccept} />
        </div>
      )}
      {locked && lockBanner && (
        <div className="mb-3 rounded-medium border border-warning-300 bg-warning-100/40 px-4 py-2.5 text-xs text-warning-600 flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">🔒</span>
          <span>{lockBanner}</span>
        </div>
      )}
      {SectionComponent ? (
        <div
          {...(locked ? { inert: "" } : {})}
          className={locked ? "relative pointer-events-none select-none opacity-60" : "relative"}
        >
          <SectionComponent data={localData} onChange={handleChange} />
          {locked && <div className="absolute inset-0" aria-hidden="true" />}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🚧</div>
          <div className="font-semibold mb-1">Section not found</div>
          <div className="text-sm text-foreground-500">This section component could not be loaded.</div>
        </div>
      )}

      <div className="mt-8 text-center text-xs text-foreground-400">
        {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : 'All changes saved'}
      </div>
    </div>
  )}