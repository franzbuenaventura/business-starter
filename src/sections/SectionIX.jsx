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
  docRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 34px",
    gap: 10,
    alignItems: "end",
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    border: "1px solid #eee",
  },
  docItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
};

function Input({ label, hint, value, onChange, field, type = "text", placeholder }) {
  const handleChange = useCallback(
    (e) => {
      onChange(field, e.target.value);
    },
    [onChange, field]
  );

  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      <input
        style={styles.input}
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

function DocEntry({ entry, index, onUpdate, onRemove }) {
  const handleChange = (field, value) => {
    onUpdate(index, { ...entry, [field]: value });
  };

  return (
    <div style={styles.docRow}>
      <div style={styles.docItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Document / Item
        </label>
        <input
          style={styles.input}
          type="text"
          value={entry.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Document name or description"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      </div>
      <div style={styles.docItem}>
        <label style={{ ...styles.label, marginBottom: 2, fontSize: 12 }}>
          Status / Notes
        </label>
        <input
          style={styles.input}
          type="text"
          value={entry.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="e.g. Signed, pending, attached"
          onFocus={(e) => (e.target.style.borderColor = "#4a90d9")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {index > 0 && (
          <button
            type="button"
            style={styles.removeButton}
            onClick={() => onRemove(index)}
            title="Remove"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function DocumentGroup({
  title,
  hint,
  items,
  field,
  placeholder,
  data,
  onFieldChange,
}) {
  const list = items || [{ name: "", notes: "" }];

  const add = () => {
    const updated = [...list, { name: "", notes: "" }];
    onFieldChange(field, updated);
  };

  const update = (index, updatedEntry) => {
    const updated = list.map((e, i) => (i === index ? updatedEntry : e));
    onFieldChange(field, updated);
  };

  const remove = (index) => {
    const updated = list.filter((_, i) => i !== index);
    onFieldChange(field, updated.length ? updated : [{ name: "", notes: "" }]);
  };

  return (
    <div style={styles.sectionGroup}>
      <h2 style={styles.groupTitle}>{title}</h2>
      <span style={styles.hint}>{hint}</span>

      {list.map((entry, index) => (
        <DocEntry
          key={index}
          entry={entry}
          index={index}
          onUpdate={update}
          onRemove={remove}
        />
      ))}

      <div style={{ textAlign: "left" }}>
        <button type="button" style={styles.addButton} onClick={add}>
          + Add Item
        </button>
      </div>

      <Textarea
        label="Additional Details"
        hint="Describe what documents you have, where they are filed, and any relevant context."
        field={`${field}Details`}
        tall
        value={data?.[`${field}Details`]}
        onChange={onFieldChange}
      />
    </div>
  );
}

export default function SectionIX({ data, onChange }) {
  const handleChange = useCallback(
    (field, value) => {
      onChange({ ...(data || {}), [field]: value });
    },
    [data, onChange]
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>IX. Appendices</h1>
      <p style={styles.subheading}>
        Keep the body of your business plan focused and readable. Supporting
        documents — contracts, licenses, research studies, and the like — belong
        in the Appendices, where readers can find them if they want to dig deeper.
        Reference them by name in the relevant sections of your plan so readers
        know they exist.
      </p>
      <p style={{ ...styles.subheading, fontSize: 13 }}>
        A well-organized Appendices section tells lenders and investors that your
        plan isn't built on optimism alone — it's backed by documentation, research,
        and evidence.
      </p>

      {/* ============ 1. AGREEMENTS ============ */}
      <DocumentGroup
        title="Agreements"
        hint="Leases, contracts, purchase orders, letters of intent."
        items={data?.agreements}
        field="agreements"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 2. INTELLECTUAL PROPERTY ============ */}
      <DocumentGroup
        title="Intellectual Property"
        hint="Trademarks, licenses, patents, or pending applications."
        items={data?.intellectualProperty}
        field="intellectualProperty"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 3. RESUMES ============ */}
      <DocumentGroup
        title="Resumes — Owners &amp; Key Team Members"
        hint="Attach or describe resumes for owners and key team members."
        items={data?.resumes}
        field="resumes"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 4. MARKETING MATERIALS ============ */}
      <DocumentGroup
        title="Marketing Materials"
        hint="Ads, campaigns, brand assets, or sample content."
        items={data?.marketingMaterials}
        field="marketingMaterials"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 5. PRESS & PUBLICITY ============ */}
      <DocumentGroup
        title="Press &amp; Publicity"
        hint="Any media coverage or public relations materials."
        items={data?.pressPublicity}
        field="pressPublicity"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 6. BLUEPRINTS OR FLOOR PLANS ============ */}
      <DocumentGroup
        title="Blueprints or Floor Plans"
        hint="For physical locations or buildouts."
        items={data?.blueprints}
        field="blueprints"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 7. EQUIPMENT LIST ============ */}
      <DocumentGroup
        title="Equipment List"
        hint="Itemized inventory of major equipment."
        items={data?.equipmentList}
        field="equipmentList"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 8. MARKET RESEARCH ============ */}
      <DocumentGroup
        title="Market Research"
        hint="Studies, surveys, data sources, or third-party reports that support your projections."
        items={data?.marketResearch}
        field="marketResearch"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 9. COLLATERAL ============ */}
      <DocumentGroup
        title="Collateral"
        hint="A list of assets that could be used to secure financing."
        items={data?.collateral}
        field="collateral"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 10. INSURANCE ============ */}
      <DocumentGroup
        title="Insurance Policy Summaries or Binders"
        hint="Summarize your insurance coverage."
        items={data?.insurance}
        field="insurance"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 11. DATA PRIVACY & CYBERSECURITY ============ */}
      <div style={styles.sectionGroup}>
        <h2 style={styles.groupTitle}>Data Privacy &amp; Cybersecurity Policy</h2>
        <span style={styles.hint}>
          If you are collecting customer data, describe your privacy policy,
          cybersecurity measures, and any compliance certifications.
        </span>
        <Textarea
          label="Data Privacy &amp; Cybersecurity Policy"
          hint="Outline how you collect, store, protect, and handle customer data."
          field="dataPrivacyPolicy"
          tall
          value={data?.dataPrivacyPolicy}
          onChange={handleChange}
        />
      </div>

      {/* ============ 12. PRODUCT PHOTOS, PROTOTYPES, SPECS ============ */}
      <DocumentGroup
        title="Product Photos, Prototypes, or Technical Specifications"
        hint="Visuals or technical details of your product or service."
        items={data?.productSpecs}
        field="productSpecs"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 13. LETTERS OF INTENT ============ */}
      <DocumentGroup
        title="Letters of Intent — Prospective Customers or Partners"
        hint="Letters of intent from prospective customers or partners."
        items={data?.lettersOfIntent}
        field="lettersOfIntent"
        data={data}
        onFieldChange={handleChange}
      />

      {/* ============ 14. OTHER SUPPORTING DOCUMENTS ============ */}
      <DocumentGroup
        title="Other Supporting Documents"
        hint="Anything else that strengthens your case or supports the assumptions you've made throughout the plan. Photos of your proposed location, product illustrations, patent drawings, or market growth charts can all help readers visualize what you're building."
        items={data?.otherDocuments}
        field="otherDocuments"
        data={data}
        onFieldChange={handleChange}
      />
    </div>
  );
}