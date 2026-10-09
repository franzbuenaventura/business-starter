import { SectionPage, Group, Field, Row } from '../components/Fields.jsx'

export default function SectionIII({ data, onChange }) {
  const d = data || {}
  const set = (field) => (value) => onChange && onChange({ ...d, [field]: value })

  return (
    <SectionPage title="Products & Services" intro="This section builds on what you introduced in the Executive Summary and Company Description. Here you'll go deeper — explaining exactly what you plan to offer, why it matters to customers, and what makes it competitive.">
      <Group title="1. What You Offer">
        <Field
          label="Product / Service Description"
          hint="What are you selling, how is it made or delivered?"
          value={d.whatYouOffer}
          onChange={set('whatYouOffer')}
          placeholder="Describe your product or service in detail. What are you selling, how is it made or delivered?"
          tall
        />
        <Field
          label="Key Relationships (Suppliers, Manufacturers, Partners)"
          value={d.keyRelationships}
          onChange={set('keyRelationships')}
          placeholder="Describe relationships with suppliers, manufacturers, technology partners, or service providers that are critical to your business."
        />
      </Group>

      <Group title="2. The Problem You Solve">
        <Field
          label="Problem Definition"
          value={d.problemDefinition}
          onChange={set('problemDefinition')}
          placeholder="What real problem does your business solve for a specific group of customers?"
        />
        <Field
          label="How Your Solution Addresses the Problem"
          value={d.howSolutionAddresses}
          onChange={set('howSolutionAddresses')}
          placeholder="How does your product or service address the problem described above?"
        />
        <Field
          label="Key Benefits & Features"
          value={d.benefitsFeatures}
          onChange={set('benefitsFeatures')}
          placeholder="What are the key benefits and features of your offering?"
        />
        <Field
          label="Unique Selling Proposition (USP)"
          value={d.usp}
          onChange={set('usp')}
          placeholder="Why would a customer choose you over the competition? Better experience, lower price, underserved segment, or something else?"
        />
      </Group>

      <Group title="3. Your Competitive Advantage">
        <Field
          label="Proprietary Features"
          value={d.proprietaryFeatures}
          onChange={set('proprietaryFeatures')}
          placeholder="Describe any proprietary features that strengthen your position."
        />
        <Row>
          <Field label="Patents" value={d.patents} onChange={set('patents')} placeholder="Patents or patent-pending products" />
          <Field label="Licenses" value={d.licenses} onChange={set('licenses')} placeholder="Licenses for products, technology, or services" />
        </Row>
        <Field
          label="Exclusive Agreements"
          value={d.exclusiveAgreements}
          onChange={set('exclusiveAgreements')}
          placeholder="Exclusive agreements with suppliers, vendors, or distributors."
        />
        <Field
          label="Intellectual Property, Trade Secrets & Other Protections"
          value={d.ipTradeSecrets}
          onChange={set('ipTradeSecrets')}
          placeholder="Describe any intellectual property, trade secrets, or other formal protections."
        />
      </Group>

      <Group title="4. Your Pricing Strategy">
        <Field
          label="Pricing Model"
          value={d.pricingModel}
          onChange={set('pricingModel')}
          placeholder="One-time purchase, subscription, retainer, lease, fee-for-service, or other structure."
        />
        <Row>
          <Field label="Competitive Positioning" type="text" value={d.competitivePositioning} onChange={set('competitivePositioning')} placeholder="e.g., Low-end, mid-range, premium" />
          <Field label="Projected Profit Margin" type="text" value={d.projectedProfitMargin} onChange={set('projectedProfitMargin')} placeholder="e.g., 40%" />
        </Row>
        <Field
          label="Positioning Rationale"
          value={d.positioningRationale}
          onChange={set('positioningRationale')}
          placeholder="Why does this positioning make sense for your target customer, and how does it support growth?"
        />
        <Field
          label="Margin Rationale"
          value={d.marginRationale}
          onChange={set('marginRationale')}
          placeholder="Describe the thinking behind your projected profit margin."
        />
      </Group>

      <Group title="Product & Service Description Worksheet" hint="The worksheet below covers additional details commonly included in a SCORE business plan.">
        <Row>
          <Field label="Business Name" type="text" value={d.worksheetBusinessName} onChange={set('worksheetBusinessName')} placeholder="Your business name" />
          <Field label="Product / Service Idea" type="text" value={d.worksheetProductIdea} onChange={set('worksheetProductIdea')} placeholder="Brief idea summary" />
        </Row>
        <Row>
          <Field label="Special Benefits" value={d.worksheetSpecialBenefits} onChange={set('worksheetSpecialBenefits')} placeholder="What special benefits does your offering provide?" />
          <Field label="Unique Features" value={d.worksheetUniqueFeatures} onChange={set('worksheetUniqueFeatures')} placeholder="What unique features set it apart?" />
        </Row>
        <Field label="Limits and Liabilities" value={d.worksheetLimitsLiabilities} onChange={set('worksheetLimitsLiabilities')} placeholder="Any limitations or liabilities associated with your product or service?" />
        <Row>
          <Field label="Production and Delivery" value={d.worksheetProductionDelivery} onChange={set('worksheetProductionDelivery')} placeholder="How is your product produced and delivered?" />
          <Field label="Suppliers" value={d.worksheetSuppliers} onChange={set('worksheetSuppliers')} placeholder="Key suppliers and their role" />
        </Row>
        <Field label="Intellectual Property / Special Permits" value={d.worksheetIPPermits} onChange={set('worksheetIPPermits')} placeholder="Intellectual property, special permits, or regulatory approvals needed." />
        <Field
          label="Product / Service Description (Extended)"
          value={d.worksheetExtendedDescription}
          onChange={set('worksheetExtendedDescription')}
          placeholder="Provide a comprehensive description of your product or service."
          tall
        />
      </Group>
    </SectionPage>
  )
}