import { useCallback } from "react";

const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 800,
    margin: "0 auto",
    padding: "24px 16px",
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    margin: "0 0 4px 0",
    color: "#1a1a2e",
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    margin: "0 0 24px 0",
    lineHeight: 1.5,
  },
  sectionGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#1a1a2e",
    margin: "0 0 12px 0",
    paddingBottom: 6,
    borderBottom: "2px solid #e0e0e0",
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    color: "#333",
    marginBottom: 6,
  },
  hint: {
    display: "block",
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #ccc",
    borderRadius: 6,
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: 1.4,
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  numberInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #ccc",
    borderRadius: 6,
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: 1.4,
    outline: "none",
    transition: "border-color 0.15s ease",
    textAlign: "right",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #ccc",
    borderRadius: 6,
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: 1.5,
    resize: "vertical",
    minHeight: 80,
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  textareaTall: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 15,
    border: "1px solid #ccc",
    borderRadius: 6,
    boxSizing: "border-box",
    fontFamily: "inherit",
    lineHeight: 1.5,
    resize: "vertical",
    minHeight: 120,
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  expenseRow: {
    display: "grid",
    gridTemplateColumns: "1fr 180px",
    gap: 12,
    alignItems: "end",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    border: "1px solid #eee",
  },
  addButton: {
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#4a90d9",
    background: "none",
    border: "1px dashed #4a90d9",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
  },
  removeButton: {
    padding: "4px 10px",
    fontSize: 12,
    fontWeight: 600,
    color: "#d32f2f",
    background: "none",
    border: "1px solid #d32f2f",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  expenseItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  totalLine: {
    fontSize: 14,
    fontWeight: 600,
    color: "#1a1a2e",
    textAlign: "right",
    padding: "8px 12px",
    borderTop: "1px solid #ccc",
    marginTop: 4,
  },
};

function Input({ label, hint, value, onChange, field, type = "text", placeholder }) {
  const handleChange = useCallback(
    (e) => {
      onChange(field, e.target.value);
    },
    [onChange, field]
  );

  const inputStyle = type === "number" ? styles.numberInput : styles.input;

  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      <input
        style={inputStyle}
        type={type}
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder || ""}
        onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
}

function Textarea({ label, hint, value, onChange, field, tall, rows }) {
  const handleChange = useCallback(
    (e) => {
      onChange(field, e.target.value);
    },
    [onChange, field]
  );

  const inputStyle = tall ? styles.textareaTall : styles.textarea;

  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      <textarea
        style={inputStyle}
        value={value || ""}
        onChange={handleChange}
        rows={rows || 3}
        onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
}

function ExpenseItem({
  expense,
  index,
  onUpdate,
  onRemove,
}) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...expense, [field]: value });
  };

  return (
    <div style={styles.expenseRow}>
      <div style={styles.expenseItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Expense Description
        </label>
        <input
          style={styles.input}
          type="text"
          value={expense.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="e.g. Equipment, legal fees, marketing materials"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <input
          style={{ ...styles.input, marginTop: 4, fontSize: 12 }}
          type="text"
          value={expense.source || ""}
          onChange={(e) => handleChange("source", e.target.value)}
          placeholder="Source / basis (vendor quote, industry benchmark, etc.)"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      </div>
      <div style={styles.expenseItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Amount ($)
        </label>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            style={styles.numberInput}
            type="number"
            min="0"
            step="0.01"
            value={expense.amount || ""}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0.00"
            onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          {index > 0 && (
            <button
              type="button"
              style={styles.removeButton}
              onClick={() => onRemove(index)}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoanItem({
  loan,
  index,
  onUpdate,
  onRemove,
}) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...loan, [field]: value });
  };

  return (
    <div style={styles.expenseRow}>
      <div style={styles.expenseItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Loan Source
        </label>
        <input
          style={styles.input}
          type="text"
          value={loan.source || ""}
          onChange={(e) => handleChange("source", e.target.value)}
          placeholder="e.g. Bank of America, SBA"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <input
          style={{ ...styles.input, marginTop: 4, fontSize: 12 }}
          type="text"
          value={loan.terms || ""}
          onChange={(e) => handleChange("terms", e.target.value)}
          placeholder="Terms (rate, repayment period, collateral)"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      </div>
      <div style={styles.expenseItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Amount ($)
        </label>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            style={styles.numberInput}
            type="number"
            min="0"
            step="0.01"
            value={loan.amount || ""}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0.00"
            onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          {index > 0 && (
            <button
              type="button"
              style={styles.removeButton}
              onClick={() => onRemove(index)}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function InvestorItem({
  investor,
  index,
  onUpdate,
  onRemove,
}) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...investor, [field]: value });
  };

  return (
    <div style={styles.expenseRow}>
      <div style={styles.expenseItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Investor Name
        </label>
        <input
          style={styles.input}
          type="text"
          value={investor.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Full name"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "end" }}>
        <div style={styles.expenseItem}>
          <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
            Contribution ($)
          </label>
          <input
            style={styles.numberInput}
            type="number"
            min="0"
            step="0.01"
            value={investor.contribution || ""}
            onChange={(e) => handleChange("contribution", e.target.value)}
            placeholder="0.00"
            onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "end" }}>
          <div style={styles.expenseItem}>
            <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
              Ownership %
            </label>
            <input
              style={styles.numberInput}
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={investor.ownershipPercent || ""}
              onChange={(e) => handleChange("ownershipPercent", e.target.value)}
              placeholder="0.0"
              onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            />
          </div>
          {index > 0 && (
            <button
              type="button"
              style={{ ...styles.removeButton, marginBottom: 10 }}
              onClick={() => onRemove(index)}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SectionVII({ data, onChange }) {
  const handleChange = useCallback(
    (field, value) => {
      onChange({ ...(data || {}), [field]: value });
    },
    [data, onChange]
  );

  const expenses = data?.expenses || [
    { description: "", source: "", amount: "" },
  ];
  const loans = data?.loans || [{ source: "", amount: "", terms: "" }];
  const investors = data?.investors || [{ name: "", contribution: "", ownershipPercent: "" }];

  const addExpense = () => {
    const updated = [...expenses, { description: "", source: "", amount: "" }];
    handleChange("expenses", updated);
  };

  const updateExpense = (index, updatedExpense) => {
    const updated = expenses.map((e, i) => (i === index ? updatedExpense : e));
    handleChange("expenses", updated);
  };

  const removeExpense = (index) => {
    const updated = expenses.filter((_, i) => i !== index);
    handleChange("expenses", updated.length ? updated : [{ description: "", source: "", amount: "" }]);
  };

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + (parseFloat(e.amount) || 0),
    0
  );
  const contingencyAmount = totalExpenses * 0.20; // 20% minimum reserve
  const totalWithContingency = totalExpenses + contingencyAmount;

  const addLoan = () => {
    const updated = [...loans, { source: "", amount: "", terms: "" }];
    handleChange("loans", updated);
  };

  const updateLoan = (index, updatedLoan) => {
    const updated = loans.map((l, i) => (i === index ? updatedLoan : l));
    handleChange("loans", updated);
  };

  const removeLoan = (index) => {
    const updated = loans.filter((_, i) => i !== index);
    handleChange("loans", updated.length ? updated : [{ source: "", amount: "", terms: "" }]);
  };

  const addInvestor = () => {
    const updated = [...investors, { name: "", contribution: "", ownershipPercent: "" }];
    handleChange("investors", updated);
  };

  const updateInvestor = (index, updatedInvestor) => {
    const updated = investors.map((inv, i) => (i === index ? updatedInvestor : inv));
    handleChange("investors", updated);
  };

  const removeInvestor = (index) => {
    const updated = investors.filter((_, i) => i !== index);
    handleChange("investors", updated.length ? updated : [{ name: "", contribution: "", ownershipPercent: "" }]);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Startup Expenses &amp; Capitalization</h1>
      <p style={styles.subheading}>
        Detail the one-time costs to get your business up and running, and explain
        where the capital to cover those costs will come from. Be as specific and
        accurate as possible. Underestimating startup costs is one of the most
        common — and most damaging — mistakes new business owners make.
      </p>

      {/* ============ 1. STARTUP EXPENSES ============ */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Startup Expenses</h2>

        <Textarea
          label="Explanation &amp; Context"
          hint="Don't just list numbers — explain the thinking behind them. Where did each figure come from? Did you get vendor quotes, research industry benchmarks, or consult with other business owners? Documented assumptions are far more credible than unsupported estimates."
          field="startupExpensesExplanation"
          tall
          value={data?.startupExpensesExplanation}
          onChange={handleChange}
        />

        <label style={{ ...styles.label, marginTop: 16 }}>
          Expense Line Items
        </label>
        <span style={styles.hint}>
          List each one-time startup expense with its amount and source/basis.
        </span>

        {expenses.map((expense, index) => (
          <ExpenseItem
            key={index}
            expense={expense}
            index={index}
            onUpdate={updateExpense}
            onRemove={removeExpense}
          />
        ))}

        <div style={{ textAlign: "left" }}>
          <button
            type="button"
            style={styles.addButton}
            onClick={addExpense}
          >
            + Add Expense Item
          </button>
        </div>

        <div style={styles.totalLine}>
          Total Startup Expenses: ${totalExpenses.toFixed(2)}
        </div>
        <div style={styles.totalLine}>
          Suggested Reserve for Contingencies (20%): ${contingencyAmount.toFixed(2)}
        </div>
        <div
          style={{
            ...styles.totalLine,
            fontSize: 16,
            borderTop: "2px solid #1a1a2e",
            borderBottom: "2px solid #1a1a2e",
            padding: "10px 12px",
            marginTop: 8,
          }}
        >
          Total Capital Needed: ${totalWithContingency.toFixed(2)}
        </div>

        <div style={{ marginTop: 16 }}>
          <Input
            label="Reserve for Contingencies (custom amount)"
            hint="The template recommends 20-25% of total estimated startup costs. Enter a custom amount if different from the suggested 20%."
            field="contingencyReserve"
            type="number"
            value={data?.contingencyReserve}
            onChange={handleChange}
          />
        </div>

        {/* Loans */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", margin: "0 0 12px 0" }}>
            Financing — Loans
          </h3>
          <span style={styles.hint}>
            If you are financing the business with loans, describe each one: the source,
            the amount, and the terms (interest rate, repayment period, collateral).
          </span>

          {loans.map((loan, index) => (
            <LoanItem
              key={index}
              loan={loan}
              index={index}
              onUpdate={updateLoan}
              onRemove={removeLoan}
            />
          ))}

          <div style={{ textAlign: "left" }}>
            <button
              type="button"
              style={styles.addButton}
              onClick={addLoan}
            >
              + Add Loan
            </button>
          </div>

          <Input
            label="Total Loan Financing"
            hint="Sum of all loan amounts."
            field="totalLoanFinancing"
            type="number"
            value={data?.totalLoanFinancing}
            onChange={handleChange}
          />
        </div>

        {/* Investors */}
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", margin: "0 0 12px 0" }}>
            Financing — Investor Contributions
          </h3>
          <span style={styles.hint}>
            If you have investors, specify how much each person is contributing and what
            ownership percentage they'll receive in return.
          </span>

          {investors.map((investor, index) => (
            <InvestorItem
              key={index}
              investor={investor}
              index={index}
              onUpdate={updateInvestor}
              onRemove={removeInvestor}
            />
          ))}

          <div style={{ textAlign: "left" }}>
            <button
              type="button"
              style={styles.addButton}
              onClick={addInvestor}
            >
              + Add Investor
            </button>
          </div>

          <Input
            label="Total Investor Financing"
            hint="Sum of all investor contributions."
            field="totalInvestorFinancing"
            type="number"
            value={data?.totalInvestorFinancing}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ============ 2. OPENING DAY BALANCE SHEET ============ */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Opening Day Balance Sheet</h2>
        <p style={{ ...styles.subheading, margin: "0 0 12px 0" }}>
          Capture the expected financial position of your business on the day you open —
          your assets, liabilities, and equity at the starting line. A well-prepared
          opening day balance sheet tells investors and lenders that you understand your
          financial position from day one.
        </p>

        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", margin: "12px 0 8px 0" }}>
          Assets
        </h3>
        <div style={styles.grid2}>
          <Input
            label="Cash on Hand ($)"
            field="balanceCashOnHand"
            type="number"
            value={data?.balanceCashOnHand}
            onChange={handleChange}
          />
          <Input
            label="Accounts Receivable ($)"
            field="balanceAccountsReceivable"
            type="number"
            value={data?.balanceAccountsReceivable}
            onChange={handleChange}
          />
          <Input
            label="Equipment ($)"
            field="balanceEquipment"
            type="number"
            value={data?.balanceEquipment}
            onChange={handleChange}
          />
          <Input
            label="Inventory ($)"
            field="balanceInventory"
            type="number"
            value={data?.balanceInventory}
            onChange={handleChange}
          />
          <Input
            label="Furniture &amp; Fixtures ($)"
            field="balanceFurnitureFixtures"
            type="number"
            value={data?.balanceFurnitureFixtures}
            onChange={handleChange}
          />
          <Input
            label="Other Assets ($)"
            field="balanceOtherAssets"
            type="number"
            value={data?.balanceOtherAssets}
            onChange={handleChange}
          />
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", margin: "12px 0 8px 0" }}>
          Liabilities
        </h3>
        <div style={styles.grid2}>
          <Input
            label="Accounts Payable ($)"
            field="balanceAccountsPayable"
            type="number"
            value={data?.balanceAccountsPayable}
            onChange={handleChange}
          />
          <Input
            label="Loans Payable ($)"
            field="balanceLoansPayable"
            type="number"
            value={data?.balanceLoansPayable}
            onChange={handleChange}
          />
          <Input
            label="Other Liabilities ($)"
            field="balanceOtherLiabilities"
            type="number"
            value={data?.balanceOtherLiabilities}
            onChange={handleChange}
          />
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", margin: "12px 0 8px 0" }}>
          Equity
        </h3>
        <div style={styles.grid2}>
          <Input
            label="Owner's Investment ($)"
            field="balanceOwnersInvestment"
            type="number"
            value={data?.balanceOwnersInvestment}
            onChange={handleChange}
          />
          <Input
            label="Retained Earnings ($)"
            field="balanceRetainedEarnings"
            type="number"
            value={data?.balanceRetainedEarnings}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ============ 3. PERSONAL FINANCIAL STATEMENT ============ */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Personal Financial Statement</h2>
        <p style={{ ...styles.subheading, margin: "0 0 12px 0" }}>
          If you're using this business plan to seek financing, include a personal
          financial statement for each owner and major stockholder. This summarizes each
          person's personal assets, liabilities, and net worth outside of the business.
        </p>

        <label style={{ ...styles.label }}>
          Personal Financial Statement Details
        </label>
        <span style={styles.hint}>
          Investors and lenders typically expect business owners to have personal skin in
          the game. Describe the personal capital each owner is able to bring to the table.
        </span>

        <Textarea
          label="Owner 1 — Summary"
          hint="Personal assets, liabilities, net worth, and capital contribution."
          field="personalFinancialOwner1"
          tall
          value={data?.personalFinancialOwner1}
          onChange={handleChange}
        />

        <Textarea
          label="Owner 2 — Summary"
          hint="Personal assets, liabilities, net worth, and capital contribution."
          field="personalFinancialOwner2"
          tall
          value={data?.personalFinancialOwner2}
          onChange={handleChange}
        />

        <Input
          label="Total Personal Capital Invested ($)"
          hint="Sum of all personal funds owners are contributing to startup costs."
          field="totalPersonalCapital"
          type="number"
          value={data?.totalPersonalCapital}
          onChange={handleChange}
        />

        <Textarea
          label="Additional Notes on Capitalization"
          hint="Add any additional context about your overall funding plan, reserve strategy, or financial readiness."
          field="capitalizationNotes"
          tall
          value={data?.capitalizationNotes}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}