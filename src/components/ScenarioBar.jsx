import { useState, useEffect } from 'react'
import { Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure } from '@heroui/react'
import { apiFetch } from '../api.js'

// Computes the same summary metrics the FinDashboard derives, from a VIII-shaped content object
export function scenarioMetrics(viii) {
  if (!viii) return null
  const sum = list => Array.isArray(list) ? list.reduce((a, r) => a + (Number(r?.amount) || 0), 0) : 0
  const rev = sum(viii.revenueItems)
  const cogs = sum(viii.cogsItems)
  const opex = sum(viii.operatingExpenses)
  const net = rev - cogs - opex
  const margin = rev ? (net / rev * 100) : null
  const startupRows = viiStartupRows(viii)
  return { rev, cogs, opex, net, margin, startup: viii.totalScenarioStartup ?? startupRows, fixed: sum(viii.fixedCostItems), variablePerUnit: sum(viii.variableCostItems) }
}
function viiStartupRows(viii) {
  const rows = viii?.startupCosts?.categories?.rows || viii?.startupCostsRows || null
  return null // VII lives outside VIII; startup shown from VII data instead when available
}
const php = n => n == null || isNaN(n) ? '—' : '₱' + Number(n).toLocaleString('en-PH')

export default function ScenarioBar({ planId, baseVIII, baseVII, planName, onActiveChange }) {
  const [scenarios, setScenarios] = useState([])
  const [activeId, setActiveId] = useState(null) // null = base model
  const [compareOpen, setCompareOpen] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [form, setForm] = useState({ name: '', notes: '' })

  useEffect(() => {
    if (!planId) return
    let alive = true
    apiFetch(`/api/businesses/${planId}/scenarios`).then(r => r.json()).then(d => { if (alive && Array.isArray(d)) setScenarios(d) }).catch(() => {})
    return () => { alive = false }
  }, [planId])

  useEffect(() => { if (onActiveChange) onActiveChange(null) }, [planId]) // reset parent on plan switch

  const active = scenarios.find(s => s.id === activeId) || null
  const metricsFor = sc => sc && sc.content?.VIII ? scenarioMetrics(sc.content.VIII) : (sc ? scenarioMetrics(sc.content) : null)
  const baseMetrics = baseVIII ? scenarioMetrics(baseVIII) : null

  async function createScenario(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    // Snapshot the CURRENT base VII/VIII as the scenario starting point (costs get edited per scenario afterward)
    const content = { VIII: baseVIII || null, VII: baseVII || null, copiedAt: new Date().toISOString() }
    const res = await apiFetch(`/api/businesses/${planId}/scenarios`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.trim(), notes: form.notes.trim(), content })
    })
    if (res.ok) {
      const sc = await res.json()
      setScenarios(prev => [...prev, sc])
      setForm({ name: '', notes: '' })
      onOpenChange(false)
      setActiveId(sc.id)
    }
  }

  async function deleteScenario(id) {
    const res = await apiFetch(`/api/businesses/${planId}/scenarios/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setScenarios(prev => prev.filter(s => s.id !== id))
      if (activeId === id) setActiveId(null)
    }
  }

  return (
    <div className="mb-4 rounded-medium border border-divider bg-content2/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-foreground-500 uppercase tracking-wide mr-1">Scenarios</span>
        <Chip
          size="sm" variant={activeId === null ? 'solid' : 'bordered'} color={activeId === null ? 'primary' : 'default'}
          as="button" onClick={() => { setActiveId(null); if (onActiveChange) onActiveChange(null) }}
        >
          Base model
        </Chip>
        {scenarios.map(sc => (
          <Chip
            key={sc.id} size="sm" variant={activeId === sc.id ? 'solid' : 'bordered'} color={activeId === sc.id ? 'primary' : 'default'}
            as="button" onClick={() => { const next = activeId === sc.id ? null : sc.id; setActiveId(next); if (onActiveChange) onActiveChange(next ? sc : null) }}
            endContent={<span aria-hidden className="text-foreground-400 hover:text-danger" onClick={e => { e.stopPropagation(); deleteScenario(sc.id) }}>✕</span>}
          >
            {sc.name}
          </Chip>
        ))}
        <Button size="sm" variant="light" color="primary" onPress={onOpen}>+ New scenario</Button>
        {scenarios.length > 0 && (
          <Button size="sm" variant="flat" onPress={() => setCompareOpen(true)}>⚖ Compare</Button>
        )}
      </div>
      {active && (
        <p className="text-xs text-foreground-500 mt-2">
          Viewing <b>{active.name}</b>{active.notes ? `: ${active.notes}` : ''} — the VII/VIII section editors below will edit THIS scenario's copy when active. Base model stays untouched.
        </p>
      )}
      {compareOpen && (
        <ScenarioCompare
          scenarios={scenarios} baseMetrics={baseMetrics} planName={planName}
          startupBase={baseVII?.startupCosts?.totalNote || null}
          onClose={() => setCompareOpen(false)}
        />
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(close) => (
            <form onSubmit={createScenario}>
              <ModalHeader className="flex flex-col gap-1">New scenario</ModalHeader>
              <ModalBody>
                <p className="text-xs text-foreground-500">Copies the current base VII/VIII financials as a starting point. Rename + edit costs to model alternatives (budget build, bank-financed, lease-not-buy…).</p>
                <Input label="Scenario name" value={form.name} onValueChange={v => setForm(f => ({ ...f, name: v }))} isRequired autoFocus placeholder="e.g. AAC budget build" />
                <Textarea label="Notes (assumptions, deltas vs base)" value={form.notes} onValueChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="e.g. Constructioncost.ph residential-rate shell; labor per GLI ep31 at 37% of build" />
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

function ScenarioCompare({ scenarios, baseMetrics, planName, startupBase, onClose }) {
  const row = (label, get, fmt) => ({ label, values: [get(baseMetrics), ...scenarios.map(get)], fmt })
  const fmtPhp = v => v == null || isNaN(v) ? '—' : '₱' + Number(v).toLocaleString('en-PH')
  const mk = sc => (sc && (sceneMetrics(sc))) || null
  const sceneMetrics = sc => sc?.content?.VIII ? scenarioMetrics(sc.content.VIII) : scenarioMetrics(sc?.content)
  const rows = [
    { label: '12-mo revenue', get: m => m?.rev, fmt: fmtPhp },
    { label: 'COGS', get: m => m?.cogs, fmt: fmtPhp },
    { label: 'Operating expenses', get: m => m?.opex, fmt: fmtPhp },
    { label: 'Net operating income', get: m => m?.net, fmt: fmtPhp },
    { label: 'Net margin', get: m => m?.margin, fmt: v => v == null ? '—' : v.toFixed(1) + '%' },
    { label: 'Fixed costs (mo)', get: m => m?.fixed ? m.fixed : null, fmt: fmtPhp },
  ]
  return (
    <div className="mt-3 overflow-x-auto rounded-medium border border-divider bg-content1 p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold">⚖ Scenario comparison</h4>
        <Button size="sm" variant="light" onPress={onClose}>✕</Button>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-divider">
            <th className="text-left py-1.5 pr-3 text-foreground-500">Metric</th>
            <th className="text-right py-1.5 px-3 text-primary font-semibold">Base model</th>
            {scenarios.map(sc => (
              <th key={sc.id} className="text-right py-1.5 px-3">{sc.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.label} className="border-b border-divider/50">
              <td className="py-1.5 pr-3 text-foreground-500">{r.label}</td>
              <td className="text-right py-1.5 px-3 font-medium">{r.fmt(r.get(baseMetrics))}</td>
              {scenarios.map(sc => {
                const m = sceneMetrics(sc)
                return <td key={sc.id} className="text-right py-1.5 px-3">{r.fmt(r.get(m))}</td>
              })}
            </tr>
          ))}
          {startupBase && (
            <tr>
              <td className="py-1.5 pr-3 text-foreground-500">Startup (VII)</td>
              <td className="text-right py-1.5 px-3 text-[11px] text-foreground-500">{String(startupBase).slice(0, 60)}</td>
              {scenarios.map(sc => <td key={sc.id} className="text-right py-1.5 px-3 text-[11px] text-foreground-500">{sc.content?.VII?.startupCosts?.totalNote ? String(sc.content.VII.startupCosts.totalNote).slice(0, 60) : '—'}</td>)}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
