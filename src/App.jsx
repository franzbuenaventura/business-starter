import { useState, useEffect, useCallback } from 'react'
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
  I: SectionI,
  II: SectionII,
  III: SectionIII,
  IV: SectionIV,
  V: SectionV,
  VI: SectionVI,
  VII: SectionVII,
  VIII: SectionVIII,
  IX: SectionIX,
  X: SectionX,
}

export default function App() {
  const [businesses, setBusinesses] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')

  const load = useCallback(async () => {
    const res = await fetch(API)
    const data = await res.json()
    setBusinesses(data)
  }, [])

  useEffect(() => { load() }, [load])

  async function addBusiness(e) {
    e.preventDefault()
    if (!name.trim()) return
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, industry })
    })
    setName('')
    setIndustry('')
    load()
  }

  async function deleteBusiness(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (selectedId === id) setSelectedId(null)
    load()
  }

  if (selectedId) {
    return <PlanView id={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🚀 Business Starter</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>SCORE Business Plan Builder</p>

      <form onSubmit={addBusiness} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="Business name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: 8 }} />
        <input placeholder="Industry" value={industry} onChange={e => setIndustry(e.target.value)} style={{ flex: 1, padding: 8 }} />
        <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
      </form>

      {businesses.length === 0 ? (
        <p style={{ color: '#aaa' }}>No business plans yet. Create one above.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {businesses.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer' }} onClick={() => setSelectedId(b.id)}>
              <div>
                <strong>{b.name}</strong>
                {b.industry && <span style={{ color: '#888', marginLeft: 8 }}>· {b.industry}</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); setSelectedId(b.id) }} style={{ padding: '4px 12px' }}>Open</button>
                <button onClick={(e) => { e.stopPropagation(); deleteBusiness(b.id) }} style={{ padding: '4px 12px', color: '#c00' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PlanView({ id, onBack }) {
  const [plan, setPlan] = useState(null)
  const [activeTab, setActiveTab] = useState('I')
  const [sectionData, setSectionData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`${API}/${id}`).then(r => r.json()).then(data => {
      setPlan(data)
      setSectionData(data.sections || {})
    })
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

  if (!plan) return <div style={{ maxWidth: 800, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>Loading...</div>

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ padding: '4px 12px' }}>← Back</button>
        <h1 style={{ margin: 0 }}>{plan.name}</h1>
        {plan.industry && <span style={{ color: '#888' }}>· {plan.industry}</span>}
        {saving && <span style={{ color: '#888', fontSize: 14 }}>Saving...</span>}
      </div>

      <div style={{ display: 'flex', gap: 2, borderBottom: '2px solid #e0e0e0', marginBottom: 16, flexWrap: 'wrap' }}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveTab(s.key)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderBottom: activeTab === s.key ? '2px solid #0066cc' : '2px solid transparent',
              background: activeTab === s.key ? '#f0f7ff' : 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeTab === s.key ? 600 : 400,
            }}
          >
            {s.key}. {s.label}
          </button>
        ))}
      </div>

      <SectionRouter
        sectionKey={activeTab}
        sectionLabel={SECTIONS.find(s => s.key === activeTab)?.label || ''}
        sectionData={sectionData[activeTab]}
        onSave={(content) => saveSection(activeTab, content)}
      />
    </div>
  )
}

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Section {sectionKey}: {sectionLabel}</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dirty && <span style={{ color: '#888', fontSize: 14 }}>Unsaved changes</span>}
          <button onClick={handleSave} disabled={!dirty} style={{ padding: '8px 20px', opacity: dirty ? 1 : 0.5 }}>
            {dirty ? 'Save Section' : 'Saved'}
          </button>
        </div>
      </div>
      {SectionComponent ? (
        <SectionComponent data={localData} onChange={handleChange} />
      ) : (
        <p style={{ color: '#aaa' }}>Section component not found.</p>
      )}
    </div>
  )
}
