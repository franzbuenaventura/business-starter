import { SectionPage, Group, Field, Row } from '../components/Fields.jsx'

export default function SectionII({ data, onChange }) {
  const d = data || {}
  const set = (field) => (value) => onChange && onChange({ ...d, [field]: value })

  return (
    <SectionPage title="Company Description" intro="This section gives readers a clear picture of what your business is, what it stands for, and how it's structured. Cover each of the following elements.">
      <Group title="1. Mission Statement">
        <Field
          label="Mission Statement"
          hint="A concise explanation of why your business exists — what it does, who it serves, and what makes it distinctive. Aim for one to two sentences. Clear and specific beats clever and vague."
          value={d.missionStatement}
          onChange={set('missionStatement')}
          placeholder='"MoreDough is an app that helps consumers manage their personal finances in a fun, convenient way."'
        />
      </Group>

      <Group title="2. Philosophy and Vision">
        <Field
          label="Company Philosophy / Values"
          hint="Your values — the principles your business operates by. Think honesty, innovation, community, sustainability, customer focus. What guides your decisions when things get hard?"
          value={d.philosophyValues}
          onChange={set('philosophyValues')}
          placeholder="Describe the core values and principles that guide your business."
          tall
        />
        <Field
          label="Company Vision"
          hint="Your long-term ambition. Where do you want this business to go? Be specific about what success looks like on a longer horizon."
          value={d.companyVision}
          onChange={set('companyVision')}
          placeholder="Describe your long-term vision for the business — e.g., regional brand, national franchise, go-to platform in your category."
          tall
        />
      </Group>

      <Group title="3. Goals and Milestones">
        <Field
          label="Short-Term Goals (next 1-2 years)"
          hint="What specific, measurable objectives do you aim to achieve in the short term?"
          value={d.shortTermGoals}
          onChange={set('shortTermGoals')}
          placeholder="Example: reach 500 active clients, launch product v2, break even on monthly expenses."
        />
        <Field
          label="Long-Term Goals (3-5+ years)"
          hint="Where do you see the business in 3-5 years or more?"
          value={d.longTermGoals}
          onChange={set('longTermGoals')}
          placeholder="Example: open a second location, expand to three new markets, reach $2M in annual revenue."
          tall
        />
        <Field
          label="Key Milestones & Benchmarks"
          hint="The measurable milestones you'll use to track progress toward your goals. Concrete benchmarks keep you accountable."
          value={d.keyMilestones}
          onChange={set('keyMilestones')}
          placeholder="Examples: hitting a specific monthly revenue target, securing a set number of clients, completing product development phases."
        />
      </Group>

      <Group title="4. Target Market">
        <Field
          label="Target Market Description"
          hint="Briefly describe who your ideal customers are, who you're building this company for, and why they want or need what you're offering."
          value={d.targetMarketDescription}
          onChange={set('targetMarketDescription')}
          placeholder="Describe your ideal customers, their characteristics, and why they need your product or service."
          tall
        />
      </Group>

      <Group title="5. Industry Overview">
        <Field
          label="Industry Description & Trends"
          hint="Describe the industry your business is in. Is it growing, stable, or going through significant change? What trends are shaping its future, and how does your business take advantage of them?"
          value={d.industryDescription}
          onChange={set('industryDescription')}
          placeholder="Describe your industry, its current state, and key trends shaping its future."
          tall
        />
        <Field
          label="Competitive Landscape"
          hint="Who are your competitors (local, regional, national, or global)? What will it take to outperform them?"
          value={d.competitiveLandscape}
          onChange={set('competitiveLandscape')}
          placeholder="Identify your key competitors and describe what it will take to compete effectively."
          tall
        />
      </Group>

      <Group title="6. Legal Structure & Ownership">
        <Field
          label="Business Structure"
          hint="Sole proprietorship, LLC, partnership, or corporation. Explain why you chose it (tax treatment, liability protection, flexibility for investment)."
          value={d.legalStructure}
          onChange={set('legalStructure')}
          placeholder="e.g., LLC — chosen for liability protection and pass-through taxation."
        />
        <Field
          label="Ownership / Equity Structure"
          hint="If your business has multiple owners, describe how ownership is divided. If you have investors, note their ownership percentage."
          value={d.ownershipStructure}
          onChange={set('ownershipStructure')}
          placeholder="Describe ownership percentages, investor stakes, or co-founder split."
        />
      </Group>

      <Group title="Company Description Worksheet" hint="Use this worksheet to help complete the section. These fields mirror the SCORE Company Description Worksheet prompts.">
        <Field label="Business Name" type="text" value={d.worksheetBusinessName} onChange={set('worksheetBusinessName')} placeholder="Your business name" />
        <Field label="Company Mission Statement" value={d.worksheetMissionStatement} onChange={set('worksheetMissionStatement')} placeholder="Your mission statement in brief" />
        <Field label="Company Philosophy / Values" value={d.worksheetPhilosophy} onChange={set('worksheetPhilosophy')} placeholder="Core values your business operates by" />
        <Field label="Company Vision" value={d.worksheetVision} onChange={set('worksheetVision')} placeholder="Your long-term ambition" />
        <Field label="Goals & Milestones" value={d.worksheetGoalsMilestones} onChange={set('worksheetGoalsMilestones')} placeholder="1. 2. 3. — list your key goals and the milestones you'll use to measure progress." tall />
        <Field label="Target Market" value={d.worksheetTargetMarket} onChange={set('worksheetTargetMarket')} placeholder="Describe your target market." />
        <Field label="Industry / Competitors" value={d.worksheetIndustryCompetitors} onChange={set('worksheetIndustryCompetitors')} placeholder="1. 2. 3. — list your key competitors or industry context." tall />
        <Field label="Legal Structure / Ownership" value={d.worksheetLegalStructure} onChange={set('worksheetLegalStructure')} placeholder="Business structure and ownership information." tall />
      </Group>
    </SectionPage>
  )
}