import { useState, useEffect, useMemo } from 'react'
import { Button, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure, Chip } from '@heroui/react'
import { apiFetch } from '../api.js'

const php = n => (n == null || isNaN(n)) ? '—' : '₱' + Number(n).toLocaleString('en-PH')

export function scenarioMetrics(viii) {
  if (!viii || typeof viii !== 'object') return null
  const sum = list => (Array.isArray(list) ? list.reduce((a, r) => a + (Number(r?.amount) || 0), 0) : 0)
  const rev = sum(viii.revenueItems)
  const cogs = sum(viii.cogsItems)
  const opex = sum(viii.operatingExpenses)
  const net = rev - cogs - opex
  return {
    rev, cogs, opex, net,
    margin: rev ? (net / rev) * 100 : null,
    gross: rev ? ((rev - cogs) / rev) * 100 : null,
    fixed: sum(viii.fixedCostItems),
    startupNote: viii.totalStartupInScenario || null,
  }
}

let portalEl = null
function getPortal() {
  if (typeof document === 'undefined') return undefined
  if (!portalEl) { portalEl = document.createElement('div'); portalEl.id = 'scenario-portal'; document.body.appendChild(portalEl) }
  return portalEl
}

export default function ScenarioBar({ planId, baseVIII, baseVII, planName, activeScenario, onActiveChange }) {
  const [scenarios, setScenarios] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [form, setForm] = useState({ name: '', notes: '' })

  useEffect(() => {
    let alive = true
    if (!planId) return
    apiFetch(`/api/businesses/${planId}/scenarios`)
      .then(r => r.json())
      .then(d => { if (alive && Array.isArray(d)) setScenarios(d) })
      .catch(() => {})
    return () => { alive = false }
  }, [planId])

  const baseM = useMemo(() => scenarioMetrics(baseVIII), [baseVIII])
  const scenM = useMemo(() => scenarios.map(sc => ({ sc, m: scenarioMetrics(sc?.content?.VIII || sc?.content) })), [scenarios])

  async function createScenario(e) {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return
    try {
      const res = await apiFetch(`/api/businesses/${planId}/scenarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, notes: form.notes.trim(), content: { VII: baseVII || null, VIII: baseVIII || null, copiedAt: new Date().toISOString() } }),
      })
      if (res.ok) {
        const sc = await res.json()
        setScenarios(prev => [...prev, sc])
        setForm({ name: '', notes: '' })
        onOpenChange(false)
        onActiveChange(sc)
      }
    } catch (err) { console.error('Scenario create failed', err) }
  }

  async function deleteScenario(id) {
    const res = await apiFetch(`/api/businesses/${planId}/scenarios/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setScenarios(prev => prev.filter(s => s.id !== id))
      if (activeScenario?.id === id) onActiveChange(null)
    }
  }

  const selKey = activeScenario ? String(activeScenario.id) : 'base'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-1">
      <div className="flex items-center gap-2 flex-wrap rounded-medium border border-divider bg-content2/40 px-3 py-2">
        <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wide shrink-0">Scenario</span>
        <Select
          aria-label="Active scenario"
          size="sm"
          className="w-64 max-w-[70vw]"
          selectedKeys={new Set([selKey])}
          disallowEmptySelection
          onSelectionChange={(keys) => {
            const k = [...keys][0]
            if (!k || k === 'base') { onActiveChange(null); return }
            const sc = scenarios.find(s => String(s.id) === String(k))
            onActiveChange(sc || null)
          }}
        >
          <SelectItem key="base">Base model</SelectItem>
          {scenarios.map(sc => <SelectItem key={String(sc.id)}>{sc.name}</SelectItem>)}
        </Select>
        {activeScenario && (
          <Chip size="sm" color="warning" variant="flat" onClose={() => onActiveChange(null)}>
            editing scenario copy
          </Chip>
        )}
        <Button size="sm" variant="light" color="primary" onPress={onOpen}>+ New</Button>
        {scenarios.length > 0 && (
          <Button size="sm" variant="flat" onPress={() => setCompareOpen(true)}>Compare</Button>
        )}
      </div>
      {compareOpen && <ScenarioCompare rows={[{ label: 'Base model', m: baseM }, ...scenM]} onClose={() => setCompareOpen(false)} />}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} portalContainer={getPortal()}>
        <ModalContent>
          {(close) => (
            <form onSubmit={createScenario}>
              <ModalHeader className="flex flex-col gap-1">New scenario</ModalHeader>
              <ModalBody>
                <p className="text-xs text-foreground-500">Copies the current base VII/VIII financials as the starting point. Rename and edit costs to model alternatives (budget build, bank-financed, lease-not-buy…).</p>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="scenario-name-input" className="text-xs font-medium text-foreground-500">Scenario name <span className="text-danger">*</span></label>
                  <Input id="scenario-name-input" autoFocus value={form.name} onValueChange={v => setForm(f => ({ ...f, name: v }))} isRequired placeholder="e.g. AAC budget build" />
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  <label htmlFor="scenario-notes-input" className="text-xs font-medium text-foreground-500">Notes (assumptions, deltas vs base)</label>
                  <Textarea id="scenario-notes-input" value={form.notes} onValueChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="e.g. Shell ₱19.5K/sqm; GLI ep31 labor share" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>Cancel</Button>
                <Button color="primary" type="submit">Create</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

function ScenarioCompare({ rows, onClose }) {
  const fmtPhp = v => (v == null || isNaN(v)) ? '—' : '₱' + Number(v).toLocaleString('en-PH')
  return (
    <div className="mt-2 overflow-x-auto rounded-medium border border-divider bg-content1 p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">⚖ Scenario comparison</h4>
        <Button size="sm" variant="light" onPress={onClose}>✕</Button>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-divider">
            <th className="text-left py-1.5 pr-3 text-foreground-500">Metric</th>
            {rows.map((r, i) => (
              <th key={r.label} className={`text-right py-1.5 px-3 ${i === 0 ? 'text-primary font-semibold' : ''}`}>{r.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { label: '12-mo revenue', get: m => m?.rev, fmt: fmtPhp },
            { label: 'COGS', get: m => m?.cogs, fmt: fmtPhp },
            { label: 'Operating expenses', get: m => m?.opex, fmt: fmtPhp },
            { label: 'Net operating income', get: m => m?.net, fmt: fmtPhp },
            { label: 'Net margin', get: m => m?.margin, fmt: v => (v == null || isNaN(v)) ? '—' : v.toFixed(1) + '%' },
            { label: 'Startup (scenario)', get: m => m?.startupNote, fmt: fmtPhp },
          ].map(row => (
            <tr key={row.label} className="border-b border-divider/50">
              <td className="py-1.5 pr-3 text-foreground-500">{row.label}</td>
              {rows.map((r, i) => {
                // BUILD 4 (2026-10-16): delta-vs-base columns — Base column stays plain;
                // every scenario column gains "value (±Δ vs base · ±%)" so the whole
                // effect reads at a glance without mental subtraction.
                if (i === 0) return <td key={i} className="text-right py-1.5 px-3 font-medium">{row.fmt(row.get(r.m))}</td>
                const base = row.get(rows[0].m)
                const val = row.get(r.m)
                const bothNum = base != null && val != null && !isNaN(base) && !isNaN(val)
                const d = bothNum ? val - base : null
                // AGY-final: margin deltas are percentage POINTS (no second %); startup capex = cost row (savings = green)
                const pct = bothNum && base !== 0 && row.label !== 'Net margin' ? (d / Math.abs(base)) * 100 : null
                const isCost = row.label === 'Operating expenses' || row.label === 'COGS' || row.label === 'Startup (scenario)'
                const good = isCost ? (d != null && d < 0) : (d != null && d > 0)
                const bad = isCost ? (d != null && d > 0) : (d != null && d < 0)
                return (
                  <td key={i} className="text-right py-1.5 px-3">
                    <div>{row.fmt(val)}</div>
                    {d != null && d !== 0 && (
                      <div className={`text-[10px] tabular-nums ${good ? 'text-success' : bad ? 'text-danger' : 'text-foreground-400'}`}>
                        {d > 0 ? '+' : '−'}{row.fmt(Math.abs(d))}{pct != null && isFinite(pct) ? ` (${d > 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%)` : ''}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
