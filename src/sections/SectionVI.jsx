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
  intro: {
    color: '#888',
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: 24,
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
  textareaTall: {
    width: '100%',
    minHeight: 140,
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

export default function SectionVI({ data, onChange }) {
  const d = data || {}

  function makeSetter(field) {
    return function handleChange(e) {
      const updated = { ...d, [field]: e.target.value }
      if (onChange) onChange(updated)
    }
  }

  return (
    <div style={styles.container}>
      <p style={styles.intro}>
        No matter how strong your product or market opportunity, investors and lenders
        ultimately bet on people. This section introduces the team behind your business
        — who they are, what they bring to the table, and how you have structured the
        organization to succeed.
      </p>

      {/* ────────────────────────────────────────── */}
      {/* Section 1: Team Biographies */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>1. Team Biographies</div>

      <label style={styles.label}>Owner / Founder Biographies</label>
      <span style={styles.hint}>
        Provide a brief biography for each owner and key team member. Cover industry
        knowledge, relevant functional skills, previous business experience, and any
        track record navigating challenges relevant to this business.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.teamBiographiesOwners)}
        onChange={makeSetter('teamBiographiesOwners')}
        placeholder="Write a few paragraphs per person. Keep it a compelling narrative, not a list of job titles."
      />

      <label style={styles.label}>Key Employee Biographies</label>
      <span style={styles.hint}>
        If you have key employees beyond the founders, provide their relevant background here.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.teamBiographiesEmployees)}
        onChange={makeSetter('teamBiographiesEmployees')}
        placeholder="Background, skills, and relevant experience for each key employee."
      />

      {/* ────────────────────────────────────────── */}
      {/* Section 2: Gaps and How to Address Them */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>2. Gaps and How to Address Them</div>

      <label style={styles.label}>Gaps in Management or Experience</label>
      <span style={styles.hint}>
        Every founding team has gaps. What matters is that you have identified yours and
        have a plan to address them. Being upfront about gaps builds credibility.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.gapsManagement)}
        onChange={makeSetter('gapsManagement')}
        placeholder="Identify gaps in your team's experience or skills. How will you address them — a CFO, accountant, fractional executive, sales lead, or outside representatives?"
      />

      {/* ────────────────────────────────────────── */}
      {/* Section 3: Advisors and Support Team */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>3. Advisors and Support Team</div>

      <label style={styles.label}>Professional &amp; Advisory Support Network</label>
      <span style={styles.hint}>
        Strong advisors can improve your odds of success and signal to readers that
        experienced people believe in what you are building. Note any relevant
        experience or specialization for each.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.advisorsNotes)}
        onChange={makeSetter('advisorsNotes')}
        placeholder="Describe your advisory board, board of directors, consultants, mentors, and any fractional executives you work with."
      />

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Attorney</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorAttorney)}
            onChange={makeSetter('advisorAttorney')}
            placeholder="Name / firm"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Accountant / CPA</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorAccountant)}
            onChange={makeSetter('advisorAccountant')}
            placeholder="Name / firm"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Insurance Agent</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorInsurance)}
            onChange={makeSetter('advisorInsurance')}
            placeholder="Name / agency"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Banker</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorBanker)}
            onChange={makeSetter('advisorBanker')}
            placeholder="Name / bank"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>SCORE Mentor</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorSCOREMentor)}
            onChange={makeSetter('advisorSCOREMentor')}
            placeholder="Name"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Board of Directors</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorBoardOfDirectors)}
            onChange={makeSetter('advisorBoardOfDirectors')}
            placeholder="Names / affiliations"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.halfCol}>
          <label style={styles.label}>Advisory Board</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorAdvisoryBoard)}
            onChange={makeSetter('advisorAdvisoryBoard')}
            placeholder="Names / affiliations"
          />
        </div>
        <div style={styles.halfCol}>
          <label style={styles.label}>Consultants</label>
          <input
            style={styles.input}
            type="text"
            value={cleanValue(d.advisorConsultants)}
            onChange={makeSetter('advisorConsultants')}
            placeholder="Names / firms"
          />
        </div>
      </div>

      {/* ────────────────────────────────────────── */}
      {/* Section 4: Organization Chart */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>4. Organization Chart</div>

      <label style={styles.label}>Organization Structure</label>
      <span style={styles.hint}>
        Describe the structure of your business — both roles that are currently filled
        and positions you plan to hire for as the business grows. Even as a solo founder,
        mapping out your intended structure shows you have thought beyond the launch phase.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.organizationChart)}
        onChange={makeSetter('organizationChart')}
        placeholder="Describe your organizational structure. Include current roles and planned future positions."
      />

      {/* ────────────────────────────────────────── */}
      {/* Management Worksheet */}
      {/* ────────────────────────────────────────── */}
      <div style={styles.subheading}>Management Worksheet</div>
      <p style={styles.worksheetNote}>
        The Management Worksheet and Organization Chart fields below capture the
        detailed information recommended by the SCORE template.
      </p>

      <label style={styles.label}>Owner / Founder Bios (Worksheet)</label>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetOwnerBios)}
        onChange={makeSetter('worksheetOwnerBios')}
        placeholder="Detailed owner / founder biographies"
      />

      <label style={styles.label}>Key Employee Bios (Worksheet)</label>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetEmployeeBios)}
        onChange={makeSetter('worksheetEmployeeBios')}
        placeholder="Detailed key employee biographies"
      />

      <label style={styles.label}>Gaps in Management or Experience (Worksheet)</label>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetGaps)}
        onChange={makeSetter('worksheetGaps')}
        placeholder="Additional notes on management gaps"
      />

      <label style={styles.label}>Organization Chart (Insert)</label>
      <span style={styles.hint}>
        Tools such as Lucidchart, Canva, or Microsoft SmartArt work well for creating
        an organization chart. Include current roles and planned future positions.
      </span>
      <textarea
        style={styles.textareaTall}
        value={cleanValue(d.worksheetOrgChart)}
        onChange={makeSetter('worksheetOrgChart')}
        placeholder="Insert your organization chart here — include current roles and planned future positions."
      />
    </div>
  )
}
