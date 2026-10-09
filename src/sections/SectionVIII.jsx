import { Button } from '@heroui/react'
import { SectionPage, Group, Field, Row, SubTitle } from '../components/Fields.jsx'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const inputCls = 'w-full px-2.5 py-1.5 rounded-lg bg-content1 border border-divider text-sm outline-none focus:border-primary'
const numberCls = 'w-full px-2.5 py-1.5 rounded-lg bg-content1 border border-divider text-sm text-right outline-none focus:border-primary'
const itemLabel = 'text-[11px] font-medium text-foreground-500 mb-1'
const totalCls = 'text-sm font-semibold text-foreground text-right px-3 py-2 border-t border-divider mt-1'

function RemoveBtn({ onRemove, label }) {
  return (
    <Button isIconOnly size="sm" variant="light" radius="full" aria-label={label}
      className="text-foreground-500 hover:text-danger" onPress={onRemove}>
      ✕
    </Button>
  )
}

/* Category + amount row */
function CRow({ item, index, onUpdate, onRemove, np, ap }) {
  const ch = (f, v) => onUpdate(index, { ...item, [f]: v })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end mb-3 p-3 rounded-xl border border-divider bg-content2">
      <div>
        <div className={itemLabel}>Category / Description</div>
        <input className={inputCls} type="text" value={item.name ?? ''} onChange={e => ch('name', e.target.value)} placeholder={np || ''} />
      </div>
      <div>
        <div className={itemLabel}>Amount ($)</div>
        <input className={numberCls} type="number" min="0" step="0.01" value={item.amount ?? ''} onChange={e => ch('amount', e.target.value)} placeholder={ap || '0.00'} />
      </div>
      {index > 0 ? <RemoveBtn onRemove={() => onRemove(index)} label="Remove item" /> : <div />}
    </div>
  )
}

/* Cash-flow row: category + 12 monthly cells */
function CFItem({ row, index, onUpdate, onRemove }) {
  const hf = (f, v) => onUpdate(index, { ...row, [f]: v })
  return (
    <div className="mb-3 p-3 rounded-xl border border-divider bg-content2">
      <div className="flex gap-3 items-center mb-3">
        <div className="flex-1">
          <div className={itemLabel}>Category</div>
          <input className={inputCls} type="text" value={row.category ?? ''} onChange={e => hf('category', e.target.value)} placeholder="e.g. Cash Sales, Inventory, Rent" />
        </div>
        {index > 0 && <RemoveBtn onRemove={() => onRemove(index)} label="Remove category" />}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
        {MONTHS.map((m, i) => (
          <div key={m}>
            <div className="text-[11px] text-foreground-500 font-medium">{m}</div>
            <input className="w-full px-2 py-1 rounded-lg bg-content1 border border-divider text-xs text-right outline-none focus:border-primary"
              type="number" min="0" step="0.01"
              value={row.monthly?.[i] ?? ''}
              onChange={e => { const mArr = [...(row.monthly || Array(12).fill(''))]; mArr[i] = e.target.value; hf('monthly', mArr) }}
              placeholder="0" />
          </div>
        ))}
      </div>
    </div>
  )
}

const AddBtn = ({ onClick, children }) => (
  <Button size="sm" variant="bordered" color="primary" className="mb-4" onPress={onClick}>{children}</Button>
)

export default function SectionVIII({ data, onChange }) {
  const hc = (f, v) => onChange && onChange({ ...(data || {}), [f]: v })
  const sa = a => (a || []).reduce((sm, r) => sm + (parseFloat(r.amount) || 0), 0)
  const rev = data?.revenueItems || [{ name: '', amount: '' }]
  const cog = data?.cogsItems || [{ name: '', amount: '' }]
  const opex = data?.operatingExpenses || [{ name: '', amount: '' }]
  const ci = data?.cashInflowItems || [{ category: '', monthly: [] }]
  const co = data?.cashOutflowItems || [{ category: '', monthly: [] }]
  const ba = data?.balanceAssets || [{ name: '', amount: '' }]
  const bl = data?.balanceLiabilities || [{ name: '', amount: '' }]
  const be = data?.balanceEquity || [{ name: '', amount: '' }]
  const fc = data?.fixedCostItems || [{ name: '', amount: '' }]
  const vc = data?.variableCostItems || [{ name: '', amount: '' }]
  const uoc = data?.useOfCapitalItems || [{ description: '', amount: '' }]

  const mkH = (fld, starter) => ({
    add: () => { const l = data?.[fld] || [{ ...starter }]; hc(fld, [...l, { ...starter }]); },
    update: (i, u) => { const l = data?.[fld] || []; hc(fld, l.map((r, j) => j === i ? u : r)); },
    remove: (i) => { const l = data?.[fld] || []; const n = l.filter((_, j) => j !== i); hc(fld, n.length ? n : [{ ...starter }]); },
  })
  const rh = mkH('revenueItems', { name: '', amount: '' })
  const ch = mkH('cogsItems', { name: '', amount: '' })
  const oh = mkH('operatingExpenses', { name: '', amount: '' })
  const bah = mkH('balanceAssets', { name: '', amount: '' })
  const blh = mkH('balanceLiabilities', { name: '', amount: '' })
  const beh = mkH('balanceEquity', { name: '', amount: '' })
  const fch = mkH('fixedCostItems', { name: '', amount: '' })
  const vch = mkH('variableCostItems', { name: '', amount: '' })
  const uoh = mkH('useOfCapitalItems', { description: '', amount: '' })

  const cfi = {
    add: () => { const l = data?.cashInflowItems || [{ category: '', monthly: [] }]; hc('cashInflowItems', [...l, { category: '', monthly: [] }]); },
    update: (i, u) => { const l = data?.cashInflowItems || []; hc('cashInflowItems', l.map((r, j) => j === i ? u : r)); },
    remove: (i) => { const l = data?.cashInflowItems || []; const n = l.filter((_, j) => j !== i); hc('cashInflowItems', n.length ? n : [{ category: '', monthly: [] }]); },
  }
  const cfo = {
    add: () => { const l = data?.cashOutflowItems || [{ category: '', monthly: [] }]; hc('cashOutflowItems', [...l, { category: '', monthly: [] }]); },
    update: (i, u) => { const l = data?.cashOutflowItems || []; hc('cashOutflowItems', l.map((r, j) => j === i ? u : r)); },
    remove: (i) => { const l = data?.cashOutflowItems || []; const n = l.filter((_, j) => j !== i); hc('cashOutflowItems', n.length ? n : [{ category: '', monthly: [] }]); },
  }

  const d = data || {}

  return (
    <SectionPage title="Financial Plan" intro="Your financial plan is the most closely scrutinized part of your business plan. Lenders and investors will study it carefully — not just to see the numbers, but to assess whether your thinking is sound and your projections are grounded in reality. A well-constructed financial plan also helps you set clear goals, anticipate funding needs, and make smarter decisions as your business grows.">
      {/* 1. 12-MONTH PROFIT & LOSS */}
      <Group title="1. 12-Month Profit & Loss Projection" hint="The P&L (income statement) is the centerpiece of your financial plan. Enter projected sales, COGS, gross profit, operating expenses, net profit before tax, tax liability, and net operating income. Explain the assumptions behind every number.">
        <SubTitle>Projected Revenue (Sales)</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Draw on the Sales Forecast from Section IV. List each revenue stream.</div>
        {rev.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={rh.update} onRemove={rh.remove} np="e.g. Product sales, services, subscriptions" ap="0.00" />)}
        <AddBtn onClick={rh.add}>+ Add Revenue Stream</AddBtn>
        <div className={totalCls}>Total Revenue: ${sa(rev).toFixed(2)}</div>

        <SubTitle>Cost of Goods Sold</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Direct costs of producing goods or services.</div>
        {cog.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={ch.update} onRemove={ch.remove} np="e.g. Materials, direct labor, shipping" ap="0.00" />)}
        <AddBtn onClick={ch.add}>+ Add COGS Item</AddBtn>
        <div className={totalCls}>Total COGS: ${sa(cog).toFixed(2)}</div>

        {(() => { const rv = sa(rev); const cg = sa(cog); return (
          <div className="flex justify-end gap-6 mb-6 mt-2">
            <div className="text-sm font-semibold">Gross Profit: ${(rv - cg).toFixed(2)}</div>
            <div className="text-sm text-foreground-500">Margin: {rv > 0 ? ((rv - cg) / rv * 100).toFixed(1) + '%' : '—'}</div>
          </div>
        ); })()}

        <SubTitle>Operating Expenses</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Rent, marketing, payroll, utilities, etc.</div>
        {opex.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={oh.update} onRemove={oh.remove} np="e.g. Rent, Marketing, Payroll" ap="0.00" />)}
        <AddBtn onClick={oh.add}>+ Add Operating Expense</AddBtn>
        <div className={totalCls}>Total OpEx: ${sa(opex).toFixed(2)}</div>

        {(() => { const netST = sa(rev) - sa(cog) - sa(opex); return (
          <div className={`text-sm font-bold text-right px-3 py-2 border-t-2 border-divider mt-2 ${netST >= 0 ? 'text-success' : 'text-danger'}`}>
            Net Profit Before Tax: ${netST.toFixed(2)}
          </div>
        ); })()}

        <Field label="Estimated Tax Liability ($)" hint="Estimate income tax on projected profit. Consult a tax professional." type="number" min="0" step="0.01" value={d.estimatedTaxLiability} onChange={v => hc('estimatedTaxLiability', v)} />

        {(() => { const tax = parseFloat(d.estimatedTaxLiability) || 0; const noi = sa(rev) - sa(cog) - sa(opex) - tax; return (
          <div className={`text-base font-bold text-right px-3 py-3 rounded-xl border-2 mt-3 ${noi >= 0 ? 'text-success border-success' : 'text-danger border-danger'}`}>
            Net Operating Income: ${noi.toFixed(2)}
          </div>
        ); })()}

        <Field label="P&L Assumptions & Notes" hint="Explain the assumptions behind your revenue projections and cost estimates. When you sit down with a lender or investor, these are exactly the questions they will ask." value={d.pnlAssumptions} onChange={v => hc('pnlAssumptions', v)} tall />
      </Group>

      {/* 2. 3-YEAR P&L (optional) */}
      <Group title="2. Three-Year P&L Projection (optional)" hint="Include if financials are expected to change significantly after year one — from expansion, hiring, or new products. Some lenders will ask for this.">
        <Row cols={3}>
          <Field label="Y2 Revenue ($)" type="number" value={d.threeYearRevenueY2} onChange={v => hc('threeYearRevenueY2', v)} />
          <Field label="Y2 Expenses ($)" type="number" value={d.threeYearExpensesY2} onChange={v => hc('threeYearExpensesY2', v)} />
          <Field label="Y2 Net Profit ($)" type="number" value={d.threeYearNetProfitY2} onChange={v => hc('threeYearNetProfitY2', v)} />
          <Field label="Y3 Revenue ($)" type="number" value={d.threeYearRevenueY3} onChange={v => hc('threeYearRevenueY3', v)} />
          <Field label="Y3 Expenses ($)" type="number" value={d.threeYearExpensesY3} onChange={v => hc('threeYearExpensesY3', v)} />
          <Field label="Y3 Net Profit ($)" type="number" value={d.threeYearNetProfitY3} onChange={v => hc('threeYearNetProfitY3', v)} />
        </Row>
        <Field label="3-Year P&L Context" hint="Explain expected changes — expansion, hiring, new products." value={d.threeYearPnLNotes} onChange={v => hc('threeYearPnLNotes', v)} tall />
      </Group>

      {/* 3. 12-MONTH CASH FLOW */}
      <Group title="3. 12-Month Cash Flow Projection" hint="Profit and cash flow are not the same thing. Your cash flow projection tracks actual money movement — when you pay expenses and when you receive payment. It accounts for timing gaps and helps avoid running out of money even when business is going well.">
        <SubTitle>Cash Inflows</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Money coming in: cash sales, credit collections, loan proceeds, investments, etc.</div>
        {ci.map((r, i) => <CFItem key={i} row={r} index={i} onUpdate={cfi.update} onRemove={cfi.remove} />)}
        <AddBtn onClick={cfi.add}>+ Add Inflow Category</AddBtn>

        <SubTitle>Cash Outflows</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Money going out: inventory, rent, payroll, loan payments, etc.</div>
        {co.map((r, i) => <CFItem key={i} row={r} index={i} onUpdate={cfo.update} onRemove={cfo.remove} />)}
        <AddBtn onClick={cfo.add}>+ Add Outflow Category</AddBtn>

        <Field label="Beginning Cash Balance ($)" hint="Cash on hand at the start of the projection period." type="number" min="0" step="0.01" value={d.beginningCashBalance} onChange={v => hc('beginningCashBalance', v)} />
        <Field label="Cash Flow Assumptions & Notes" hint="Explain timing assumptions — payment terms, seasonal patterns, collection periods." value={d.cashFlowAssumptions} onChange={v => hc('cashFlowAssumptions', v)} tall />
      </Group>

      {/* 4. 3-YEAR CASH FLOW (optional) */}
      <Group title="4. Three-Year Cash Flow Statement (optional)" hint="Include if a longer-term view is needed or if investors/lenders request it. This is a simpler document than the monthly projection, useful for demonstrating how cash position evolves.">
        <Row cols={3}>
          <Field label="Y1 Net Cash Flow ($)" type="number" value={d.threeYearCashY1} onChange={v => hc('threeYearCashY1', v)} />
          <Field label="Y2 Net Cash Flow ($)" type="number" value={d.threeYearCashY2} onChange={v => hc('threeYearCashY2', v)} />
          <Field label="Y3 Net Cash Flow ($)" type="number" value={d.threeYearCashY3} onChange={v => hc('threeYearCashY3', v)} />
          <Field label="Y1 Ending Cash ($)" type="number" value={d.threeYearEndingCashY1} onChange={v => hc('threeYearEndingCashY1', v)} />
          <Field label="Y2 Ending Cash ($)" type="number" value={d.threeYearEndingCashY2} onChange={v => hc('threeYearEndingCashY2', v)} />
          <Field label="Y3 Ending Cash ($)" type="number" value={d.threeYearEndingCashY3} onChange={v => hc('threeYearEndingCashY3', v)} />
        </Row>
        <Field label="3-Year Cash Flow Notes" hint="Describe how your cash position is expected to evolve as the business matures." value={d.threeYearCashFlowNotes} onChange={v => hc('threeYearCashFlowNotes', v)} tall />
      </Group>

      {/* 5. PROJECTED BALANCE SHEET */}
      <Group title="5. Projected Balance Sheet (End of Year One)" hint="Shows the financial position of your business at a specific point in time — your assets, liabilities, and owner's equity reflecting year one operations. Many lenders and investors want to see this documented.">
        <SubTitle>Assets</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">What the business owns: cash, AR, equipment, inventory, etc.</div>
        {ba.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={bah.update} onRemove={bah.remove} np="e.g. Cash, AR, Equipment, Inventory" ap="0.00" />)}
        <AddBtn onClick={bah.add}>+ Add Asset</AddBtn>
        <div className={totalCls}>Total Assets: ${sa(ba).toFixed(2)}</div>

        <SubTitle>Liabilities</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">What the business owes: AP, loans payable, other debts.</div>
        {bl.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={blh.update} onRemove={blh.remove} np="e.g. AP, Loans Payable" ap="0.00" />)}
        <AddBtn onClick={blh.add}>+ Add Liability</AddBtn>
        <div className={totalCls}>Total Liabilities: ${sa(bl).toFixed(2)}</div>

        <SubTitle>Owner's Equity</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Owner's investment plus retained earnings (or minus losses).</div>
        {be.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={beh.update} onRemove={beh.remove} np="e.g. Owner investment, Retained earnings" ap="0.00" />)}
        <AddBtn onClick={beh.add}>+ Add Equity Item</AddBtn>
        <div className={totalCls}>Total Equity: ${sa(be).toFixed(2)}</div>

        {(() => { const a = sa(ba); const l = sa(bl); const e = sa(be); const c = a - l; const ok = Math.abs(c - e) < 0.01; return (
          <div className="mt-4 p-4 rounded-xl bg-content2 border border-divider text-sm leading-relaxed">
            <div className="font-semibold mb-1">Balance Sheet Check</div>
            <div>Total Assets: ${a.toFixed(2)}</div>
            <div>Total Liabilities: ${l.toFixed(2)}</div>
            <div><strong>Calc. Equity (A-L): ${c.toFixed(2)}</strong></div>
            <div><strong>Entered Equity: ${e.toFixed(2)}</strong></div>
            <span className={`font-semibold ${ok ? 'text-success' : 'text-danger'}`}>
              {ok ? '✓ In balance.' : '✗ Out of balance.'}
            </span>
          </div>
        ); })()}

        <Field label="Balance Sheet Notes" hint="Explain significant changes from your opening-day balance sheet (Section VII)." value={d.balanceSheetNotes} onChange={v => hc('balanceSheetNotes', v)} tall />
      </Group>

      {/* 6. BREAK-EVEN ANALYSIS */}
      <Group title="6. Break-Even Analysis" hint="Identifies the sales volume needed to cover all costs — the point where the business stops losing money and starts generating profit. Consider running more than one scenario to find the most financially sound path forward.">
        <SubTitle>Fixed Costs (monthly)</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Costs constant regardless of sales volume: rent, salaries, insurance, etc.</div>
        {fc.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={fch.update} onRemove={fch.remove} np="e.g. Rent, Salaries, Insurance" ap="0.00" />)}
        <AddBtn onClick={fch.add}>+ Add Fixed Cost</AddBtn>
        <div className={totalCls}>Total Fixed Costs: ${sa(fc).toFixed(2)}</div>

        <SubTitle>Variable Costs (per unit)</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Costs varying with volume: materials, direct labor, commissions, etc.</div>
        {vc.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={vch.update} onRemove={vch.remove} np="e.g. Materials, Direct labor, Commissions" ap="0.00" />)}
        <AddBtn onClick={vch.add}>+ Add Variable Cost</AddBtn>
        <div className={totalCls}>Total Variable Cost/Unit: ${sa(vc).toFixed(2)}</div>

        <Field label="Average Unit Price / Revenue per Sale ($)" hint="The average amount expected per unit sold or customer transaction." type="number" min="0" step="0.01" value={d.avgUnitPrice} onChange={v => hc('avgUnitPrice', v)} />

        {(() => { const ft = sa(fc); const vt = sa(vc); const up = parseFloat(d.avgUnitPrice) || 0; const beu = up > 0 ? Math.ceil(ft / (up - (vt || 0.01))) : '—'; const valid = up > 0 && vt < up; return (
          <div className="mt-4 p-4 rounded-xl border-2 border-success bg-success-100/10">
            <div className="text-base font-bold text-success mb-2">Break-Even Calculation</div>
            {valid ? (
              <div className="text-sm leading-loose">
                Fixed Costs/mo: ${ft.toFixed(2)}<br />
                Variable Cost/Unit: ${vt.toFixed(2)}<br />
                Contribution Margin: ${(up - vt).toFixed(2)}<br />
                Break-Even (units/mo): {beu} units<br />
                Break-Even Revenue/mo: ${(beu * up).toFixed(2)}
              </div>
            ) : (
              <div className="text-sm text-danger">Enter a unit price greater than variable cost to calculate.</div>
            )}
          </div>
        ); })()}

        <Field label="Break-Even Assumptions & Scenarios" hint="Model different scenarios — staffing models, pricing tiers, cost structures." value={d.breakEvenNotes} onChange={v => hc('breakEvenNotes', v)} tall />
      </Group>

      {/* 7. USE OF CAPITAL */}
      <Group title="7. Use of Capital" hint="If seeking financing, be explicit about how you will use the funds and what outcomes you expect. Lenders and investors want to see a clear connection between the money they provide and the results you are projecting.">
        <Field label="Total Capital Requested ($)" hint="Total financing sought from lenders or investors." type="number" min="0" step="0.01" value={d.totalCapitalRequested} onChange={v => hc('totalCapitalRequested', v)} />

        <SubTitle>How the Funds Will Be Used</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">Be specific: what will the money buy, what will it enable, and how will it affect revenue or production capacity?</div>
        {uoc.map((r, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end mb-3 p-3 rounded-xl border border-divider bg-content2">
            <div>
              <div className={itemLabel}>Use of Funds</div>
              <input className={inputCls} type="text" value={r.description ?? ''} onChange={e => uoh.update(i, { ...r, description: e.target.value })} placeholder="e.g. Equipment, marketing, hiring" />
            </div>
            <div>
              <div className={itemLabel}>Amount ($)</div>
              <input className={numberCls} type="number" min="0" step="0.01" value={r.amount ?? ''} onChange={e => uoh.update(i, { ...r, amount: e.target.value })} placeholder="0.00" />
            </div>
            {i > 0 ? <RemoveBtn onRemove={() => uoh.remove(i)} label="Remove item" /> : <div />}
          </div>
        ))}
        <AddBtn onClick={uoh.add}>+ Add Item</AddBtn>
        <div className={totalCls}>Total Allocated: ${sa(uoc).toFixed(2)}</div>

        <Field label="Expected Outcomes" hint="What specific results do you expect — increased revenue, expanded capacity, new product lines?" value={d.capitalExpectedOutcomes} onChange={v => hc('capitalExpectedOutcomes', v)} tall />
        <Field label="Additional Financial Notes" hint="Any other context that helps readers understand your financial plan — contingent liabilities, seasonal considerations, insurance, tax strategies, etc." value={d.financialNotes} onChange={v => hc('financialNotes', v)} tall />
      </Group>
    </SectionPage>
  )
}