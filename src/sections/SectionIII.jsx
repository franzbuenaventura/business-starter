const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: 800,
    margin: '0 auto',
    padding: '0 0 32px',
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 17,
    fontWeight: 600,
    margin: '28px 0 12px',
    paddingBottom: 6,
    borderBottom: '2px solid #e0e0e0',
  },
  label: {
    display: 'block',
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d0d0d0',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.5,
    boxSizing: 'border-box',
    marginBottom: 16,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%',
    minHeight: 90,
    padding: '10px 12px',
    border: '1px solid #d0d0d0',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.5,
    resize: 'vertical',
    boxSizing: 'border-box',
    marginBottom: 16,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  row: {
    display: 'flex',
    gap: 16,
    marginBottom: 0,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  worksheetNote: {
    fontSize: 12,
    color: '#999',
    marginTop: -8,
    marginBottom: 16,
    fontStyle: 'italic',
  },
}

function cleanValue(val) {
  if (val === null || val === undefined) return ''
  if (typeof val === 'string') return val
  return String(val)
}

function onChangeWrapper(prevOnChange, field) {
  return function handleChange(e) {
    if (!prevOnChange) return
    prevOnChange({ ...prevOnChange._latest, [field]: e.target.value })
  }
}

export default function SectionIII({ data, onChange }) {
  const d = data || {}

  // Stash latest data so onChangeWrapper can access it
  if (onChange) onChange._latest = d

  function makeSetter(field) {
    return function handleChange(e) {
      const updated = { ...d, [field]: e.target.value }
      if (onChange) onChange._latest = updated
      if (onChange) onChange(updated)
    }
  }

  return (
    <div style={styles.container}>
      <p style={{ color: '#888', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
        This section builds on what you introduced in the Executive Summary and Company Description.
        Here you'll go deeper — explaining exactly what you plan to offer, why it matters to customers,
        and what makes it competitive.
      </p>

      {/* ────────────────────────────────────────── */}
      {/* Section 1: What You Offer */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>1. What You Offer</div>

      <label style={styles.label}>Product / Service Description</label>
      <textarea
        style={{ ...styles.textarea, minHeight: 120 }}
        value={cleanValue(d.whatYouOffer)}
        onChange={makeSetter('whatYouOffer')}
        placeholder="Describe your product or service in detail. What are you selling, how is it made or delivered?"
      />

      <label style={styles.label}>Key Relationships (Suppliers, Manufacturers, Partners)</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.keyRelationships)}
        onChange={makeSetter('keyRelationships')}
        placeholder="Describe relationships with suppliers, manufacturers, technology partners, or service providers that are critical to your business."
      />

      {/* ────────────────────────────────────────── */}
      {/* Section 2: The Problem You Solve */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>2. The Problem You Solve</div>

      <label style={styles.label}>Problem Definition</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.problemDefinition)}
        onChange={makeSetter('problemDefinition')}
        placeholder="What real problem does your business solve for a specific group of customers?"
      />

      <label style={styles.label}>How Your Solution Addresses the Problem</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.howSolutionAddresses)}
        onChange={makeSetter('howSolutionAddresses')}
        placeholder="How does your product or service address the problem described above?"
      />

      <label style={styles.label}>Key Benefits &amp; Features</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.benefitsFeatures)}
        onChange={makeSetter('benefitsFeatures')}
        placeholder="What are the key benefits and features of your offering?"
      />

      <label style={styles.label}>Unique Selling Proposition (USP)</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.usp)}
        onChange={makeSetter('usp')}
        placeholder="Why would a customer choose you over the competition? Better experience, lower price, underserved segment, or something else?"
      />

      {/* ────────────────────────────────────────── */}
      {/* Section 3: Your Competitive Advantage */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>3. Your Competitive Advantage</div>

      <label style={styles.label}>Proprietary Features</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.proprietaryFeatures)}
        onChange={makeSetter('proprietaryFeatures')}
        placeholder="Describe any proprietary features that strengthen your position."
      />

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Patents</label>
          <textarea
            style={styles.textarea}
            value={cleanValue(d.patents)}
            onChange={makeSetter('patents')}
            placeholder="Patents or patent-pending products"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Licenses</label>
          <textarea
            style={styles.textarea}
            value={cleanValue(d.licenses)}
            onChange={makeSetter('licenses')}
            placeholder="Licenses for products, technology, or services"
          />
        </div>
      </div>

      <label style={styles.label}>Exclusive Agreements</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.exclusiveAgreements)}
        onChange={makeSetter('exclusiveAgreements')}
        placeholder="Exclusive agreements with suppliers, vendors, or distributors."
      />

      <label style={styles.label}>Intellectual Property, Trade Secrets &amp; Other Protections</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.ipTradeSecrets)}
        onChange={makeSetter('ipTradeSecrets')}
        placeholder="Describe any intellectual property, trade secrets, or other formal protections."
      />

      {/* ────────────────────────────────────────── */}
      {/* Section 4: Your Pricing Strategy */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>4. Your Pricing Strategy</div>

      <label style={styles.label}>Pricing Model</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.pricingModel)}
        onChange={makeSetter('pricingModel')}
        placeholder="One-time purchase, subscription, retainer, lease, fee-for-service, or other structure."
      />

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Competitive Positioning</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.competitivePositioning)}
            onChange={makeSetter('competitivePositioning')}
            placeholder="e.g., Low-end, mid-range, premium"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Projected Profit Margin</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.projectedProfitMargin)}
            onChange={makeSetter('projectedProfitMargin')}
            placeholder="e.g., 40%"
          />
        </div>
      </div>

      <label style={styles.label}>Positioning Rationale</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.positioningRationale)}
        onChange={makeSetter('positioningRationale')}
        placeholder="Why does this positioning make sense for your target customer, and how does it support growth?"
      />

      <label style={styles.label}>Margin Rationale</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.marginRationale)}
        onChange={makeSetter('marginRationale')}
        placeholder="Describe the thinking behind your projected profit margin."
      />

      {/* ────────────────────────────────────────── */}
      {/* Worksheet */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>Product &amp; Service Description Worksheet</div>
      <p style={styles.worksheetNote}>
        The worksheet below covers additional details commonly included in a SCORE business plan.
      </p>

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Business Name</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.worksheetBusinessName)}
            onChange={makeSetter('worksheetBusinessName')}
            placeholder="Your business name"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Product / Service Idea</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.worksheetProductIdea)}
            onChange={makeSetter('worksheetProductIdea')}
            placeholder="Brief idea summary"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Special Benefits</label>
          <textarea
            style={styles.textarea}
            value={cleanValue(d.worksheetSpecialBenefits)}
            onChange={makeSetter('worksheetSpecialBenefits')}
            placeholder="What special benefits does your offering provide?"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Unique Features</label>
          <textarea
            style={styles.textarea}
            value={cleanValue(d.worksheetUniqueFeatures)}
            onChange={makeSetter('worksheetUniqueFeatures')}
            placeholder="What unique features set it apart?"
          />
        </div>
      </div>

      <label style={styles.label}>Limits and Liabilities</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.worksheetLimitsLiabilities)}
        onChange={makeSetter('worksheetLimitsLiabilities')}
        placeholder="Any limitations or liabilities associated with your product or service?"
      />

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Production and Delivery</label>
          <textarea
            style={styles.textarea}
            value={cleanValue(d.worksheetProductionDelivery)}
            onChange={makeSetter('worksheetProductionDelivery')}
            placeholder="How is your product produced and delivered?"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Suppliers</label>
          <textarea
            style={styles.textarea}
            value={cleanValue(d.worksheetSuppliers)}
            onChange={makeSetter('worksheetSuppliers')}
            placeholder="Key suppliers and their role"
          />
        </div>
      </div>

      <label style={styles.label}>Intellectual Property / Special Permits</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.worksheetIPPermits)}
        onChange={makeSetter('worksheetIPPermits')}
        placeholder="Intellectual property, special permits, or regulatory approvals needed."
      />

      <label style={styles.label}>Product / Service Description (Extended)</label>
      <textarea
        style={{ ...styles.textarea, minHeight: 140 }}
        value={cleanValue(d.worksheetExtendedDescription)}
        onChange={makeSetter('worksheetExtendedDescription')}
        placeholder="Provide a comprehensive description of your product or service."
      />
    </div>
  )
}