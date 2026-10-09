import { Checkbox } from '@heroui/react'
import { SectionPage, Group, Field } from '../components/Fields.jsx'

function TextField({ label, hint, value, onChange, field }) {
  return (
    <Field label={label} hint={hint} value={value?.[field]} onChange={v => onChange({ ...value, [field]: v })} tall />
  )
}

function CheckboxItem({ label, checked, onChange, field }) {
  return (
    <Checkbox
      classNames={{ label: 'text-sm text-foreground leading-relaxed' }}
      isSelected={!!checked[field]}
      onValueChange={val => onChange({ ...checked, [field]: val })}
    >
      {label}
    </Checkbox>
  )
}

export default function SectionX({ data, onChange }) {
  const d = data || {}

  return (
    <SectionPage title="Refining the Plan" intro="Tailor your business plan for your intended audience and business type.">
      {/* ── Raising Capital from Bankers ── */}
      <Group title="Raising Capital from Bankers">
        <TextField label="Borrowing Amount and Use of Funds" hint="How much you're borrowing and exactly how you'll use the funds." value={d} onChange={onChange} field="bankers_borrowingAmount" />
        <TextField label="How Investment Will Strengthen the Business" hint="Explain how the investment will strengthen the business and its ability to repay." value={d} onChange={onChange} field="bankers_strengthenBusiness" />
        <TextField label="Proposed Repayment Terms" hint="Describe your proposed repayment terms." value={d} onChange={onChange} field="bankers_repaymentTerms" />
        <TextField label="Collateral and Existing Liens" hint="The collateral you're offering, and a full list of any existing liens against it." value={d} onChange={onChange} field="bankers_collateral" />
      </Group>

      {/* ── Raising Capital from Investors ── */}
      <Group title="Raising Capital from Investors">
        <TextField label="Capital Needed Now and in the Future" hint="How much money do you need now, and how much additional capital over the next 2-5 years?" value={d} onChange={onChange} field="investors_capitalNeeded" />
        <TextField label="Fund Deployment and Growth Plan" hint="How you'll deploy the funds and how that will drive growth." value={d} onChange={onChange} field="investors_fundDeployment" />
        <TextField label="Projected Return on Investment" hint="Projected return on investment." value={d} onChange={onChange} field="investors_projectedROI" />
        <TextField label="Exit Strategy" hint="Your exit strategy — buyback, acquisition, or IPO." value={d} onChange={onChange} field="investors_exitStrategy" />
        <TextField label="Ownership Percentage Offered" hint="The ownership percentage you're offering." value={d} onChange={onChange} field="investors_ownershipPercent" />
        <TextField label="Milestones and Conditions" hint="Any milestones or conditions you're prepared to commit to." value={d} onChange={onChange} field="investors_milestones" />
        <TextField label="Financial Reporting for Investors" hint="The financial reporting investors will receive." value={d} onChange={onChange} field="investors_financialReporting" />
        <TextField label="Investor Involvement in Governance" hint="How involved investors will be in governance or management decisions." value={d} onChange={onChange} field="investors_governanceInvolvement" />
      </Group>

      {/* ── Manufacturing Businesses ── */}
      <Group title="Manufacturing Businesses">
        <TextField label="Manufacturing Process" hint="Walk through the full manufacturing process from raw materials to finished product." value={d} onChange={onChange} field="mfg_process" />
        <TextField label="Equipment and Production Capacity" hint="Describe the equipment you'll use, including production capacity and any limitations." value={d} onChange={onChange} field="mfg_equipment" />
        <TextField label="Physical Plant and Location" hint="Where it's located, what deals you have in place, and how much it can produce." value={d} onChange={onChange} field="mfg_plant" />
        <TextField label="Specialized Labor Requirements" hint="Identify any specialized labor requirements." value={d} onChange={onChange} field="mfg_labor" />
        <TextField label="Raw Material Sourcing" hint="Explain your raw material sourcing and any special storage or handling requirements." value={d} onChange={onChange} field="mfg_rawMaterials" />
        <TextField label="Quality Control Procedures" hint="Describe your quality control procedures." value={d} onChange={onChange} field="mfg_qualityControl" />
        <TextField label="Inventory Management" hint="Explain how you plan to manage inventory levels throughout the production cycle." value={d} onChange={onChange} field="mfg_inventory" />
        <TextField label="Supply Chain" hint="Map out your supply chain, including key suppliers and any dependencies or vulnerabilities." value={d} onChange={onChange} field="mfg_supplyChain" />
        <TextField label="Products in Development" hint="Describe any products currently in development or planned for after launch." value={d} onChange={onChange} field="mfg_productsInDevelopment" />
      </Group>

      {/* ── Service Businesses ── */}
      <Group title="Service Businesses">
        <TextField label="Pricing Methodology" hint="How you set your prices and what methodology you use." value={d} onChange={onChange} field="service_pricing" />
        <TextField label="Service Delivery Systems and Processes" hint="The systems and processes that ensure consistent, high-quality service delivery." value={d} onChange={onChange} field="service_deliverySystems" />
        <TextField label="Employee Productivity" hint="How you'll measure and manage employee productivity." value={d} onChange={onChange} field="service_productivity" />
        <TextField label="Subcontracting Plans" hint="Whether you'll subcontract work, what percentage, to whom, and profit from it." value={d} onChange={onChange} field="service_subcontracting" />
        <TextField label="Credit, Payment, and Collections Policies" hint="Your credit, payment, and collections policies." value={d} onChange={onChange} field="service_creditPolicies" />
        <TextField label="Client Relationships and Long-Term Contracts" hint="How you'll build lasting client relationships and pursue long-term contracts." value={d} onChange={onChange} field="service_clientRelationships" />
        <TextField label="New Services in Development" hint="Any new services currently in development or planned for after launch." value={d} onChange={onChange} field="service_newServices" />
      </Group>

      {/* ── Retail Businesses ── */}
      <Group title="Retail Businesses">
        <TextField label="Brands and Products" hint="The specific brands or products you'll carry. Will any give you a competitive edge?" value={d} onChange={onChange} field="retail_brands" />
        <TextField label="Inventory Management" hint="How you'll manage inventory and the inventory management software you'll use." value={d} onChange={onChange} field="retail_inventoryManagement" />
        <TextField label="Payment Methods and Processing" hint="The payment methods you'll accept and the payment processing service you'll use." value={d} onChange={onChange} field="retail_paymentMethods" />
        <TextField label="Point-of-Sale System" hint="Your POS system, both hardware and software." value={d} onChange={onChange} field="retail_posSystem" />
        <TextField label="Markup and Pricing Strategy" hint="Prices should be profitable, competitive, and consistent with your brand." value={d} onChange={onChange} field="retail_pricingStrategy" />
        <TextField label="Opening Inventory Level" hint="Industry average annual inventory turnover rate vs. projected first-year COGS." value={d} onChange={onChange} field="retail_openingInventory" />
        <TextField label="Customer Service Policies" hint="Including how you'll handle returns and exchanges." value={d} onChange={onChange} field="retail_customerService" />
        <TextField label="E-Commerce Channel" hint="Whether you plan to add an e-commerce channel and/or sell on third-party marketplaces." value={d} onChange={onChange} field="retail_ecommerceChannel" />
      </Group>

      {/* ── E-Commerce Businesses ── */}
      <Group title="E-Commerce Businesses">
        <TextField label="What You're Selling" hint="Physical products, services, digital products, or a combination." value={d} onChange={onChange} field="ecom_whatSelling" />
        <TextField label="Branding and Packaging" hint="How you'll brand and package physical products." value={d} onChange={onChange} field="ecom_branding" />
        <TextField label="Sales Channels" hint="Own website, Shopify, Amazon, eBay, Etsy, or other marketplaces." value={d} onChange={onChange} field="ecom_salesChannels" />
        <TextField label="Technology Stack" hint="Web hosting, site design, shopping cart, checkout, payment processing, fulfillment, email marketing." value={d} onChange={onChange} field="ecom_techStack" />
        <TextField label="Scalability" hint="Whether your platforms can scale efficiently as your business grows or shrinks." value={d} onChange={onChange} field="ecom_scalability" />
        <TextField label="Product Sourcing" hint="Manufactured in-house, sourced from suppliers, or drop-shipped." value={d} onChange={onChange} field="ecom_productSourcing" />
        <TextField label="Returns and Exchanges Policy" hint="Your returns and exchanges policy." value={d} onChange={onChange} field="ecom_returnsPolicy" />
        <TextField label="Customer Service" hint="How you'll deliver customer service." value={d} onChange={onChange} field="ecom_customerService" />
      </Group>

      {/* ── Software and SaaS Businesses ── */}
      <Group title="Software and SaaS Businesses">
        <TextField label="Pricing Model" hint="Free trial, freemium, or paid from the start." value={d} onChange={onChange} field="saas_pricingModel" />
        <TextField label="Free-to-Paid Conversion Strategy" hint="If you offer a free tier, how will you convert users to paying customers?" value={d} onChange={onChange} field="saas_conversionStrategy" />
        <TextField label="Early Adopter / Beta User Feedback" hint="If you already have early adopters or beta users, what has been their feedback?" value={d} onChange={onChange} field="saas_betaFeedback" />
        <TextField label="Recurring Revenue and Churn Reduction" hint="How you'll structure contracts or incentives to drive recurring revenue and reduce churn." value={d} onChange={onChange} field="saas_recurringRevenue" />
        <TextField label="Staying Competitive" hint="How you'll stay competitive as technology, customer needs, and market conditions shift." value={d} onChange={onChange} field="saas_competitiveStrategy" />
        <TextField label="Development Approach and IP Strategy" hint="In-house or outsourced development, and your IP ownership strategy." value={d} onChange={onChange} field="saas_development" />
        <TextField label="Customer Support Model" hint="Your customer support model." value={d} onChange={onChange} field="saas_customerSupport" />
        <TextField label="Attracting and Retaining Technical Talent" hint="How you'll attract, retain, and compensate key technical talent." value={d} onChange={onChange} field="saas_talent" />
        <TextField label="Proprietary Technology / Intellectual Property" hint="Any proprietary technology or IP that gives you a competitive edge." value={d} onChange={onChange} field="saas_ip" />
        <TextField label="Product Roadmap" hint="Updates, features, or new products planned for after launch." value={d} onChange={onChange} field="saas_roadmap" />
        <TextField label="Key Metrics" hint="MRR, ARR, CAC, LTV, churn rate, and other key metrics you'll track." value={d} onChange={onChange} field="saas_keyMetrics" />
      </Group>

      {/* ── Final Steps ── */}
      <Group title="Final Steps">
        <div className="flex flex-col gap-3 mb-6">
          <CheckboxItem label="Proofread carefully — or ask someone else to review your plan for errors, clarity, and logical consistency." checked={d} onChange={onChange} field="final_proofread" />
          <CheckboxItem label="Verify that every financial figure is accurate and that all assumptions are documented." checked={d} onChange={onChange} field="final_verifyFinancials" />
          <CheckboxItem label="Tailor the plan for your intended audience using the guidance in this section above." checked={d} onChange={onChange} field="final_tailorAudience" />
          <CheckboxItem label="Save as a PDF for sharing digitally or print for in-person presentations." checked={d} onChange={onChange} field="final_saveAsPDF" />
        </div>
        <div className="text-sm text-foreground-600 bg-content2 border border-divider rounded-xl px-4 py-3 leading-relaxed">
          <strong>Next Step:</strong> Go back to the beginning and complete the Executive Summary. After working through all sections, you'll have a much clearer picture of your business concept and be better positioned to summarize it effectively. Consider working with a free SCORE mentor to stress-test your assumptions and refine your strategy.
        </div>
      </Group>
    </SectionPage>
  )
}