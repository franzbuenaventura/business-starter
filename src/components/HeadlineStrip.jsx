import { useMemo } from 'react'
import { scenarioMetrics } from './ScenarioBar.jsx'

const php = n => (n == null || isNaN(n)) ? '—' : (n < 0 ? '−₱' + Math.round(-n).toLocaleString('en-PH') : '₱' + Math.round(n).toLocaleString('en-PH'))

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
    if (typeof vii.totalStartupCost === 'number' && vii.totalStartupCost > 0) return vii.totalStartupCost
    // AGY-final fix: legacy shapes — amounts may sit in .amount OR Fairway-style .cost;
    // expense list may be top-level vii.expenses (plans 2/3) not under startupCosts.
    // .amount first; fall back to .cost ONLY for rows without .amount (Fairway's
    // categories carry draft .cost values that contradict its locked expenses rows —
    // summing both = wrong capex; so compute amount-only vs amount+cost-fallback sums
    // and take the SMALLER (draft cost keys can only overstate).
    const sumOnly = (list, withCost) => (Array.isArray(list) ? list.reduce((a, r) => {
      if (!r || typeof r !== 'object') return a
      const raw = withCost ? (r.amount ?? r.cost) : r.amount
      if (raw == null) return a
      if (r.amount == null && !withCost) return a
      return a + (parseFloat(String(raw).replace(/,/g, '')) || 0)
    }, 0) : 0)
    const cat = vii.startupCosts && Array.isArray(vii.startupCosts.categories) ? Math.max(sumOnly(vii.startupCosts.categories, false) === 0 ? sumOnly(vii.startupCosts.categories, true) : 0, 0) : 0
    // simpler & correct: amount-only sums; if that totals 0 across BOTH lists AND cost-only exists, use cost:
    const catAmt = vii.startupCosts && Array.isArray(vii.startupCosts.categories) ? sumOnly(vii.startupCosts.categories, false) : 0
    const catCost = vii.startupCosts && Array.isArray(vii.startupCosts.categories) ? sumOnly(vii.startupCosts.categories, true) : 0
    const exAmt = sumOnly(vii.expenses || [], false)
    const catUse = catAmt > 0 ? catAmt : catCost
    // Locked-expenses-wins law (AGY-confirmed Fairway trap): concrete amount-bearing
    // expense rows are the verified truth; cost-only categories are legacy drafts.
    if (exAmt > 0) return exAmt
    return catUse || null
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
        {capex != null && (
          <div className="flex flex-col justify-center min-w-[104px] px-2.5 py-0.5">
            <span className="text-[10px] uppercase tracking-wide text-foreground-500">Payback @ Y1 pace</span>
            <span className="text-sm font-semibold tabular-nums">
              {m.net <= 0 ? 'ramp/neg' : (capex / m.net > 25 ? '>25 (ramp yr)' : (capex / m.net).toFixed(1) + ' yrs')}
            </span>
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