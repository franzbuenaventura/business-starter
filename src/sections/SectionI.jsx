import { SectionPage, Group, Field, Row } from '../components/Fields.jsx'

export default function SectionI({ data, onChange }) {
  const set = (field) => (value) => onChange && onChange({ ...(data || {}), [field]: value })

  return (
    <SectionPage title="Executive Summary" intro="Write this section last. Briefly address each area below to give readers a clear, compelling overview of your business concept, its potential, and why they should keep reading.">
      <Group title="Business Idea">
        <Field
          label="Business Idea"
          hint="A one- or two-sentence overview. What are you building, and why does it matter?"
          value={data?.businessIdea}
          onChange={set('businessIdea')}
          placeholder="What are you building, and why does it matter?"
        />
      </Group>

      <Group title="Product / Service">
        <Field
          label="Product / Service & Problem Solved"
          hint="What are you offering, and what problem does it solve for your customers?"
          value={data?.productService}
          onChange={set('productService')}
          tall
        />
      </Group>

      <Group title="Business Model">
        <Field
          label="Business Model / Revenue Streams"
          hint="How will your business make money? What are your primary revenue streams?"
          value={data?.businessModel}
          onChange={set('businessModel')}
          tall
        />
      </Group>

      <Group title="Goals">
        <Row>
          <Field label="1-Year Goals" hint="Where do you expect the business to be in one year?" value={data?.goals1Year} onChange={set('goals1Year')} tall />
          <Field label="3-Year Goals" hint="Where do you expect the business to be in three years?" value={data?.goals3Year} onChange={set('goals3Year')} tall />
          <Field label="5-Year Goals" hint="Where do you expect the business to be in five years?" value={data?.goals5Year} onChange={set('goals5Year')} tall />
        </Row>
      </Group>

      <Group title="Customer Acquisition Strategy">
        <Field
          label="Customer Acquisition Strategy"
          hint="How will you reach and attract your target customers?"
          value={data?.customerAcquisition}
          onChange={set('customerAcquisition')}
          tall
        />
      </Group>

      <Group title="Target Market">
        <Field
          label="Target Market"
          hint="Who are your ideal customers, and why are they the right audience for what you're offering?"
          value={data?.targetMarket}
          onChange={set('targetMarket')}
          tall
        />
      </Group>

      <Group title="Competition & Competitive Edge">
        <Field
          label="Competition & Competitive Edge"
          hint="Who are you up against, and what sets you apart?"
          value={data?.competition}
          onChange={set('competition')}
          tall
        />
      </Group>

      <Group title="Management Team">
        <Field
          label="Management Team Highlights"
          hint="Who's involved, and what experience or skills do they bring that will help the business succeed?"
          value={data?.managementTeam}
          onChange={set('managementTeam')}
          tall
        />
      </Group>

      <Group title="Financial Outlook">
        <Field
          label="Financial Outlook / Financing Needs"
          hint="If you're seeking financing, be specific: how much do you need, how do you plan to use it, and how will it help the business grow and become profitable?"
          value={data?.financialOutlook}
          onChange={set('financialOutlook')}
          tall
        />
      </Group>

      <Group title="Evidence of Traction">
        <Field
          label="Evidence of Traction (if any)"
          hint="Include any early sales, customer interest, partnerships, or market validation."
          value={data?.evidenceOfTraction}
          onChange={set('evidenceOfTraction')}
          tall
        />
      </Group>
    </SectionPage>
  )
}