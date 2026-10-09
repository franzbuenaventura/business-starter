import { Button } from '@heroui/react'
import { SectionPage, Group, Field, Row, SubTitle } from '../components/Fields.jsx'

const inputCls = 'w-full px-2.5 py-1.5 rounded-lg bg-content1 border border-divider text-sm outline-none focus:border-primary'
const numberCls = 'w-full px-2.5 py-1.5 rounded-lg bg-content1 border border-divider text-sm text-right outline-none focus:border-primary'
const itemLabel = 'text-[11px] font-medium text-foreground-500 mb-1'
const totalCls = 'text-sm font-semibold text-foreground text-right px-3 py-2 border-t border-divider mt-1'

export default function SectionVII({ data, onChange }) {
  const set = (field, value) => onChange && onChange({ ...(data || {}), [field]: value })

  const expenses = data?.expenses || [{ description: '', source: '', amount: '' }]
  const loans = data?.loans || [{ source: '', amount: '', terms: '' }]
  const investors = data?.investors || [{ name: '', contribution: '', ownershipPercent: '' }]

  const addExpense = () => set('expenses', [...expenses, { description: '', source: '', amount: '' }])
  const updateExpense = (index, updatedExpense) => set('expenses', expenses.map((e, i) => (i === index ? updatedExpense : e)))
  const removeExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index)
    set('expenses', updated.length ? updated : [{ description: '', source: '', amount: '' }])
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const contingencyAmount = totalExpenses * 0.20 // 20% minimum reserve
  const totalWithContingency = totalExpenses + contingencyAmount

  const addLoan = () => set('loans', [...loans, { source: '', amount: '', terms: '' }])
  const updateLoan = (index, updatedLoan) => set('loans', loans.map((l, i) => (i === index ? updatedLoan : l)))
  const removeLoan = (index) => {
    const updated = loans.filter((_, i) => i !== index)
    set('loans', updated.length ? updated : [{ source: '', amount: '', terms: '' }])
  }

  const addInvestor = () => set('investors', [...investors, { name: '', contribution: '', ownershipPercent: '' }])
  const updateInvestor = (index, updatedInvestor) => set('investors', investors.map((inv, i) => (i === index ? updatedInvestor : inv)))
  const removeInvestor = (index) => {
    const updated = investors.filter((_, i) => i !== index)
    set('investors', updated.length ? updated : [{ name: '', contribution: '', ownershipPercent: '' }])
  }

  return (
    <SectionPage title="Startup Expenses & Capitalization" intro="Detail the one-time costs to get your business up and running, and explain where the capital to cover those costs will come from. Be as specific and accurate as possible. Underestimating startup costs is one of the most common — and most damaging — mistakes new business owners make.">
      {/* ============ 1. STARTUP EXPENSES ============ */}
      <Group title="Startup Expenses">
        <Field
          label="Explanation & Context"
          hint="Don't just list numbers — explain the thinking behind them. Where did each figure come from? Did you get vendor quotes, research industry benchmarks, or consult with other business owners? Documented assumptions are far more credible than unsupported estimates."
          value={data?.startupExpensesExplanation}
          onChange={v => set('startupExpensesExplanation', v)}
          tall
        />

        <div className="text-sm font-medium text-foreground mb-1">Expense Line Items</div>
        <div className="text-xs text-foreground-500 mb-3">List each one-time startup expense with its amount and source/basis.</div>

        {expenses.map((expense, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end mb-3 p-3 rounded-xl border border-divider bg-content2">
            <div>
              <div className={itemLabel}>Expense Description</div>
              <input className={inputCls} type="text" value={expense.description || ''}
                onChange={e => updateExpense(index, { ...expense, description: e.target.value })}
                placeholder="e.g. Equipment, legal fees, marketing materials" />
              <input className={`${inputCls} mt-2 text-xs`} type="text" value={expense.source || ''}
                onChange={e => updateExpense(index, { ...expense, source: e.target.value })}
                placeholder="Source / basis (vendor quote, industry benchmark, etc.)" />
            </div>
            <div>
              <div className={itemLabel}>Amount ($)</div>
              <input className={numberCls} type="number" min="0" step="0.01" value={expense.amount || ''}
                onChange={e => updateExpense(index, { ...expense, amount: e.target.value })}
                placeholder="0.00" />
            </div>
            {index > 0 && (
              <Button isIconOnly size="sm" variant="light" radius="full" aria-label="Remove expense"
                className="text-foreground-500 hover:text-danger" onPress={() => removeExpense(index)}>
                ✕
              </Button>
            )}
          </div>
        ))}

        <Button size="sm" variant="bordered" color="primary" className="mb-4" onPress={addExpense}>+ Add Expense Item</Button>

        <div className={totalCls}>Total Startup Expenses: ${totalExpenses.toFixed(2)}</div>
        <div className={totalCls}>Suggested Reserve for Contingencies (20%): ${contingencyAmount.toFixed(2)}</div>
        <div className="text-base font-bold text-foreground text-right px-3 py-3 border-y-2 border-divider mt-2">
          Total Capital Needed: ${totalWithContingency.toFixed(2)}
        </div>

        <div className="mt-6">
          <Field
            label="Reserve for Contingencies (custom amount)"
            hint="The template recommends 20-25% of total estimated startup costs. Enter a custom amount if different from the suggested 20%."
            type="number" min="0" step="0.01"
            value={data?.contingencyReserve}
            onChange={v => set('contingencyReserve', v)}
          />
        </div>

        {/* Loans */}
        <SubTitle>Financing — Loans</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">
          If you are financing the business with loans, describe each one: the source, the amount, and the terms (interest rate, repayment period, collateral).
        </div>

        {loans.map((loan, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end mb-3 p-3 rounded-xl border border-divider bg-content2">
            <div>
              <div className={itemLabel}>Loan Source</div>
              <input className={inputCls} type="text" value={loan.source || ''}
                onChange={e => updateLoan(index, { ...loan, source: e.target.value })}
                placeholder="e.g. Bank of America, SBA" />
              <input className={`${inputCls} mt-2 text-xs`} type="text" value={loan.terms || ''}
                onChange={e => updateLoan(index, { ...loan, terms: e.target.value })}
                placeholder="Terms (rate, repayment period, collateral)" />
            </div>
            <div>
              <div className={itemLabel}>Amount ($)</div>
              <input className={numberCls} type="number" min="0" step="0.01" value={loan.amount || ''}
                onChange={e => updateLoan(index, { ...loan, amount: e.target.value })}
                placeholder="0.00" />
            </div>
            {index > 0 && (
              <Button isIconOnly size="sm" variant="light" radius="full" aria-label="Remove loan"
                className="text-foreground-500 hover:text-danger" onPress={() => removeLoan(index)}>
                ✕
              </Button>
            )}
          </div>
        ))}

        <Button size="sm" variant="bordered" color="primary" className="mb-4" onPress={addLoan}>+ Add Loan</Button>

        <Field
          label="Total Loan Financing"
          hint="Sum of all loan amounts."
          type="number" min="0" step="0.01"
          value={data?.totalLoanFinancing}
          onChange={v => set('totalLoanFinancing', v)}
        />

        {/* Investors */}
        <SubTitle>Financing — Investor Contributions</SubTitle>
        <div className="text-xs text-foreground-500 mb-3">
          If you have investors, specify how much each person is contributing and what ownership percentage they'll receive in return.
        </div>

        {investors.map((investor, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end mb-3 p-3 rounded-xl border border-divider bg-content2">
            <div>
              <div className={itemLabel}>Investor Name</div>
              <input className={inputCls} type="text" value={investor.name || ''}
                onChange={e => updateInvestor(index, { ...investor, name: e.target.value })}
                placeholder="Full name" />
            </div>
            <div>
              <div className={itemLabel}>Contribution ($)</div>
              <input className={numberCls} type="number" min="0" step="0.01" value={investor.contribution || ''}
                onChange={e => updateInvestor(index, { ...investor, contribution: e.target.value })}
                placeholder="0.00" />
            </div>
            <div>
              <div className={itemLabel}>Ownership %</div>
              <input className={numberCls} type="number" min="0" max="100" step="0.1" value={investor.ownershipPercent || ''}
                onChange={e => updateInvestor(index, { ...investor, ownershipPercent: e.target.value })}
                placeholder="0.0" />
            </div>
            {index > 0 && (
              <Button isIconOnly size="sm" variant="light" radius="full" aria-label="Remove investor"
                className="text-foreground-500 hover:text-danger" onPress={() => removeInvestor(index)}>
                ✕
              </Button>
            )}
          </div>
        ))}

        <Button size="sm" variant="bordered" color="primary" className="mb-4" onPress={addInvestor}>+ Add Investor</Button>

        <Field
          label="Total Investor Financing"
          hint="Sum of all investor contributions."
          type="number" min="0" step="0.01"
          value={data?.totalInvestorFinancing}
          onChange={v => set('totalInvestorFinancing', v)}
        />
      </Group>

      {/* ============ 2. OPENING DAY BALANCE SHEET ============ */}
      <Group title="Opening Day Balance Sheet" hint="Capture the expected financial position of your business on the day you open — your assets, liabilities, and equity at the starting line. A well-prepared opening day balance sheet tells investors and lenders that you understand your financial position from day one.">
        <SubTitle>Assets</SubTitle>
        <Row>
          <Field label="Cash on Hand ($)" type="number" min="0" step="0.01" value={data?.balanceCashOnHand} onChange={v => set('balanceCashOnHand', v)} />
          <Field label="Accounts Receivable ($)" type="number" min="0" step="0.01" value={data?.balanceAccountsReceivable} onChange={v => set('balanceAccountsReceivable', v)} />
          <Field label="Equipment ($)" type="number" min="0" step="0.01" value={data?.balanceEquipment} onChange={v => set('balanceEquipment', v)} />
          <Field label="Inventory ($)" type="number" min="0" step="0.01" value={data?.balanceInventory} onChange={v => set('balanceInventory', v)} />
          <Field label="Furniture & Fixtures ($)" type="number" min="0" step="0.01" value={data?.balanceFurnitureFixtures} onChange={v => set('balanceFurnitureFixtures', v)} />
          <Field label="Other Assets ($)" type="number" min="0" step="0.01" value={data?.balanceOtherAssets} onChange={v => set('balanceOtherAssets', v)} />
        </Row>

        <SubTitle>Liabilities</SubTitle>
        <Row>
          <Field label="Accounts Payable ($)" type="number" min="0" step="0.01" value={data?.balanceAccountsPayable} onChange={v => set('balanceAccountsPayable', v)} />
          <Field label="Loans Payable ($)" type="number" min="0" step="0.01" value={data?.balanceLoansPayable} onChange={v => set('balanceLoansPayable', v)} />
          <Field label="Other Liabilities ($)" type="number" min="0" step="0.01" value={data?.balanceOtherLiabilities} onChange={v => set('balanceOtherLiabilities', v)} />
        </Row>

        <SubTitle>Equity</SubTitle>
        <Row>
          <Field label="Owner's Investment ($)" type="number" min="0" step="0.01" value={data?.balanceOwnersInvestment} onChange={v => set('balanceOwnersInvestment', v)} />
          <Field label="Retained Earnings ($)" type="number" min="0" step="0.01" value={data?.balanceRetainedEarnings} onChange={v => set('balanceRetainedEarnings', v)} />
        </Row>
      </Group>

      {/* ============ 3. PERSONAL FINANCIAL STATEMENT ============ */}
      <Group title="Personal Financial Statement" hint="If you're using this business plan to seek financing, include a personal financial statement for each owner and major stockholder. This summarizes each person's personal assets, liabilities, and net worth outside of the business.">
        <div className="text-sm font-medium text-foreground mb-1">Personal Financial Statement Details</div>
        <div className="text-xs text-foreground-500 mb-4">
          Investors and lenders typically expect business owners to have personal skin in the game. Describe the personal capital each owner is able to bring to the table.
        </div>
        <Field
          label="Owner 1 — Summary"
          hint="Personal assets, liabilities, net worth, and capital contribution."
          value={data?.personalFinancialOwner1}
          onChange={v => set('personalFinancialOwner1', v)}
          tall
        />
        <Field
          label="Owner 2 — Summary"
          hint="Personal assets, liabilities, net worth, and capital contribution."
          value={data?.personalFinancialOwner2}
          onChange={v => set('personalFinancialOwner2', v)}
          tall
        />
        <Field
          label="Total Personal Capital Invested ($)"
          hint="Sum of all personal funds owners are contributing to startup costs."
          type="number" min="0" step="0.01"
          value={data?.totalPersonalCapital}
          onChange={v => set('totalPersonalCapital', v)}
        />
        <Field
          label="Additional Notes on Capitalization"
          hint="Add any additional context about your overall funding plan, reserve strategy, or financial readiness."
          value={data?.capitalizationNotes}
          onChange={v => set('capitalizationNotes', v)}
          tall
        />
      </Group>
    </SectionPage>
  )
}