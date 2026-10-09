// FinanceKit.jsx — zero-dep PHP formatting + SVG charts + derived metrics for the Financial Plan
export const PHP = n => '₱' + Math.round(Number(n) || 0).toLocaleString('en-PH')
export const PHPl = n => '₱' + (Number(n) || 0).toLocaleString('en-PH', { maximumFractionDigits: 2 })

const GRID = 'rgba(255,255,255,0.08)'
const TXT = 'rgba(255,255,255,0.55)'

/* Grouped annual bars: years + series. fmt = value formatter */
export function BarChart({ data, series, height = 210, fmt = PHP }) {
  // data: [{label, values: {key: num}}], series: [{key, color, name}]
  const W = 560, H = height, pad = { l: 8, r: 8, t: 14, b: 26 }
  const max = Math.max(1, ...data.flatMap(d => series.map(s => Math.abs(d.values[s.key]) || 0)))
  const bw = (W - pad.l - pad.r) / data.length * 0.72 / series.length
  const gx = (W - pad.l - pad.r) / data.length
  const y = v => H - pad.b - (Math.abs(v) / max) * (H - pad.t - pad.b)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-2" style={{ maxWidth: 640 }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <line key={f} x1={pad.l} x2={W - pad.r} y1={y(max * f)} y2={y(max * f)} stroke={GRID} strokeDasharray="3 4" />
      ))}
      <text x={pad.l} y={12} fontSize={11} fill={TXT}>{fmt(max)}</text>
      {data.map((d, di) => series.map((s, si) => {
        const v = Math.abs(d.values[s.key]) || 0
        const x = pad.l + gx * di + (gx * 0.14) + si * bw
        return <rect key={s.key + di} x={x} y={y(v)} width={bw} height={H - pad.b - y(v)} rx={3} fill={s.color} />
      }))}
      {data.map((d, di) => (
        <text key={d.label} x={pad.l + gx * di + gx / 2} y={H - 8} fontSize={11} fill={TXT} textAnchor="middle">{d.label}</text>
      ))}
    </svg>
  )
}

/* Multi-line chart: monthly cumulative or cash */
export function LineChart({ labels, values, height = 190, color = '#4f8cff', zeroLine = true, name = '' }) {
  const W = 560, H = height, pad = { l: 10, r: 10, t: 16, b: 26 }
  const min = Math.min(0, ...values), max = Math.max(1, ...values)
  const y = v => H - pad.b - ((v - min) / (max - min || 1)) * (H - pad.t - pad.b)
  const x = i => pad.l + (i / Math.max(1, values.length - 1)) * (W - pad.l - pad.r)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = `${d} L${x(values.length - 1).toFixed(1)},${y(min)} L${x(0)},${y(min)} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full my-2" style={{ maxWidth: 640 }}>
      {zeroLine && min < 0 && <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke={TXT} strokeDasharray="4 4" strokeWidth={1} />}
      {min < 0 ? null : null}
      <path d={area} fill={color} opacity={0.12} />
      <path d={d} fill="none" stroke={color} strokeWidth={2.2} />
      {labels.map((l, i) => i % 2 === 0 && <text key={l + i} x={x(i)} y={H - 8} fontSize={10} fill={TXT} textAnchor="middle">{l}</text>)}
      <text x={pad.l} y={12} fontSize={11} fill={TXT}>{name}{name && ' · '}{PHPl(max)}</text>
    </svg>
  )
}

/* Donut for revenue mix */
export function Donut({ items, size = 168 }) {
  const total = items.reduce((s, i) => s + (Math.abs(i.value) || 0), 0) || 1
  const colors = ['#4f8cff', '#22c55e', '#eab308', '#a78bfa', '#f97316', '#14b8a6', '#f43f5e', '#94a3b8']
  let a0 = -Math.PI / 2
  const arcs = items.map((it, i) => {
    const frac = Math.abs(it.value) / total
    const a1 = a0 + frac * Math.PI * 2
    const large = frac > 0.5 ? 1 : 0
    const cx = size / 2, r = size / 2 - 14
    const d = `M${cx},${size / 2} L${cx + r * Math.cos(a0)},${size / 2 + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${cx + r * Math.cos(a1)},${size / 2 + r * Math.sin(a1)} Z`
    a0 = a1
    return <path key={i} d={d} fill={colors[i % colors.length]} opacity={0.9} />
  })
  return (
    <div className="flex items-center gap-4 my-2 flex-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {arcs}
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 34} fill="var(--heroui-background, #0d1012)" />
        <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize={13} fill="rgba(255,255,255,0.85)" fontWeight="600">{PHP(total)}</text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize={10} fill={TXT}>total</text>
      </svg>
      <ul className="text-xs space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: colors[i % colors.length] }} />
            <span className="text-foreground-500">{it.name}</span>
            <span className="text-foreground font-medium">{PHP(it.value)} · {Math.round((Math.abs(it.value) / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Metric card */
export function Metric({ label, value, sub, tone = 'primary' }) {
  const tones = { primary: 'border-primary/40 bg-primary/10', good: 'border-success/40 bg-success/10', warn: 'border-warning/40 bg-warning/10', bad: 'border-danger/40 bg-danger/10' }
  return (
    <div className={`rounded-xl border ${tones[tone]} px-3 py-2.5 min-w-[130px] flex-1`}>
      <div className="text-[11px] text-foreground-500 mb-0.5">{label}</div>
      <div className="text-base font-bold text-foreground leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-foreground-400 mt-0.5">{sub}</div>}
    </div>
  )
}
