import { SectionPage, Group, Field, Row } from '../components/Fields.jsx'

export default function SectionVI({ data, onChange }) {
  const d = data || {}
  const set = (field) => (value) => onChange && onChange({ ...d, [field]: value })

  return (
    <SectionPage title="Management & Organization" intro="No matter how strong your product or market opportunity, investors and lenders ultimately bet on people. This section introduces the team behind your business — who they are, what they bring to the table, and how you have structured the organization to succeed.">
      <Group title="1. Team Biographies">
        <Field
          label="Owner / Founder Biographies"
          hint="Provide a brief biography for each owner and key team member. Cover industry knowledge, relevant functional skills, previous business experience, and any track record navigating challenges relevant to this business."
          value={d.teamBiographiesOwners}
          onChange={set('teamBiographiesOwners')}
          placeholder="Write a few paragraphs per person. Keep it a compelling narrative, not a list of job titles."
          tall
        />
        <Field
          label="Key Employee Biographies"
          hint="If you have key employees beyond the founders, provide their relevant background here."
          value={d.teamBiographiesEmployees}
          onChange={set('teamBiographiesEmployees')}
          placeholder="Background, skills, and relevant experience for each key employee."
          tall
        />
      </Group>

      <Group title="2. Gaps and How to Address Them">
        <Field
          label="Gaps in Management or Experience"
          hint="Every founding team has gaps. What matters is that you have identified yours and have a plan to address them. Being upfront about gaps builds credibility."
          value={d.gapsManagement}
          onChange={set('gapsManagement')}
          placeholder="Identify gaps in your team's experience or skills. How will you address them — a CFO, accountant, fractional executive, sales lead, or outside representatives?"
          tall
        />
      </Group>

      <Group title="3. Advisors and Support Team">
        <Field
          label="Professional & Advisory Support Network"
          hint="Strong advisors can improve your odds of success and signal to readers that experienced people believe in what you are building. Note any relevant experience or specialization for each."
          value={d.advisorsNotes}
          onChange={set('advisorsNotes')}
          placeholder="Describe your advisory board, board of directors, consultants, mentors, and any fractional executives you work with."
          tall
        />
        <Row>
          <Field label="Attorney" type="text" value={d.advisorAttorney} onChange={set('advisorAttorney')} placeholder="Name / firm" />
          <Field label="Accountant / CPA" type="text" value={d.advisorAccountant} onChange={set('advisorAccountant')} placeholder="Name / firm" />
        </Row>
        <Row>
          <Field label="Insurance Agent" type="text" value={d.advisorInsurance} onChange={set('advisorInsurance')} placeholder="Name / agency" />
          <Field label="Banker" type="text" value={d.advisorBanker} onChange={set('advisorBanker')} placeholder="Name / bank" />
        </Row>
        <Row>
          <Field label="SCORE Mentor" type="text" value={d.advisorSCOREMentor} onChange={set('advisorSCOREMentor')} placeholder="Name" />
          <Field label="Board of Directors" type="text" value={d.advisorBoardOfDirectors} onChange={set('advisorBoardOfDirectors')} placeholder="Names / affiliations" />
        </Row>
        <Row>
          <Field label="Advisory Board" type="text" value={d.advisorAdvisoryBoard} onChange={set('advisorAdvisoryBoard')} placeholder="Names / affiliations" />
          <Field label="Consultants" type="text" value={d.advisorConsultants} onChange={set('advisorConsultants')} placeholder="Names / firms" />
        </Row>
      </Group>

      <Group title="4. Organization Chart">
        <Field
          label="Organization Structure"
          hint="Describe the structure of your business — both roles that are currently filled and positions you plan to hire for as the business grows. Even as a solo founder, mapping out your intended structure shows you have thought beyond the launch phase."
          value={d.organizationChart}
          onChange={set('organizationChart')}
          placeholder="Describe your organizational structure. Include current roles and planned future positions."
          tall
        />
      </Group>

      <Group title="Management Worksheet" hint="The Management Worksheet and Organization Chart fields below capture the detailed information recommended by the SCORE template.">
        <Field label="Owner / Founder Bios (Worksheet)" value={d.worksheetOwnerBios} onChange={set('worksheetOwnerBios')} placeholder="Detailed owner / founder biographies" tall />
        <Field label="Key Employee Bios (Worksheet)" value={d.worksheetEmployeeBios} onChange={set('worksheetEmployeeBios')} placeholder="Detailed key employee biographies" tall />
        <Field label="Gaps in Management or Experience (Worksheet)" value={d.worksheetGaps} onChange={set('worksheetGaps')} placeholder="Additional notes on management gaps" tall />
        <Field
          label="Organization Chart (Insert)"
          hint="Tools such as Lucidchart, Canva, or Microsoft SmartArt work well for creating an organization chart. Include current roles and planned future positions."
          value={d.worksheetOrgChart}
          onChange={set('worksheetOrgChart')}
          placeholder="Insert your organization chart here — include current roles and planned future positions."
          tall
        />
      </Group>
    </SectionPage>
  )
}