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
};

function Field({ label, hint, value, onChange, field, type = "textarea", rows, tall }) {
  const handleChange = useCallback(
    (e) => {
      onChange(field, e.target.value);
    },
    [onChange, field]
  );

  const inputStyle = type === "text" ? styles.input : tall ? styles.textareaTall : styles.textarea;

  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      {type === "text" ? (
        <input
          style={inputStyle}
          type="text"
          value={value || ""}
          onChange={handleChange}
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      ) : (
        <textarea
          style={inputStyle}
          value={value || ""}
          onChange={handleChange}
          rows={rows || 3}
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      )}
    </div>
  );
}

export default function SectionI({ data, onChange }) {
  const handleFieldChange = useCallback(
    (field, value) => {
      onChange({ ...(data || {}), [field]: value });
    },
    [data, onChange]
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Executive Summary</h1>
      <p style={styles.subheading}>
        Write this section last. Briefly address each area below to give readers a clear,
        compelling overview of your business concept, its potential, and why they should
        keep reading.
      </p>

      {/* Business Idea */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Business Idea</h2>
        <Field
          label="Business Idea"
          hint="A one- or two-sentence overview. What are you building, and why does it matter?"
          field="businessIdea"
          type="textarea"
          rows={2}
          value={data?.businessIdea}
          onChange={handleFieldChange}
        />
      </div>

      {/* Product / Service */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Product / Service</h2>
        <Field
          label="Product / Service & Problem Solved"
          hint="What are you offering, and what problem does it solve for your customers?"
          field="productService"
          tall
          value={data?.productService}
          onChange={handleFieldChange}
        />
      </div>

      {/* Business Model */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Business Model</h2>
        <Field
          label="Business Model / Revenue Streams"
          hint="How will your business make money? What are your primary revenue streams?"
          field="businessModel"
          tall
          value={data?.businessModel}
          onChange={handleFieldChange}
        />
      </div>

      {/* Goals */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Goals</h2>
        <div style={styles.grid2}>
          <Field
            label="1-Year Goals"
            hint="Where do you expect the business to be in one year?"
            field="goals1Year"
            tall
            value={data?.goals1Year}
            onChange={handleFieldChange}
          />
          <Field
            label="3-Year Goals"
            hint="Where do you expect the business to be in three years?"
            field="goals3Year"
            tall
            value={data?.goals3Year}
            onChange={handleFieldChange}
          />
          <Field
            label="5-Year Goals"
            hint="Where do you expect the business to be in five years?"
            field="goals5Year"
            tall
            value={data?.goals5Year}
            onChange={handleFieldChange}
          />
        </div>
      </div>

      {/* Customer Acquisition */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Customer Acquisition Strategy</h2>
        <Field
          label="Customer Acquisition Strategy"
          hint="How will you reach and attract your target customers?"
          field="customerAcquisition"
          tall
          value={data?.customerAcquisition}
          onChange={handleFieldChange}
        />
      </div>

      {/* Target Market */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Target Market</h2>
        <Field
          label="Target Market"
          hint="Who are your ideal customers, and why are they the right audience for what you're offering?"
          field="targetMarket"
          tall
          value={data?.targetMarket}
          onChange={handleFieldChange}
        />
      </div>

      {/* Competition */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Competition &amp; Competitive Edge</h2>
        <Field
          label="Competition & Competitive Edge"
          hint="Who are you up against, and what sets you apart?"
          field="competition"
          tall
          value={data?.competition}
          onChange={handleFieldChange}
        />
      </div>

      {/* Management Team */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Management Team</h2>
        <Field
          label="Management Team Highlights"
          hint="Who's involved, and what experience or skills do they bring that will help the business succeed?"
          field="managementTeam"
          tall
          value={data?.managementTeam}
          onChange={handleFieldChange}
        />
      </div>

      {/* Financial Outlook */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Financial Outlook</h2>
        <Field
          label="Financial Outlook / Financing Needs"
          hint="If you're seeking financing, be specific: how much do you need, how do you plan to use it, and how will it help the business grow and become profitable?"
          field="financialOutlook"
          tall
          value={data?.financialOutlook}
          onChange={handleFieldChange}
        />
      </div>

      {/* Evidence of Traction */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Evidence of Traction</h2>
        <Field
          label="Evidence of Traction (if any)"
          hint="Include any early sales, customer interest, partnerships, or market validation."
          field="evidenceOfTraction"
          tall
          value={data?.evidenceOfTraction}
          onChange={handleFieldChange}
        />
      </div>
    </div>
  );
}