import { useEffect, useState } from 'react'
import { Button } from '@heroui/react'
import { apiFetch } from '../api.js'

const php = n => (n == null || isNaN(n)) ? '—' : (n < 0 ? '−₱' + Math.round(-n).toLocaleString('en-PH') : '₱' + Math.round(n).toLocaleString('en-PH'))

/* ── Portfolio view (2026-10-16 deep-dive build #2) ─────────────
   Cross-plan whole-picture: one headline row per plan (12-mo Y1
   revenue / net operating income / margin / capex / payback) +
   portfolio totals + a compact horizontal bar chart of Y1 net.
   Data = GET /api/summary (server computes, legacy-VII-shape safe).
   Rows are pressable → opens the plan (#selection handled by parent
   via onOpenPlan).                                                        */

export default function PortfolioView({ onOpenPlan }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true
    apiFetch('/api/summary')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then(d => { if (alive) setData(d) })
      .catch(e => { if (alive) setErr(String(e && e.message || e)) })
    return () => { alive = false }
  }, [])

  if (err) return <div className="p-6 text-sm text-danger">Portfolio summary failed to load: {err}</div>
  if (!data) return <div className="p-6 text-sm text-foreground-400">Loading portfolio…</div>

  const { plans, totals } = data
  const maxAbsNet = Math.max(1, ...plans.map(p => Math.abs(p.net || 0)))
  const profitable = plans.filter(p => (p.net || 0) > 0).length
  const ramping = plans.filter(p => (p.net || 0) <= 0 && (p.revenue || 0) > 0).length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <span className="text-xs text-foreground-400">12-month Year-1 basis · auto-computed from each plan's Section VIII (+ VII capex)</span>
      </div>
      <p className="text-xs text-foreground-500 mb-4">
        {plans.length} plans · {profitable} net-positive today · {ramping} in ramp-up or negative · total capital modeled {php(totals.capex)}
      </p>

      {/* Totals strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="rounded-medium border border-divider bg-content1 px-4 py-3">
          <div className="text-[11px] text-foreground-500 uppercase tracking-wide">Combined Y1 revenue</div>
          <div className="text-lg font-semibold">{php(totals.revenue)}</div>
        </div>
        <div className="rounded-medium border border-divider bg-content1 px-4 py-3">
          <div className="text-[11px] text-foreground-500 uppercase tracking-wide">Combined Y1 net</div>
          <div className={`text-lg font-semibold ${(totals.net || 0) >= 0 ? 'text-success' : 'text-danger'}`}>{php(totals.net)}</div>
        </div>
        <div className="rounded-medium border border-divider bg-content1 px-4 py-3">
          <div className="text-[11px] text-foreground-500 uppercase tracking-wide">Capital modeled</div>
          <div className="text-lg font-semibold">{php(totals.capex)}</div>
        </div>
        <div className="rounded-medium border border-divider bg-content1 px-4 py-3">
          <div className="text-[11px] text-foreground-500 uppercase tracking-wide">Net-positive plans</div>
          <div className="text-lg font-semibold">{profitable} / {plans.length}</div>
        </div>
      </div>

      {/* Per-plan table */}
      <div className="rounded-medium border border-divider bg-content1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider text-foreground-500 text-xs">
              <th className="text-left py-2.5 px-3">Plan</th>
              <th className="text-right py-2.5 px-3">Y1 revenue</th>
              <th className="text-right py-2.5 px-3">Y1 net op. income</th>
              <th className="text-right py-2.5 px-3">Margin</th>
              <th className="text-right py-2.5 px-3">Capex</th>
              <th className="text-right py-2.5 px-3">Payback (yrs)</th>
              <th className="text-left py-2.5 px-3 pl-6 w-64">Y1 net</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(p => {
              const net = p.net || 0
              const w = Math.round(Math.abs(net) / maxAbsNet * 100)
              return (
                <tr
                  key={p.id}
                  className="border-b border-divider/50 hover:bg-content2 cursor-pointer"
                  onClick={() => onOpenPlan && onOpenPlan(p.id)}
                >
                  <td className="py-2.5 px-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-[11px] text-foreground-500">{p.industry || '—'} · {p.completion}/10 sections · {p.scenarios} scenario{p.scenarios === 1 ? '' : 's'}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{php(p.revenue)}</td>
                  <td className={`py-2.5 px-3 text-right tabular-nums ${net >= 0 ? 'text-success' : 'text-danger'}`}>{php(net)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{p.margin == null ? '—' : p.margin.toFixed(1) + '%'}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{php(p.capex)}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{p.paybackYears == null ? 'ramp/neg' : p.paybackYears.toFixed(1)}</td>
                  <td className="py-2.5 px-3 pl-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-divider/40 relative overflow-hidden">
                        {net >= 0 ? (
                          <div className="absolute inset-y-0 left-1/2 rounded-full bg-success" style={{ left: '50%', width: `${w / 2}%` }} />
                        ) : (
                          <div className="absolute inset-y-0 rounded-full bg-danger" style={{ left: `${50 - w / 2}%`, width: `${w / 2}%` }} />
                        )}
                        <div className="absolute inset-y-0 left-1/2 w-px bg-foreground/30" />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-divider font-semibold">
              <td className="py-2.5 px-3">Portfolio total</td>
              <td className="py-2.5 px-3 text-right tabular-nums">{php(totals.revenue)}</td>
              <td className={`py-2.5 px-3 text-right tabular-nums ${(totals.net || 0) >= 0 ? 'text-success' : 'text-danger'}`}>{php(totals.net)}</td>
              <td className="py-2.5 px-3" />
              <td className="py-2.5 px-3 text-right tabular-nums">{php(totals.capex)}</td>
              <td className="py-2.5 px-3" />
              <td className="py-2.5 px-3" />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-[11px] text-foreground-400 mt-3">
        Y1 = each plan's Year-1 totals as entered in Section VIII (mid-year openers show their ramp-year result — funeral/boarding/coworking run red in Y1 by design). Payback = capex ÷ Y1 net only where net is positive; multi-year paybacks live in each plan's VIII notes.
      </p>
    </div>
  )
}