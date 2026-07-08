import { useCallback } from "react";

const s = {
  c: { fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", maxWidth: 800, margin: "0 auto", padding: "24px 16px" },
  h1: { fontSize: 28, fontWeight: 700, margin: "0 0 4px 0", color: "#1a1a2e" },
  sub: { fontSize: 14, color: "#666", margin: "0 0 24px 0", lineHeight: 1.5 },
  sg: { marginBottom: 32 },
  gt: { fontSize: 18, fontWeight: 600, color: "#1a1a2e", margin: "0 0 12px 0", paddingBottom: 6, borderBottom: "2px solid #e0e0e0" },
  sgt: { fontSize: 16, fontWeight: 600, color: "#1a1a2e", margin: "16px 0 8px 0" },
  fg: { marginBottom: 20 },
  lb: { display: "block", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 },
  hn: { display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontStyle: "italic" },
  inp: { width: "100%", padding: "10px 12px", fontSize: 15, border: "1px solid #ccc", borderRadius: 6, boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.4, outline: "none", transition: "border-color .15s" },
  num: { width: "100%", padding: "10px 12px", fontSize: 15, border: "1px solid #ccc", borderRadius: 6, boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.4, outline: "none", transition: "border-color .15s", textAlign: "right" },
  ta: { width: "100%", padding: "10px 12px", fontSize: 15, border: "1px solid #ccc", borderRadius: 6, boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", minHeight: 80, outline: "none", transition: "border-color .15s" },
  tat: { width: "100%", padding: "10px 12px", fontSize: 15, border: "1px solid #ccc", borderRadius: 6, boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", minHeight: 120, outline: "none", transition: "border-color .15s" },
  g3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  ab: { padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "#4a90d9", background: "none", border: "1px dashed #4a90d9", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", marginTop: 4 },
  rb: { padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#d32f2f", background: "none", border: "1px solid #d32f2f", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" },
  rr: { display: "grid", gridTemplateColumns: "1fr 180px 36px", gap: 12, alignItems: "end", marginBottom: 12, padding: 12, backgroundColor: "#fafafa", borderRadius: 6, border: "1px solid #eee" },
  tl: { fontSize: 14, fontWeight: 600, color: "#1a1a2e", textAlign: "right", padding: "8px 12px", borderTop: "1px solid #ccc", marginTop: 4 },
  mh: { display: "block", fontSize: 12, color: "#888", marginBottom: 2, fontStyle: "italic" },
};

function Input({ label, hint, value, onChange, field, type, placeholder }) {
  const h = useCallback(e => onChange(field, e.target.value), [onChange, field]);
  return <div style={s.fg}><label style={s.lb}>{label}</label>{hint && <span style={s.hn}>{hint}</span>}<input style={type === "number" ? s.num : s.inp} type={type || "text"} value={value ?? ""} onChange={h} placeholder={placeholder || ""} onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div>;
}

function Tx({ label, hint, value, onChange, field, tall, rows }) {
  const h = useCallback(e => onChange(field, e.target.value), [onChange, field]);
  return <div style={s.fg}><label style={s.lb}>{label}</label>{hint && <span style={s.hn}>{hint}</span>}<textarea style={tall ? s.tat : s.ta} value={value ?? ""} onChange={h} rows={rows || 3} onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div>;
}

function CRow({ item, index, onUpdate, onRemove, np, ap }) {
  const ch = (f, v) => onUpdate(index, { ...item, [f]: v });
  return <div style={s.rr}><div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={s.mh}>Category / Description</span><input style={s.inp} type="text" value={item.name ?? ""} onChange={e => ch("name", e.target.value)} placeholder={np || ""} onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div><div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={s.mh}>Amount ($)</span><input style={s.num} type="number" min="0" step="0.01" value={item.amount ?? ""} onChange={e => ch("amount", e.target.value)} placeholder={ap || "0.00"} onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div>{index > 0 ? <button type="button" style={{ ...s.rb, marginBottom: 4, alignSelf: "end" }} onClick={() => onRemove(index)}>&#x2715;</button> : <div />}</div>;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function CFItem({ row, index, onUpdate, onRemove }) {
  const hf = (f, v) => onUpdate(index, { ...row, [f]: v });
  return <div style={{ marginBottom: 12, padding: 12, backgroundColor: "#fafafa", borderRadius: 6, border: "1px solid #eee" }}><div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}><div style={{ flex: 1 }}><span style={s.mh}>Category</span><input style={s.inp} type="text" value={row.category ?? ""} onChange={e => hf("category", e.target.value)} placeholder="e.g. Cash Sales, Inventory, Rent" onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div>{index > 0 && <button type="button" style={{ ...s.rb, marginTop: 16 }} onClick={() => onRemove(index)}>&#x2715;</button>}</div><div style={s.g3}>{MONTHS.map((m, i) => <div key={m} style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 11, color: "#888", fontWeight: 500 }}>{m}</span><input style={{ ...s.num, fontSize: 13, padding: "6px 8px" }} type="number" min="0" step="0.01" value={row.monthly?.[i] ?? ""} onChange={e => { const mArr = [...(row.monthly || Array(12).fill(""))]; mArr[i] = e.target.value; hf("monthly", mArr); }} placeholder="0" onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div>)}</div></div>;
}

export default function SectionVIII({ data, onChange }) {
  const hc = useCallback((f, v) => onChange({ ...(data || {}), [f]: v }), [data, onChange]);
  const sa = a => (a || []).reduce((sm, r) => sm + (parseFloat(r.amount) || 0), 0);
  const rev = data?.revenueItems || [{ name: "", amount: "" }];
  const cog = data?.cogsItems || [{ name: "", amount: "" }];
  const opex = data?.operatingExpenses || [{ name: "", amount: "" }];
  const ci = data?.cashInflowItems || [{ category: "", monthly: [] }];
  const co = data?.cashOutflowItems || [{ category: "", monthly: [] }];
  const ba = data?.balanceAssets || [{ name: "", amount: "" }];
  const bl = data?.balanceLiabilities || [{ name: "", amount: "" }];
  const be = data?.balanceEquity || [{ name: "", amount: "" }];
  const fc = data?.fixedCostItems || [{ name: "", amount: "" }];
  const vc = data?.variableCostItems || [{ name: "", amount: "" }];
  const uoc = data?.useOfCapitalItems || [{ description: "", amount: "" }];

  const mkH = (fld, starter) => ({
    add: () => { const l = data?.[fld] || [{ ...starter }]; hc(fld, [...l, { ...starter }]); },
    update: (i, u) => { const l = data?.[fld] || []; hc(fld, l.map((r, j) => j === i ? u : r)); },
    remove: (i) => { const l = data?.[fld] || []; const n = l.filter((_, j) => j !== i); hc(fld, n.length ? n : [{ ...starter }]); },
  });
  const rh = mkH("revenueItems", { name: "", amount: "" });
  const ch = mkH("cogsItems", { name: "", amount: "" });
  const oh = mkH("operatingExpenses", { name: "", amount: "" });
  const bah = mkH("balanceAssets", { name: "", amount: "" });
  const blh = mkH("balanceLiabilities", { name: "", amount: "" });
  const beh = mkH("balanceEquity", { name: "", amount: "" });
  const fch = mkH("fixedCostItems", { name: "", amount: "" });
  const vch = mkH("variableCostItems", { name: "", amount: "" });
  const uoh = mkH("useOfCapitalItems", { description: "", amount: "" });

  const cfi = {
    add: () => { const l = data?.cashInflowItems || [{ category: "", monthly: [] }]; hc("cashInflowItems", [...l, { category: "", monthly: [] }]); },
    update: (i, u) => { const l = data?.cashInflowItems || []; hc("cashInflowItems", l.map((r, j) => j === i ? u : r)); },
    remove: (i) => { const l = data?.cashInflowItems || []; const n = l.filter((_, j) => j !== i); hc("cashInflowItems", n.length ? n : [{ category: "", monthly: [] }]); },
  };
  const cfo = {
    add: () => { const l = data?.cashOutflowItems || [{ category: "", monthly: [] }]; hc("cashOutflowItems", [...l, { category: "", monthly: [] }]); },
    update: (i, u) => { const l = data?.cashOutflowItems || []; hc("cashOutflowItems", l.map((r, j) => j === i ? u : r)); },
    remove: (i) => { const l = data?.cashOutflowItems || []; const n = l.filter((_, j) => j !== i); hc("cashOutflowItems", n.length ? n : [{ category: "", monthly: [] }]); },
  };

  return (
    <div style={s.c}>
      <h1 style={s.h1}>Financial Plan</h1>
      <p style={s.sub}>Your financial plan is the most closely scrutinized part of your business plan. Lenders and investors will study it carefully &mdash; not just to see the numbers, but to assess whether your thinking is sound and your projections are grounded in reality. A well-constructed financial plan also helps you set clear goals, anticipate funding needs, and make smarter decisions as your business grows.</p>

      {/* 1. 12-MONTH PROFIT & LOSS */}
      <div style={s.sg}>
        <h2 style={s.gt}>1. 12-Month Profit &amp; Loss Projection</h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>The P&amp;L (income statement) is the centerpiece of your financial plan. Enter projected sales, COGS, gross profit, operating expenses, net profit before tax, tax liability, and net operating income. Explain the assumptions behind every number.</p>

        <h3 style={s.sgt}>Projected Revenue (Sales)</h3>
        <p style={{...s.hn, marginBottom: 8}}>Draw on the Sales Forecast from Section IV. List each revenue stream.</p>
        {rev.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={rh.update} onRemove={rh.remove} np="e.g. Product sales, services, subscriptions" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={rh.add}>+ Add Revenue Stream</button></div>
        <div style={s.tl}>Total Revenue: ${sa(rev).toFixed(2)}</div>

        <h3 style={s.sgt}>Cost of Goods Sold</h3>
        <p style={{...s.hn, marginBottom: 8}}>Direct costs of producing goods or services.</p>
        {cog.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={ch.update} onRemove={ch.remove} np="e.g. Materials, direct labor, shipping" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={ch.add}>+ Add COGS Item</button></div>
        <div style={s.tl}>Total COGS: ${sa(cog).toFixed(2)}</div>

        {(() => { const rv = sa(rev); const cg = sa(cog); return (<div style={{display: "flex", justifyContent: "flex-end", gap: 24, marginBottom: 16}}><div style={{fontSize: 15, fontWeight: 600, color: "#1a1a2e"}}>Gross Profit: ${(rv - cg).toFixed(2)}</div><div style={{fontSize: 14, color: "#555"}}>Margin: {rv > 0 ? ((rv - cg) / rv * 100).toFixed(1) + "%" : "\u2014"}</div></div>); })()}

        <h3 style={s.sgt}>Operating Expenses</h3>
        <p style={{...s.hn, marginBottom: 8}}>Rent, marketing, payroll, utilities, etc.</p>
        {opex.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={oh.update} onRemove={oh.remove} np="e.g. Rent, Marketing, Payroll" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={oh.add}>+ Add Operating Expense</button></div>
        <div style={s.tl}>Total OpEx: ${sa(opex).toFixed(2)}</div>

        {(() => { const netST = sa(rev) - sa(cog) - sa(opex); return <div style={{fontSize: 15, fontWeight: 700, color: netST >= 0 ? "#2e7d32" : "#c62828", textAlign: "right", padding: "8px 12px", borderTop: "2px solid #ccc", marginTop: 4}}>Net Profit Before Tax: ${netST.toFixed(2)}</div>; })()}

        <Input label="Estimated Tax Liability ($)" hint="Estimate income tax on projected profit. Consult a tax professional." field="estimatedTaxLiability" type="number" value={data?.estimatedTaxLiability} onChange={hc} />

        {(() => { const tax = parseFloat(data?.estimatedTaxLiability) || 0; const noi = sa(rev) - sa(cog) - sa(opex) - tax; return <div style={{fontSize: 16, fontWeight: 700, color: noi >= 0 ? "#2e7d32" : "#c62828", textAlign: "right", padding: "12px", border: "2px solid", borderColor: noi >= 0 ? "#2e7d32" : "#c62828", borderRadius: 6, marginTop: 8}}>Net Operating Income: ${noi.toFixed(2)}</div>; })()}

        <Tx label="P&amp;L Assumptions &amp; Notes" hint="Explain the assumptions behind your revenue projections and cost estimates. When you sit down with a lender or investor, these are exactly the questions they will ask." field="pnlAssumptions" tall value={data?.pnlAssumptions} onChange={hc} />
      </div>

      {/* 2. 3-YEAR P&L (optional) */}
      <div style={s.sg}>
        <h2 style={s.gt}>2. Three-Year P&amp;L Projection <span style={{fontSize: 13, fontWeight: 400, color: "#888"}}>(optional)</span></h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>Include if financials are expected to change significantly after year one &mdash; from expansion, hiring, or new products. Some lenders will ask for this.</p>
        <div style={s.g3}>
          <Input label="Y2 Revenue ($)" field="threeYearRevenueY2" type="number" value={data?.threeYearRevenueY2} onChange={hc} />
          <Input label="Y2 Expenses ($)" field="threeYearExpensesY2" type="number" value={data?.threeYearExpensesY2} onChange={hc} />
          <Input label="Y2 Net Profit ($)" field="threeYearNetProfitY2" type="number" value={data?.threeYearNetProfitY2} onChange={hc} />
          <Input label="Y3 Revenue ($)" field="threeYearRevenueY3" type="number" value={data?.threeYearRevenueY3} onChange={hc} />
          <Input label="Y3 Expenses ($)" field="threeYearExpensesY3" type="number" value={data?.threeYearExpensesY3} onChange={hc} />
          <Input label="Y3 Net Profit ($)" field="threeYearNetProfitY3" type="number" value={data?.threeYearNetProfitY3} onChange={hc} />
        </div>
        <Tx label="3-Year P&amp;L Context" hint="Explain expected changes &mdash; expansion, hiring, new products." field="threeYearPnLNotes" tall value={data?.threeYearPnLNotes} onChange={hc} />
      </div>

      {/* 3. 12-MONTH CASH FLOW */}
      <div style={s.sg}>
        <h2 style={s.gt}>3. 12-Month Cash Flow Projection</h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>Profit and cash flow are not the same thing. Your cash flow projection tracks actual money movement &mdash; when you pay expenses and when you receive payment. It accounts for timing gaps and helps avoid running out of money even when business is going well.</p>
        <h3 style={s.sgt}>Cash Inflows</h3>
        <p style={{...s.hn, marginBottom: 8}}>Money coming in: cash sales, credit collections, loan proceeds, investments, etc.</p>
        {ci.map((r, i) => <CFItem key={i} row={r} index={i} onUpdate={cfi.update} onRemove={cfi.remove} />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={cfi.add}>+ Add Inflow Category</button></div>
        <h3 style={{...s.sgt, marginTop: 24}}>Cash Outflows</h3>
        <p style={{...s.hn, marginBottom: 8}}>Money going out: inventory, rent, payroll, loan payments, etc.</p>
        {co.map((r, i) => <CFItem key={i} row={r} index={i} onUpdate={cfo.update} onRemove={cfo.remove} />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={cfo.add}>+ Add Outflow Category</button></div>
        <Input label="Beginning Cash Balance ($)" hint="Cash on hand at the start of the projection period." field="beginningCashBalance" type="number" value={data?.beginningCashBalance} onChange={hc} />
        <Tx label="Cash Flow Assumptions &amp; Notes" hint="Explain timing assumptions &mdash; payment terms, seasonal patterns, collection periods." field="cashFlowAssumptions" tall value={data?.cashFlowAssumptions} onChange={hc} />
      </div>

      {/* 4. 3-YEAR CASH FLOW (optional) */}
      <div style={s.sg}>
        <h2 style={s.gt}>4. Three-Year Cash Flow Statement <span style={{fontSize: 13, fontWeight: 400, color: "#888"}}>(optional)</span></h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>Include if a longer-term view is needed or if investors/lenders request it. This is a simpler document than the monthly projection, useful for demonstrating how cash position evolves.</p>
        <div style={s.g3}>
          <Input label="Y1 Net Cash Flow ($)" field="threeYearCashY1" type="number" value={data?.threeYearCashY1} onChange={hc} />
          <Input label="Y2 Net Cash Flow ($)" field="threeYearCashY2" type="number" value={data?.threeYearCashY2} onChange={hc} />
          <Input label="Y3 Net Cash Flow ($)" field="threeYearCashY3" type="number" value={data?.threeYearCashY3} onChange={hc} />
          <Input label="Y1 Ending Cash ($)" field="threeYearEndingCashY1" type="number" value={data?.threeYearEndingCashY1} onChange={hc} />
          <Input label="Y2 Ending Cash ($)" field="threeYearEndingCashY2" type="number" value={data?.threeYearEndingCashY2} onChange={hc} />
          <Input label="Y3 Ending Cash ($)" field="threeYearEndingCashY3" type="number" value={data?.threeYearEndingCashY3} onChange={hc} />
        </div>
        <Tx label="3-Year Cash Flow Notes" hint="Describe how your cash position is expected to evolve as the business matures." field="threeYearCashFlowNotes" tall value={data?.threeYearCashFlowNotes} onChange={hc} />
      </div>

      {/* 5. PROJECTED BALANCE SHEET */}
      <div style={s.sg}>
        <h2 style={s.gt}>5. Projected Balance Sheet (End of Year One)</h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>Shows the financial position of your business at a specific point in time &mdash; your assets, liabilities, and owner&#8217;s equity reflecting year one operations. Many lenders and investors want to see this documented.</p>
        <h3 style={s.sgt}>Assets</h3>
        <p style={{...s.hn, marginBottom: 8}}>What the business owns: cash, AR, equipment, inventory, etc.</p>
        {ba.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={bah.update} onRemove={bah.remove} np="e.g. Cash, AR, Equipment, Inventory" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={bah.add}>+ Add Asset</button></div>
        <div style={s.tl}>Total Assets: ${sa(ba).toFixed(2)}</div>

        <h3 style={s.sgt}>Liabilities</h3>
        <p style={{...s.hn, marginBottom: 8}}>What the business owes: AP, loans payable, other debts.</p>
        {bl.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={blh.update} onRemove={blh.remove} np="e.g. AP, Loans Payable" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={blh.add}>+ Add Liability</button></div>
        <div style={s.tl}>Total Liabilities: ${sa(bl).toFixed(2)}</div>

        <h3 style={s.sgt}>Owner&#8217;s Equity</h3>
        <p style={{...s.hn, marginBottom: 8}}>Owner&#8217;s investment plus retained earnings (or minus losses).</p>
        {be.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={beh.update} onRemove={beh.remove} np="e.g. Owner investment, Retained earnings" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={beh.add}>+ Add Equity Item</button></div>
        <div style={s.tl}>Total Equity: ${sa(be).toFixed(2)}</div>

        {(() => { const a = sa(ba); const l = sa(bl); const e = sa(be); const c = a - l; const ok = Math.abs(c - e) < 0.01; return (<div style={{marginTop: 12, padding: 12, borderRadius: 6, backgroundColor: "#f5f5f5", border: "1px solid #ddd"}}><div style={{fontSize: 14, fontWeight: 600, marginBottom: 6}}>Balance Sheet Check</div><div style={{fontSize: 13, lineHeight: 1.6}}>Total Assets: ${a.toFixed(2)}<br/>Total Liabilities: ${l.toFixed(2)}<br/><strong>Calc. Equity (A-L): ${c.toFixed(2)}</strong><br/><strong>Entered Equity: ${e.toFixed(2)}</strong><br/><span style={{color: ok ? "#2e7d32" : "#c62828", fontWeight: 600}}>{ok ? "&#x2713; In balance." : "&#x2717; Out of balance."}</span></div></div>); })()}

        <Tx label="Balance Sheet Notes" hint="Explain significant changes from your opening-day balance sheet (Section VII)." field="balanceSheetNotes" tall value={data?.balanceSheetNotes} onChange={hc} />
      </div>

      {/* 6. BREAK-EVEN ANALYSIS */}
      <div style={s.sg}>
        <h2 style={s.gt}>6. Break-Even Analysis</h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>Identifies the sales volume needed to cover all costs &mdash; the point where the business stops losing money and starts generating profit. Consider running more than one scenario to find the most financially sound path forward.</p>
        <h3 style={s.sgt}>Fixed Costs (monthly)</h3>
        <p style={{...s.hn, marginBottom: 8}}>Costs constant regardless of sales volume: rent, salaries, insurance, etc.</p>
        {fc.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={fch.update} onRemove={fch.remove} np="e.g. Rent, Salaries, Insurance" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={fch.add}>+ Add Fixed Cost</button></div>
        <div style={s.tl}>Total Fixed Costs: ${sa(fc).toFixed(2)}</div>

        <h3 style={s.sgt}>Variable Costs (per unit)</h3>
        <p style={{...s.hn, marginBottom: 8}}>Costs varying with volume: materials, direct labor, commissions, etc.</p>
        {vc.map((r, i) => <CRow key={i} item={r} index={i} onUpdate={vch.update} onRemove={vch.remove} np="e.g. Materials, Direct labor, Commissions" ap="0.00" />)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={vch.add}>+ Add Variable Cost</button></div>
        <div style={s.tl}>Total Variable Cost/Unit: ${sa(vc).toFixed(2)}</div>

        <Input label="Average Unit Price / Revenue per Sale ($)" hint="The average amount expected per unit sold or customer transaction." field="avgUnitPrice" type="number" value={data?.avgUnitPrice} onChange={hc} />

        {(() => { const ft = sa(fc); const vt = sa(vc); const up = parseFloat(data?.avgUnitPrice) || 0; const beu = up > 0 ? Math.ceil(ft / (up - (vt || 0.01))) : "—"; const valid = up > 0 && vt < up; return (<div style={{marginTop: 16, padding: 16, borderRadius: 6, backgroundColor: "#f0f8f0", border: "2px solid #a5d6a7"}}><div style={{fontSize: 16, fontWeight: 700, color: "#2e7d32", marginBottom: 8}}>Break-Even Calculation</div>{valid ? <div style={{fontSize: 14, color: "#333", lineHeight: 1.8}}>Fixed Costs/mo: ${ft.toFixed(2)}<br/>Variable Cost/Unit: ${vt.toFixed(2)}<br/>Contribution Margin: ${(up - vt).toFixed(2)}<br/>Break-Even (units/mo): {beu} units<br/>Break-Even Revenue/mo: ${(beu * up).toFixed(2)}</div> : <div style={{fontSize: 14, color: "#c62828"}}>Enter a unit price greater than variable cost to calculate.</div>}</div>); })()}

        <Tx label="Break-Even Assumptions &amp; Scenarios" hint="Model different scenarios &mdash; staffing models, pricing tiers, cost structures." field="breakEvenNotes" tall value={data?.breakEvenNotes} onChange={hc} />
      </div>

      {/* 7. USE OF CAPITAL */}
      <div style={s.sg}>
        <h2 style={s.gt}>7. Use of Capital</h2>
        <p style={{...s.sub, margin: "0 0 12px 0"}}>If seeking financing, be explicit about how you will use the funds and what outcomes you expect. Lenders and investors want to see a clear connection between the money they provide and the results you are projecting.</p>

        <Input label="Total Capital Requested ($)" hint="Total financing sought from lenders or investors." field="totalCapitalRequested" type="number" value={data?.totalCapitalRequested} onChange={hc} />

        <h3 style={s.sgt}>How the Funds Will Be Used</h3>
        <p style={{...s.hn, marginBottom: 8}}>Be specific: what will the money buy, what will it enable, and how will it affect revenue or production capacity?</p>
        {uoc.map((r, i) => <div key={i} style={{display: "grid", gridTemplateColumns: "1fr 180px 36px", gap: 12, alignItems: "end", marginBottom: 12, padding: 12, backgroundColor: "#fafafa", borderRadius: 6, border: "1px solid #eee"}}><div style={{display: "flex", flexDirection: "column", gap: 4}}><span style={s.mh}>Use of Funds</span><input style={s.inp} type="text" value={r.description ?? ""} onChange={e => uoh.update(i, { ...r, description: e.target.value })} placeholder="e.g. Equipment, marketing, hiring" onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div><div style={{display: "flex", flexDirection: "column", gap: 4}}><span style={s.mh}>Amount ($)</span><input style={s.num} type="number" min="0" step="0.01" value={r.amount ?? ""} onChange={e => uoh.update(i, { ...r, amount: e.target.value })} placeholder="0.00" onFocus={e => e.target.style.borderColor = "#4a90d9"} onBlur={e => e.target.style.borderColor = "#ccc"} /></div>{i > 0 && <button type="button" style={{ ...s.rb, marginBottom: 4, alignSelf: "end" }} onClick={() => uoh.remove(i)}>&#x2715;</button>}{i === 0 && <div />}</div>)}
        <div style={{textAlign: "left"}}><button type="button" style={s.ab} onClick={uoh.add}>+ Add Item</button></div>
        <div style={s.tl}>Total Allocated: ${sa(uoc).toFixed(2)}</div>

        <Tx label="Expected Outcomes" hint="What specific results do you expect &mdash; increased revenue, expanded capacity, new product lines?" field="capitalExpectedOutcomes" tall value={data?.capitalExpectedOutcomes} onChange={hc} />

        <Tx label="Additional Financial Notes" hint="Any other context that helps readers understand your financial plan &mdash; contingent liabilities, seasonal considerations, insurance, tax strategies, etc." field="financialNotes" tall value={data?.financialNotes} onChange={hc} />
      </div>
    </div>
  );
}
