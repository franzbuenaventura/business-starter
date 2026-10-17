import { useMemo } from 'react'
import { scenarioMetrics } from './ScenarioBar.jsx'

const php = n => (n == null || isNaN(n)) ? '—' : '₱' + Math.round(n).toLocaleString('en-PH')

/* ── Plan headline strip (2026-10-16 deep-dive build #3) ──────
   4 money cards floating at the top of EVERY section of the plan
   editor: Y1 revenue · Y1 net op. income · margin · capex.
   Reads the ACTIVE data view: while a scenario is active the strip
   shows the scenario's copy (viiiSource = override), otherwise base.
   Payback shown inline (capex ÷ Y1 net) only when net > 0.        */

export default function HeadlineStrip({ viii, vii, activeScenarioName }) {
  const m = useMemo(() => {
    let v = viii
    if (typeof v === 'string') { try { v = JSON.parse(v) } catch { return null } }
    return scenarioMetrics(v)
  }, [viii])
  const capex = useMemo(() => {
    let x = vii
    if (typeof x === 'string') { try { x = JSON.parse(x) } catch { return null } }
    vii = x
    if (!vii) return null
    if (typeof vii.totalStartupCost === 'number') return vii.totalStartupCost
    const sum = list => (Array.isArray(list) ? list.reduce((a, r) => a + (parseFloat(String(r?.amount == null ? 0 : r.amount).replace(/,/g, '')) || 0), 0) : 0)
    const cat = vii.startupCosts && Array.isArray(vii.startupCosts.categories) ? sum(vii.startupCosts.categories) : 0
    const ex = vii.startupCosts && Array.isArray(vii.startupCosts.expenses) ? sum(vii.startupCosts.expenses) : 0
    return Math.max(cat, ex) || null
  }, [vii])

  if (!m) return null
  const items = [
    { label: 'Y1 revenue', value: php(m.rev), tone: '' },
    { label: 'Y1 net op. income', value: php(m.net), tone: (m.net || 0) >= 0 ? 'text-success' : 'text-danger' },
    { label: 'Net margin', value: m.margin == null ? '—' : m.margin.toFixed(1) + '%', tone: (m.margin || 0) >= 0 ? '' : 'text-danger' },
    { label: 'Capex', value: capex == null ? '—' : php(capex), tone: '' },
  ]
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="flex flex-wrap gap-2 items-stretch rounded-medium border border-divider bg-content2/40 px-3 py-2">
        {items.map(it => (
          <div key={it.label} className="flex flex-col justify-center min-w-[104px] px-2.5 py-0.5">
            <span className="text-[10px] uppercase tracking-wide text-foreground-500">{it.label}</span>
            <span className={`text-sm font-semibold tabular-nums ${it.tone}`}>{it.value}</span>
          </div>
        ))}
        {capex != null && m.net > 0 && (
          <div className="flex flex-col justify-center min-w-[104px] px-2.5 py-0.5">
            <span className="text-[10px] uppercase tracking-wide text-foreground-500">Payback @ Y1 pace</span>
            <span className="text-sm font-semibold tabular-nums">{(capex / m.net).toFixed(1)} yrs</span>
          </div>
        )}
        {activeScenarioName && (
          <div className="flex items-center">
            <span className="text-[10px] px-2 py-1 rounded-full bg-warning-100/30 text-warning-600 border border-warning-300/50">scenario: {activeScenarioName}</span>
          </div>
        )}
      </div>
    </div>
  )
}