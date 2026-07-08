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
  },
  sectionGroup: {
    marginBottom: 36,
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
    minHeight: 72,
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  checkboxGroup: {
    marginBottom: 24,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  checkbox: {
    marginTop: 3,
    width: 18,
    height: 18,
    cursor: "pointer",
    accentColor: "#2563eb",
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    lineHeight: 1.4,
    cursor: "pointer",
  },
  note: {
    fontSize: 13,
    color: "#555",
    backgroundColor: "#f5f7fa",
    padding: "12px 16px",
    borderRadius: 6,
    margin: "24px 0 0 0",
    lineHeight: 1.5,
    border: "1px solid #e2e8f0",
  },
};

function TextField({ label, hint, value, onChange, field, multiline }) {
  const handleChange = useCallback(
    (e) => {
      onChange({ ...value, [field]: e.target.value });
    },
    [value, onChange, field]
  );
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      {multiline ? (
        <textarea
          style={styles.textarea}
          value={value[field] || ""}
          onChange={handleChange}
        />
      ) : (
        <input
          style={styles.input}
          type="text"
          value={value[field] || ""}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

function CheckboxItem({ label, checked, onChange, field }) {
  const handleChange = useCallback(
    (e) => {
      onChange({ ...checked, [field]: e.target.checked });
    },
    [checked, onChange, field]
  );
  return (
    <div style={styles.checkboxRow}>
      <input
        type="checkbox"
        style={styles.checkbox}
        checked={checked[field] || false}
        onChange={handleChange}
      />
      <label style={styles.checkboxLabel} onClick={() => onChange({ ...checked, [field]: !checked[field] })}>
        {label}
      </label>
    </div>
  );
}

export default function SectionX({ data, onChange }) {
  const d = data || {};

  const set = useCallback(
    (key) => (val) => {
      if (typeof val === "function") {
        onChange({ ...d, [key]: val(d[key]) });
      } else {
        onChange({ ...d, [key]: val });
      }
    },
    [d, onChange]
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Refining the Plan</h1>
      <p style={styles.subheading}>
        Tailor your business plan for your intended audience and business type.
      </p>

      {/* ── Raising Capital from Bankers ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Raising Capital from Bankers</h2>
        <TextField
          label="Borrowing Amount and Use of Funds"
          hint="How much you're borrowing and exactly how you'll use the funds."
          value={d}
          onChange={onChange}
          field="bankers_borrowingAmount"
          multiline
        />
        <TextField
          label="How Investment Will Strengthen the Business"
          hint="Explain how the investment will strengthen the business and its ability to repay."
          value={d}
          onChange={onChange}
          field="bankers_strengthenBusiness"
          multiline
        />
        <TextField
          label="Proposed Repayment Terms"
          hint="Describe your proposed repayment terms."
          value={d}
          onChange={onChange}
          field="bankers_repaymentTerms"
          multiline
        />
        <TextField
          label="Collateral and Existing Liens"
          hint="The collateral you're offering, and a full list of any existing liens against it."
          value={d}
          onChange={onChange}
          field="bankers_collateral"
          multiline
        />
      </div>

      {/* ── Raising Capital from Investors ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Raising Capital from Investors</h2>
        <TextField
          label="Capital Needed Now and in the Future"
          hint="How much money do you need now, and how much additional capital over the next 2-5 years?"
          value={d}
          onChange={onChange}
          field="investors_capitalNeeded"
          multiline
        />
        <TextField
          label="Fund Deployment and Growth Plan"
          hint="How you'll deploy the funds and how that will drive growth."
          value={d}
          onChange={onChange}
          field="investors_fundDeployment"
          multiline
        />
        <TextField
          label="Projected Return on Investment"
          hint="Projected return on investment."
          value={d}
          onChange={onChange}
          field="investors_projectedROI"
          multiline
        />
        <TextField
          label="Exit Strategy"
          hint="Your exit strategy — buyback, acquisition, or IPO."
          value={d}
          onChange={onChange}
          field="investors_exitStrategy"
          multiline
        />
        <TextField
          label="Ownership Percentage Offered"
          hint="The ownership percentage you're offering."
          value={d}
          onChange={onChange}
          field="investors_ownershipPercent"
          multiline
        />
        <TextField
          label="Milestones and Conditions"
          hint="Any milestones or conditions you're prepared to commit to."
          value={d}
          onChange={onChange}
          field="investors_milestones"
          multiline
        />
        <TextField
          label="Financial Reporting for Investors"
          hint="The financial reporting investors will receive."
          value={d}
          onChange={onChange}
          field="investors_financialReporting"
          multiline
        />
        <TextField
          label="Investor Involvement in Governance"
          hint="How involved investors will be in governance or management decisions."
          value={d}
          onChange={onChange}
          field="investors_governanceInvolvement"
          multiline
        />
      </div>

      {/* ── Manufacturing Businesses ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Manufacturing Businesses</h2>
        <TextField
          label="Manufacturing Process"
          hint="Walk through the full manufacturing process from raw materials to finished product."
          value={d}
          onChange={onChange}
          field="mfg_process"
          multiline
        />
        <TextField
          label="Equipment and Production Capacity"
          hint="Describe the equipment you'll use, including production capacity and any limitations."
          value={d}
          onChange={onChange}
          field="mfg_equipment"
          multiline
        />
        <TextField
          label="Physical Plant and Location"
          hint="Where it's located, what deals you have in place, and how much it can produce."
          value={d}
          onChange={onChange}
          field="mfg_plant"
          multiline
        />
        <TextField
          label="Specialized Labor Requirements"
          hint="Identify any specialized labor requirements."
          value={d}
          onChange={onChange}
          field="mfg_labor"
          multiline
        />
        <TextField
          label="Raw Material Sourcing"
          hint="Explain your raw material sourcing and any special storage or handling requirements."
          value={d}
          onChange={onChange}
          field="mfg_rawMaterials"
          multiline
        />
        <TextField
          label="Quality Control Procedures"
          hint="Describe your quality control procedures."
          value={d}
          onChange={onChange}
          field="mfg_qualityControl"
          multiline
        />
        <TextField
          label="Inventory Management"
          hint="Explain how you plan to manage inventory levels throughout the production cycle."
          value={d}
          onChange={onChange}
          field="mfg_inventory"
          multiline
        />
        <TextField
          label="Supply Chain"
          hint="Map out your supply chain, including key suppliers and any dependencies or vulnerabilities."
          value={d}
          onChange={onChange}
          field="mfg_supplyChain"
          multiline
        />
        <TextField
          label="Products in Development"
          hint="Describe any products currently in development or planned for after launch."
          value={d}
          onChange={onChange}
          field="mfg_productsInDevelopment"
          multiline
        />
      </div>

      {/* ── Service Businesses ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Service Businesses</h2>
        <TextField
          label="Pricing Methodology"
          hint="How you set your prices and what methodology you use."
          value={d}
          onChange={onChange}
          field="service_pricing"
          multiline
        />
        <TextField
          label="Service Delivery Systems and Processes"
          hint="The systems and processes that ensure consistent, high-quality service delivery."
          value={d}
          onChange={onChange}
          field="service_deliverySystems"
          multiline
        />
        <TextField
          label="Employee Productivity"
          hint="How you'll measure and manage employee productivity."
          value={d}
          onChange={onChange}
          field="service_productivity"
          multiline
        />
        <TextField
          label="Subcontracting Plans"
          hint="Whether you'll subcontract work, what percentage, to whom, and profit from it."
          value={d}
          onChange={onChange}
          field="service_subcontracting"
          multiline
        />
        <TextField
          label="Credit, Payment, and Collections Policies"
          hint="Your credit, payment, and collections policies."
          value={d}
          onChange={onChange}
          field="service_creditPolicies"
          multiline
        />
        <TextField
          label="Client Relationships and Long-Term Contracts"
          hint="How you'll build lasting client relationships and pursue long-term contracts."
          value={d}
          onChange={onChange}
          field="service_clientRelationships"
          multiline
        />
        <TextField
          label="New Services in Development"
          hint="Any new services currently in development or planned for after launch."
          value={d}
          onChange={onChange}
          field="service_newServices"
          multiline
        />
      </div>

      {/* ── Retail Businesses ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Retail Businesses</h2>
        <TextField
          label="Brands and Products"
          hint="The specific brands or products you'll carry. Will any give you a competitive edge?"
          value={d}
          onChange={onChange}
          field="retail_brands"
          multiline
        />
        <TextField
          label="Inventory Management"
          hint="How you'll manage inventory and the inventory management software you'll use."
          value={d}
          onChange={onChange}
          field="retail_inventoryManagement"
          multiline
        />
        <TextField
          label="Payment Methods and Processing"
          hint="The payment methods you'll accept and the payment processing service you'll use."
          value={d}
          onChange={onChange}
          field="retail_paymentMethods"
          multiline
        />
        <TextField
          label="Point-of-Sale System"
          hint="Your POS system, both hardware and software."
          value={d}
          onChange={onChange}
          field="retail_posSystem"
          multiline
        />
        <TextField
          label="Markup and Pricing Strategy"
          hint="Prices should be profitable, competitive, and consistent with your brand."
          value={d}
          onChange={onChange}
          field="retail_pricingStrategy"
          multiline
        />
        <TextField
          label="Opening Inventory Level"
          hint="Industry average annual inventory turnover rate vs. projected first-year COGS."
          value={d}
          onChange={onChange}
          field="retail_openingInventory"
          multiline
        />
        <TextField
          label="Customer Service Policies"
          hint="Including how you'll handle returns and exchanges."
          value={d}
          onChange={onChange}
          field="retail_customerService"
          multiline
        />
        <TextField
          label="E-Commerce Channel"
          hint="Whether you plan to add an e-commerce channel and/or sell on third-party marketplaces."
          value={d}
          onChange={onChange}
          field="retail_ecommerceChannel"
          multiline
        />
      </div>

      {/* ── E-Commerce Businesses ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>E-Commerce Businesses</h2>
        <TextField
          label="What You're Selling"
          hint="Physical products, services, digital products, or a combination."
          value={d}
          onChange={onChange}
          field="ecom_whatSelling"
          multiline
        />
        <TextField
          label="Branding and Packaging"
          hint="How you'll brand and package physical products."
          value={d}
          onChange={onChange}
          field="ecom_branding"
          multiline
        />
        <TextField
          label="Sales Channels"
          hint="Own website, Shopify, Amazon, eBay, Etsy, or other marketplaces."
          value={d}
          onChange={onChange}
          field="ecom_salesChannels"
          multiline
        />
        <TextField
          label="Technology Stack"
          hint="Web hosting, site design, shopping cart, checkout, payment processing, fulfillment, email marketing."
          value={d}
          onChange={onChange}
          field="ecom_techStack"
          multiline
        />
        <TextField
          label="Scalability"
          hint="Whether your platforms can scale efficiently as your business grows or shrinks."
          value={d}
          onChange={onChange}
          field="ecom_scalability"
          multiline
        />
        <TextField
          label="Product Sourcing"
          hint="Manufactured in-house, sourced from suppliers, or drop-shipped."
          value={d}
          onChange={onChange}
          field="ecom_productSourcing"
          multiline
        />
        <TextField
          label="Returns and Exchanges Policy"
          hint="Your returns and exchanges policy."
          value={d}
          onChange={onChange}
          field="ecom_returnsPolicy"
          multiline
        />
        <TextField
          label="Customer Service"
          hint="How you'll deliver customer service."
          value={d}
          onChange={onChange}
          field="ecom_customerService"
          multiline
        />
      </div>

      {/* ── Software and SaaS Businesses ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Software and SaaS Businesses</h2>
        <TextField
          label="Pricing Model"
          hint="Free trial, freemium, or paid from the start."
          value={d}
          onChange={onChange}
          field="saas_pricingModel"
          multiline
        />
        <TextField
          label="Free-to-Paid Conversion Strategy"
          hint="If you offer a free tier, how will you convert users to paying customers?"
          value={d}
          onChange={onChange}
          field="saas_conversionStrategy"
          multiline
        />
        <TextField
          label="Early Adopter / Beta User Feedback"
          hint="If you already have early adopters or beta users, what has been their feedback?"
          value={d}
          onChange={onChange}
          field="saas_betaFeedback"
          multiline
        />
        <TextField
          label="Recurring Revenue and Churn Reduction"
          hint="How you'll structure contracts or incentives to drive recurring revenue and reduce churn."
          value={d}
          onChange={onChange}
          field="saas_recurringRevenue"
          multiline
        />
        <TextField
          label="Staying Competitive"
          hint="How you'll stay competitive as technology, customer needs, and market conditions shift."
          value={d}
          onChange={onChange}
          field="saas_competitiveStrategy"
          multiline
        />
        <TextField
          label="Development Approach and IP Strategy"
          hint="In-house or outsourced development, and your IP ownership strategy."
          value={d}
          onChange={onChange}
          field="saas_development"
          multiline
        />
        <TextField
          label="Customer Support Model"
          hint="Your customer support model."
          value={d}
          onChange={onChange}
          field="saas_customerSupport"
          multiline
        />
        <TextField
          label="Attracting and Retaining Technical Talent"
          hint="How you'll attract, retain, and compensate key technical talent."
          value={d}
          onChange={onChange}
          field="saas_talent"
          multiline
        />
        <TextField
          label="Proprietary Technology / Intellectual Property"
          hint="Any proprietary technology or IP that gives you a competitive edge."
          value={d}
          onChange={onChange}
          field="saas_ip"
          multiline
        />
        <TextField
          label="Product Roadmap"
          hint="Updates, features, or new products planned for after launch."
          value={d}
          onChange={onChange}
          field="saas_roadmap"
          multiline
        />
        <TextField
          label="Key Metrics"
          hint="MRR, ARR, CAC, LTV, churn rate, and other key metrics you'll track."
          value={d}
          onChange={onChange}
          field="saas_keyMetrics"
          multiline
        />
      </div>

      {/* ── Final Steps ── */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Final Steps</h2>
        <div style={styles.checkboxGroup}>
          <CheckboxItem
            label="Proofread carefully — or ask someone else to review your plan for errors, clarity, and logical consistency."
            checked={d}
            onChange={onChange}
            field="final_proofread"
          />
          <CheckboxItem
            label="Verify that every financial figure is accurate and that all assumptions are documented."
            checked={d}
            onChange={onChange}
            field="final_verifyFinancials"
          />
          <CheckboxItem
            label="Tailor the plan for your intended audience using the guidance in this section above."
            checked={d}
            onChange={onChange}
            field="final_tailorAudience"
          />
          <CheckboxItem
            label="Save as a PDF for sharing digitally or print for in-person presentations."
            checked={d}
            onChange={onChange}
            field="final_saveAsPDF"
          />
        </div>
        <div style={styles.note}>
          <strong>Next Step:</strong> Go back to the beginning and complete the Executive Summary. After working through all sections, you'll have a much clearer picture of your business concept and be better positioned to summarize it effectively. Consider working with a free SCORE mentor to stress-test your assumptions and refine your strategy.
        </div>
      </div>
    </div>
  );
}