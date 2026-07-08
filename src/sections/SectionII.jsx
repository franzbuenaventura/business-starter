const styles = {
  container: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 800,
    margin: "0 auto",
    padding: "0 0 32px",
  },
  heading: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 4,
  },
  subheading: {
    fontSize: 17,
    fontWeight: 600,
    margin: "28px 0 12px",
    paddingBottom: 6,
    borderBottom: "2px solid #e0e0e0",
  },
  label: {
    display: "block",
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  hint: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d0d0d0",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.5,
    boxSizing: "border-box",
    marginBottom: 16,
    outline: "none",
    transition: "border-color 0.15s",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    padding: "10px 12px",
    border: "1px solid #d0d0d0",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.5,
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: 16,
    outline: "none",
    transition: "border-color 0.15s",
  },
  textareaTall: {
    width: "100%",
    minHeight: 120,
    padding: "10px 12px",
    border: "1px solid #d0d0d0",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.5,
    resize: "vertical",
    boxSizing: "border-box",
    marginBottom: 16,
    outline: "none",
    transition: "border-color 0.15s",
  },
  row: {
    display: "flex",
    gap: 16,
    marginBottom: 0,
  },
  halfCol: {
    flex: 1,
    minWidth: 0,
  },
  worksheetNote: {
    fontSize: 12,
    color: "#999",
    marginTop: -8,
    marginBottom: 16,
    fontStyle: "italic",
  },
}

function cleanValue(val) {
  if (val === null || val === undefined) return ""
  if (typeof val === "string") return val
  return String(val)
}

export default function SectionII({ data, onChange }) {
  const d = data || {}

  function makeSetter(field) {
    return function handleChange(e) {
      const updated = { ...d, [field]: e.target.value }
      if (onChange) onChange(updated)
    }
  }

  return (
    <div style={styles.container}>
      <p style={{ color: "#888", fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>
        This section gives readers a clear picture of what your business is, what it stands for,
        and how it's structured. Cover each of the following elements.
      </p>

      {/* ────────────────────────────────────────── */}
      {/* 1. Mission Statement */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>1. Mission Statement</div>

      <label style={styles.label}>Mission Statement</label>
      <span style={styles.hint}>
        A concise explanation of why your business exists — what it does, who it serves,
        and what makes it distinctive. Aim for one to two sentences. Clear and specific
        beats clever and vague.
      </span>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.missionStatement)}
        onChange={makeSetter("missionStatement")}
        placeholder='"MoreDough is an app that helps consumers manage their personal finances in a fun, convenient way."'
      />

      {/* ────────────────────────────────────────── */}
      {/* 2. Philosophy and Vision */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>2. Philosophy and Vision</div>

      <label style={styles.label}>Company Philosophy / Values</label>
      <span style={styles.hint}>
        Your values — the principles your business operates by. Think honesty, innovation,
        community, sustainability, customer focus. What guides your decisions when things get hard?
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.philosophyValues)}
        onChange={makeSetter("philosophyValues")}
        placeholder="Describe the core values and principles that guide your business."
      />

      <label style={styles.label}>Company Vision</label>
      <span style={styles.hint}>
        Your long-term ambition. Where do you want this business to go? Be specific about
        what success looks like on a longer horizon.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.companyVision)}
        onChange={makeSetter("companyVision")}
        placeholder="Describe your long-term vision for the business — e.g., regional brand, national franchise, go-to platform in your category."
      />

      {/* ────────────────────────────────────────── */}
      {/* 3. Goals and Milestones */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>3. Goals and Milestones</div>

      <label style={styles.label}>Short-Term Goals (next 1-2 years)</label>
      <span style={styles.hint}>
        What specific, measurable objectives do you aim to achieve in the short term?
      </span>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.shortTermGoals)}
        onChange={makeSetter("shortTermGoals")}
        placeholder="Example: reach 500 active clients, launch product v2, break even on monthly expenses."
      />

      <label style={styles.label}>Long-Term Goals (3-5+ years)</label>
      <span style={styles.hint}>
        Where do you see the business in 3-5 years or more?
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.longTermGoals)}
        onChange={makeSetter("longTermGoals")}
        placeholder="Example: open a second location, expand to three new markets, reach $2M in annual revenue."
      />

      <label style={styles.label}>Key Milestones &amp; Benchmarks</label>
      <span style={styles.hint}>
        The measurable milestones you'll use to track progress toward your goals.
        Concrete benchmarks keep you accountable.
      </span>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.keyMilestones)}
        onChange={makeSetter("keyMilestones")}
        placeholder="Examples: hitting a specific monthly revenue target, securing a set number of clients, completing product development phases."
      />

      {/* ────────────────────────────────────────── */}
      {/* 4. Target Market */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>4. Target Market</div>

      <label style={styles.label}>Target Market Description</label>
      <span style={styles.hint}>
        Briefly describe who your ideal customers are, who you're building this company for,
        and why they want or need what you're offering.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.targetMarketDescription)}
        onChange={makeSetter("targetMarketDescription")}
        placeholder="Describe your ideal customers, their characteristics, and why they need your product or service."
      />

      {/* ────────────────────────────────────────── */}
      {/* 5. Industry Overview */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>5. Industry Overview</div>

      <label style={styles.label}>Industry Description &amp; Trends</label>
      <span style={styles.hint}>
        Describe the industry your business is in. Is it growing, stable, or going through
        significant change? What trends are shaping its future, and how does your business
        take advantage of them?
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.industryDescription)}
        onChange={makeSetter("industryDescription")}
        placeholder="Describe your industry, its current state, and key trends shaping its future."
      />

      <label style={styles.label}>Competitive Landscape</label>
      <span style={styles.hint}>
        Who are your competitors (local, regional, national, or global)? What will it take
        to outperform them?
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.competitiveLandscape)}
        onChange={makeSetter("competitiveLandscape")}
        placeholder="Identify your key competitors and describe what it will take to compete effectively."
      />

      {/* ────────────────────────────────────────── */}
      {/* 6. Legal Structure */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>6. Legal Structure &amp; Ownership</div>

      <label style={styles.label}>Business Structure</label>
      <span style={styles.hint}>
        Sole proprietorship, LLC, partnership, or corporation. Explain why you chose it
        (tax treatment, liability protection, flexibility for investment).
      </span>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.legalStructure)}
        onChange={makeSetter("legalStructure")}
        placeholder="e.g., LLC — chosen for liability protection and pass-through taxation."
      />

      <label style={styles.label}>Ownership / Equity Structure</label>
      <span style={styles.hint}>
        If your business has multiple owners, describe how ownership is divided.
        If you have investors, note their ownership percentage.
      </span>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.ownershipStructure)}
        onChange={makeSetter("ownershipStructure")}
        placeholder="Describe ownership percentages, investor stakes, or co-founder split."
      />

      {/* ────────────────────────────────────────── */}
      {/* Company Description Worksheet */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>Company Description Worksheet</div>
      <p style={styles.worksheetNote}>
        Use this worksheet to help complete the section. These fields mirror the SCORE
        Company Description Worksheet prompts.
      </p>

      <label style={styles.label}>Business Name</label>
      <input
        style={styles.input}
        type="text"
        value={cleanValue(d.worksheetBusinessName)}
        onChange={makeSetter("worksheetBusinessName")}
        placeholder="Your business name"
      />

      <label style={styles.label}>Company Mission Statement</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.worksheetMissionStatement)}
        onChange={makeSetter("worksheetMissionStatement")}
        placeholder="Your mission statement in brief"
      />

      <label style={styles.label}>Company Philosophy / Values</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.worksheetPhilosophy)}
        onChange={makeSetter("worksheetPhilosophy")}
        placeholder="Core values your business operates by"
      />

      <label style={styles.label}>Company Vision</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.worksheetVision)}
        onChange={makeSetter("worksheetVision")}
        placeholder="Your long-term ambition"
      />

      <label style={styles.label}>Goals &amp; Milestones</label>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetGoalsMilestones)}
        onChange={makeSetter("worksheetGoalsMilestones")}
        placeholder="1.\n2.\n3.\n\nList your key goals and the milestones you'll use to measure progress."
      />

      <label style={styles.label}>Target Market</label>
      <textarea
        style={styles.textarea}
        value={cleanValue(d.worksheetTargetMarket)}
        onChange={makeSetter("worksheetTargetMarket")}
        placeholder="Describe your target market."
      />

      <label style={styles.label}>Industry / Competitors</label>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetIndustryCompetitors)}
        onChange={makeSetter("worksheetIndustryCompetitors")}
        placeholder="1.\n2.\n3.\n\nList your key competitors or industry context."
      />

      <label style={styles.label}>Legal Structure / Ownership</label>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetLegalStructure)}
        onChange={makeSetter("worksheetLegalStructure")}
        placeholder="Business structure and ownership information."
      />
    </div>
  )
}