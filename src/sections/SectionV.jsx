import { useState, useEffect } from 'react'
import { SectionPage, Group, Field, Row, CellInput, SubTitle } from '../components/Fields.jsx'

const INSURANCE_TYPES = [
  'General Liability',
  'Commercial Property',
  'Business Owners Policy (BOP)',
  'Professional Liability / E&O',
  "Workers' Compensation",
  'Commercial Auto',
  'Cyber Liability',
  'Surety Bond',
  'Liquor Liability',
  'EPLI',
  'Home-Based Business Rider',
  'Other:',
]

function emptyInsuranceRow() {
  return { required: 'No', annualPremium: '', monthlyCost: '', provider: '', notes: '' }
}

function defaultData() {
  return {
    // 1. Production
    productionProcess: '',
    productionMethods: '',
    unitEconomics: '',
    // 2. Quality Control
    qualityControl: '',
    // 3. Commercial Space
    commercialSpaceSize: '',
    commercialSpaceType: '',
    commercialZoning: '',
    commercialAccessibility: '',
    commercialCosts: '',
    // 4. Home-Based Location
    homeBasedLocation: '',
    homeBasedDedicatedSpace: '',
    homeBasedZoningCompliance: '',
    homeBasedLeaseConstraints: '',
    homeBasedStorage: '',
    homeBasedOrderFulfillment: '',
    homeBasedSuppliers: '',
    homeBasedHardware: '',
    homeBasedSoftware: '',
    homeBasedConnectivity: '',
    homeBasedProductionStages: '',
    homeBasedQualityControl: '',
    homeBasedCapacityScalability: '',
    homeBasedLogistics: '',
    homeBasedBusinessInsurance: '',
    homeBasedDataSecurity: '',
    homeBasedLicenses: '',
    // 5. Legal Environment
    legalLicensesPermits: '',
    legalIP: '',
    legalInsurance: '',
    legalRegulations: '',
    legalIndustrySpecific: '',
    legalBonding: '',
    // 6. Insurance Coverage
    insuranceAgentName: '',
    insuranceAgencyName: '',
    insurancePhone: '',
    insuranceEmail: '',
    insuranceWebsite: '',
    insuranceRows: INSURANCE_TYPES.map(() => emptyInsuranceRow()),
    totalAnnualInsuranceCost: '',
    riskAssessmentNotes: '',
    // 7. Personnel
    personnelRoles: '',
    personnelHeadcount: '',
    personnelContractors: '',
    personnelJobDescriptions: '',
    personnelPayStructure: '',
    personnelRecruiting: '',
    personnelTraining: '',
    // 8. Inventory
    inventoryTypes: '',
    inventoryValue: '',
    inventoryTurnover: '',
    inventorySeasonality: '',
    inventoryLeadTime: '',
    inventoryTools: '',
    // 9. Suppliers
    suppliersDetails: '',
    suppliersDisruptions: '',
    suppliersBackup: '',
    suppliersCostFluctuation: '',
    suppliersPaymentTerms: '',
    // 10. Credit Policies
    creditIndustryStandard: '',
    creditAmountCriteria: '',
    creditAssessment: '',
    creditTerms: '',
    creditCosts: '',
    creditCollections: '',
  }
}

export default function SectionV({ data, onChange }) {
  const [d, setD] = useState(null)

  useEffect(() => {
    setD(data && typeof data === 'object' && Object.keys(data).length > 0
      ? { ...defaultData(), ...data }
      : { ...defaultData() })
  }, [data])

  function set(field, value) {
    const next = { ...d, [field]: value }
    setD(next)
    onChange(next)
  }

  function setInsuranceRow(i, subfield, value) {
    const rows = d.insuranceRows.map((r, idx) =>
      idx === i ? { ...r, [subfield]: value } : r
    )
    set('insuranceRows', rows)
  }

  if (!d) return null

  return (
    <SectionPage title="Operational Plan" intro="Complete each section below to build your Operational Plan. The template instructions provide guidance for each topic.">
      {/* ==================== 1. PRODUCTION ==================== */}
      <Group title="Production" number="1">
        <Field label="Production / Delivery Process" hint="Describe how you will produce your product or deliver your service. Walk through your process from start to finish." value={d.productionProcess} onChange={v => set('productionProcess', v)} placeholder="Step-by-step description of how you produce your product or deliver your service..." />
        <Field label="Methods, Equipment & Technology" hint="What methods, equipment, or technology will you use in production or delivery?" value={d.productionMethods} onChange={v => set('productionMethods', v)} placeholder="Manufacturing equipment, software, tools, technology platforms..." />
        <Field label="Unit Economics" hint="What does it cost to produce one unit, fulfill one order, or deliver one engagement? Understanding your unit economics is essential for a sustainable business model." value={d.unitEconomics} onChange={v => set('unitEconomics', v)} placeholder="Cost per unit, cost per order, cost per engagement — break down the components..." />
      </Group>

      {/* ==================== 2. QUALITY CONTROL ==================== */}
      <Group title="Quality Control" number="2">
        <Field label="Quality Control Systems" hint="How will you ensure consistency in what you deliver? Describe systems and procedures for monitoring quality — production checks, customer feedback loops, service standards, or technology-assisted monitoring." value={d.qualityControl} onChange={v => set('qualityControl', v)} placeholder="Production checks, customer feedback loops, service standards, technology-assisted monitoring..." />
      </Group>

      {/* ==================== 3. COMMERCIAL SPACE ==================== */}
      <Group title="Commercial Space" number="3">
        <Field label="Size of the Space" type="text" value={d.commercialSpaceSize} onChange={v => set('commercialSpaceSize', v)} placeholder="e.g. 2,000 sq ft" />
        <Field label="Type of Building" hint="Retail, industrial, commercial, office, home-based, etc." type="text" value={d.commercialSpaceType} onChange={v => set('commercialSpaceType', v)} placeholder="e.g. Retail storefront, industrial warehouse, office suite" />
        <Field label="Zoning Requirements & Restrictions" value={d.commercialZoning} onChange={v => set('commercialZoning', v)} placeholder="Zoning requirements and any restrictions that apply..." />
        <Field label="Accessibility" hint="Accessibility for customers, employees, suppliers, delivery or transportation needs." value={d.commercialAccessibility} onChange={v => set('commercialAccessibility', v)} placeholder="Accessibility for customers, employees, suppliers, transportation..." />
        <Field label="Associated Costs" hint="Rent, utilities, insurance, maintenance, buildout or renovation expenses." value={d.commercialCosts} onChange={v => set('commercialCosts', v)} placeholder="Rent, utilities, insurance, maintenance, buildout/renovation expenses..." />
      </Group>

      {/* ==================== 4. HOME-BASED LOCATION ==================== */}
      <Group title="Home-Based Location" number="4">
        <Field label="Home-Based Business? (Overview)" hint="If your business operates from home, describe the overall arrangement and why it suits your needs." value={d.homeBasedLocation} onChange={v => set('homeBasedLocation', v)} placeholder="Describe your home-based setup and why it works for your business..." />

        <SubTitle>Physical Location & Zoning</SubTitle>
        <Field label="Dedicated Space" hint="Describe the specific area of your home used for business (e.g., a 200 sq ft converted garage or a dedicated office)." type="text" value={d.homeBasedDedicatedSpace} onChange={v => set('homeBasedDedicatedSpace', v)} placeholder="e.g. 200 sq ft converted garage / dedicated home office" />
        <Field label="Zoning Compliance" hint="Indicate that you're in compliance with local zoning laws. Check with your HOA to ensure you're not violating any CC&Rs." value={d.homeBasedZoningCompliance} onChange={v => set('homeBasedZoningCompliance', v)} placeholder="Confirmation of compliance with local zoning laws and HOA CC&Rs..." />
        <Field label="Lease / Mortgage Constraints" hint="If you're a renter, make sure you have your landlord's permission to operate a business." value={d.homeBasedLeaseConstraints} onChange={v => set('homeBasedLeaseConstraints', v)} placeholder="Landlord permission, lease restrictions, mortgage considerations..." />

        <SubTitle>Supply Chain & Inventory Management</SubTitle>
        <Field label="Storage Solutions" hint="How will you store raw materials or finished goods? Mention climate control if necessary." value={d.homeBasedStorage} onChange={v => set('homeBasedStorage', v)} placeholder="Storage space, climate control, organization..." />
        <Field label="Order Fulfillment" hint="Detail the process from receiving an order to shipping it. Which carriers will you use (USPS, UPS, FedEx)? Do you have a scheduled pickup or drop-off arrangement?" value={d.homeBasedOrderFulfillment} onChange={v => set('homeBasedOrderFulfillment', v)} placeholder="Order processing, packaging, carriers, pickup/drop-off arrangements..." />
        <Field label="Suppliers (Home-Based)" hint="List your primary vendors and backup options to prove your business can survive a supply chain disruption." value={d.homeBasedSuppliers} onChange={v => set('homeBasedSuppliers', v)} placeholder="Primary vendors and backup suppliers..." />

        <SubTitle>Technology & Equipment</SubTitle>
        <Field label="Hardware" hint="List essential equipment such as high-spec computers, 3D printers, industrial sewing machines, or specialized kitchen appliances." value={d.homeBasedHardware} onChange={v => set('homeBasedHardware', v)} placeholder="Computers, printers, specialized equipment..." />
        <Field label="Software" hint="Identify your core tools for project management, CRM, and accounting." value={d.homeBasedSoftware} onChange={v => set('homeBasedSoftware', v)} placeholder="Project management, CRM, accounting, design tools..." />
        <Field label="Connectivity / Internet Redundancy" hint="If your home Wi-Fi goes down, do you have a 5G backup or a local co-working space as a fallback?" value={d.homeBasedConnectivity} onChange={v => set('homeBasedConnectivity', v)} placeholder="Internet backup plan, 5G hotspot, co-working space fallback..." />

        <SubTitle>Workflow & Production</SubTitle>
        <Field label="Production Stages" hint="Break down the steps involved in creating your product or delivering your service." value={d.homeBasedProductionStages} onChange={v => set('homeBasedProductionStages', v)} placeholder="Step-by-step production stages..." />
        <Field label="Quality Control (Home-Based)" hint="How do you ensure every deliverable meets your standards before it leaves your home?" value={d.homeBasedQualityControl} onChange={v => set('homeBasedQualityControl', v)} placeholder="Home-based quality checks and standards..." />
        <Field label="Capacity & Scalability" hint="What is the maximum volume you can produce in your current space? Identify triggers that would require moving to a commercial space or using a 3PL provider." value={d.homeBasedCapacityScalability} onChange={v => set('homeBasedCapacityScalability', v)} placeholder="Maximum production volume, triggers for scaling up, 3PL considerations..." />
        <Field label="Logistics (Mail & Shipping)" hint="How will you handle incoming professional mail? (e.g., a P.O. Box vs. home address)" value={d.homeBasedLogistics} onChange={v => set('homeBasedLogistics', v)} placeholder="P.O. Box, home address, virtual mailbox..." />

        <SubTitle>Risk Management</SubTitle>
        <Field label="Business Insurance (Home-Based)" hint="Specify that you have a home-based business rider or a separate commercial general liability policy (standard homeowners or renters policies rarely cover business liabilities)." value={d.homeBasedBusinessInsurance} onChange={v => set('homeBasedBusinessInsurance', v)} placeholder="Business insurance rider, general liability policy..." />
        <Field label="Data Security" hint="If you handle client data, describe how you will protect sensitive information: encryption, secure backups, and VPN usage." value={d.homeBasedDataSecurity} onChange={v => set('homeBasedDataSecurity', v)} placeholder="Encryption, backups, VPN, data protection measures..." />
        <Field label="Licenses (Home-Based)" hint="List any required professional or local business licenses." value={d.homeBasedLicenses} onChange={v => set('homeBasedLicenses', v)} placeholder="Required licenses and permits for home-based business..." />
      </Group>

      {/* ==================== 5. LEGAL ENVIRONMENT ==================== */}
      <Group title="Legal Environment" number="5">
        <Field label="Licenses & Permits" hint="Licenses and permits required to operate, and whether you've already obtained them." value={d.legalLicensesPermits} onChange={v => set('legalLicensesPermits', v)} placeholder="Required licenses, permits, and current status..." />
        <Field label="Trademarks, Copyrights & Patents" hint="Trademarks, copyrights, or patents you hold or have applied for." value={d.legalIP} onChange={v => set('legalIP', v)} placeholder="IP protection you hold or have applied for..." />
        <Field label="Insurance Coverage (Legal)" hint="Insurance coverage required and estimated costs." value={d.legalInsurance} onChange={v => set('legalInsurance', v)} placeholder="Required insurance coverage and estimated costs..." />
        <Field label="Environmental, Health & Safety Regulations" hint="Environmental, health, or workplace safety regulations that apply to your business." value={d.legalRegulations} onChange={v => set('legalRegulations', v)} placeholder="Environmental, health, and safety regulations that apply..." />
        <Row>
          <Field label="Industry-Specific Regulations" value={d.legalIndustrySpecific} onChange={v => set('legalIndustrySpecific', v)} placeholder="Industry-specific compliance requirements..." />
          <Field label="Bonding Requirements" value={d.legalBonding} onChange={v => set('legalBonding', v)} placeholder="Bonding requirements, if applicable..." />
        </Row>
      </Group>

      {/* ==================== 6. INSURANCE COVERAGE ==================== */}
      <Group title="Insurance Coverage" number="6">
        <SubTitle>Insurance Agent / Broker</SubTitle>
        <Row>
          <Field label="Agent / Broker Name" type="text" value={d.insuranceAgentName} onChange={v => set('insuranceAgentName', v)} placeholder="Agent name" />
          <Field label="Agency Name" type="text" value={d.insuranceAgencyName} onChange={v => set('insuranceAgencyName', v)} placeholder="Agency name" />
        </Row>
        <Row cols={3}>
          <Field label="Phone" type="text" value={d.insurancePhone} onChange={v => set('insurancePhone', v)} placeholder="Phone number" />
          <Field label="Email" type="text" value={d.insuranceEmail} onChange={v => set('insuranceEmail', v)} placeholder="Email address" />
          <Field label="Website" type="text" value={d.insuranceWebsite} onChange={v => set('insuranceWebsite', v)} placeholder="Website URL" />
        </Row>

        <Field label="Insurance Coverage Worksheet" hint="Document your coverage, premiums, and contacts. Include this information in the body of your plan." />
        <div className="overflow-x-auto mb-5 rounded-xl border border-divider">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-content2">
                <th className="border-b border-divider px-2 py-2 text-left font-semibold">Coverage Type</th>
                <th className="border-b border-divider px-1.5 py-2 text-center font-semibold w-16">Required?</th>
                <th className="border-b border-divider px-1.5 py-2 text-center font-semibold w-20">Annual Premium ($)</th>
                <th className="border-b border-divider px-1.5 py-2 text-center font-semibold w-20">Monthly Cost ($)</th>
                <th className="border-b border-divider px-1.5 py-2 text-left font-semibold">Provider / Carrier</th>
                <th className="border-b border-divider px-1.5 py-2 text-left font-semibold">Notes / Status</th>
              </tr>
            </thead>
            <tbody>
              {d.insuranceRows.map((row, i) => (
                <tr key={i} className="border-b border-divider last:border-b-0">
                  <td className="px-2 py-1 font-semibold">{INSURANCE_TYPES[i]}</td>
                  <td className="px-1 py-1">
                    <select
                      className="w-full bg-transparent px-1 py-1 rounded text-xs outline-none border border-transparent focus:border-primary cursor-pointer text-foreground"
                      value={row.required}
                      onChange={e => setInsuranceRow(i, 'required', e.target.value)}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </td>
                  <td className="px-1 py-1">
                    <CellInput type="number" align="right" value={row.annualPremium} onChange={v => setInsuranceRow(i, 'annualPremium', v)} placeholder="$" />
                  </td>
                  <td className="px-1 py-1">
                    <CellInput type="number" align="right" value={row.monthlyCost} onChange={v => setInsuranceRow(i, 'monthlyCost', v)} placeholder="$" />
                  </td>
                  <td className="px-1.5 py-1">
                    <CellInput value={row.provider} onChange={v => setInsuranceRow(i, 'provider', v)} placeholder="Carrier name" />
                  </td>
                  <td className="px-1.5 py-1">
                    <CellInput value={row.notes} onChange={v => setInsuranceRow(i, 'notes', v)} placeholder="Status / notes" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Row>
          <Field label="Total Annual Insurance Cost ($)" type="number" min="0" step="100" value={d.totalAnnualInsuranceCost} onChange={v => set('totalAnnualInsuranceCost', v)} placeholder="e.g. 5000" />
          <Field label="Risk Assessment Notes" value={d.riskAssessmentNotes} onChange={v => set('riskAssessmentNotes', v)} placeholder="Risk assessment analysis..." />
        </Row>
      </Group>

      {/* ==================== 7. PERSONNEL ==================== */}
      <Group title="Personnel" number="7">
        <Field label="Key Roles & Requirements" hint="What roles do you need, and are there any licensing, certification, or educational requirements?" value={d.personnelRoles} onChange={v => set('personnelRoles', v)} placeholder="Key roles needed and their licensing/certification/education requirements..." />
        <Row>
          <Field label="Headcount at Launch" hint="How many employees will you need at launch, and how might that change over time?" value={d.personnelHeadcount} onChange={v => set('personnelHeadcount', v)} placeholder="e.g. 2 full-time at launch, growing to 8 by year 3" />
          <Field label="Freelancers / Contractors" hint="Will you use freelancers, independent contractors, or gig workers?" value={d.personnelContractors} onChange={v => set('personnelContractors', v)} placeholder="Freelancers, contractors, or gig workers and their roles..." />
        </Row>
        <Field label="Job Descriptions" hint="What does each role involve? Include brief job descriptions." value={d.personnelJobDescriptions} onChange={v => set('personnelJobDescriptions', v)} placeholder="Brief job descriptions for each role..." />
        <Row>
          <Field label="Pay Structure" hint="Hourly, salaried, commission-based, or a combination?" value={d.personnelPayStructure} onChange={v => set('personnelPayStructure', v)} placeholder="Salary ranges, hourly rates, commission structures..." />
          <Field label="Recruiting & Hiring" hint="How will you find and recruit qualified people?" value={d.personnelRecruiting} onChange={v => set('personnelRecruiting', v)} placeholder="Job boards, recruiters, networks, hiring process..." />
        </Row>
        <Field label="Training" hint="What training will new employees need, and how will you deliver it?" value={d.personnelTraining} onChange={v => set('personnelTraining', v)} placeholder="Onboarding, ongoing training, certifications..." />
      </Group>

      {/* ==================== 8. INVENTORY ==================== */}
      <Group title="Inventory" number="8">
        <Field label="Inventory Types & Storage" hint="What types of inventory will you keep on hand — raw materials, supplies, work-in-progress, or finished products — and where will you store them?" value={d.inventoryTypes} onChange={v => set('inventoryTypes', v)} placeholder="Types of inventory and storage locations..." />
        <Field label="Estimated Average Inventory Value ($)" type="number" min="0" step="100" value={d.inventoryValue} onChange={v => set('inventoryValue', v)} placeholder="e.g. 25000" />
        <Row>
          <Field label="Inventory Turnover Rate" hint="What inventory turnover rate do you expect, and how does that compare to industry averages?" value={d.inventoryTurnover} onChange={v => set('inventoryTurnover', v)} placeholder="Expected turnover rate and industry comparison..." />
          <Field label="Seasonal Fluctuations" hint="Are there seasonal fluctuations in demand that will require you to stock up at certain times of year?" value={d.inventorySeasonality} onChange={v => set('inventorySeasonality', v)} placeholder="Seasonal demand patterns and inventory planning..." />
        </Row>
        <Row>
          <Field label="Lead Time for Ordering" hint="What is your typical lead time for ordering inventory?" value={d.inventoryLeadTime} onChange={v => set('inventoryLeadTime', v)} placeholder="e.g. 2-3 weeks from order to delivery" />
          <Field label="Inventory Management Tools" hint="What inventory management tools or software will you use?" value={d.inventoryTools} onChange={v => set('inventoryTools', v)} placeholder="Software, spreadsheets, tracking systems..." />
        </Row>
      </Group>

      {/* ==================== 9. SUPPLIERS ==================== */}
      <Group title="Suppliers" number="9">
        <Field label="Key Supplier Details" hint="For each key supplier, provide: name, address, website, what they supply and in what quantities, their credit and delivery terms, and their track record for reliability and consistency." value={d.suppliersDetails} onChange={v => set('suppliersDetails', v)} placeholder="Supplier names, addresses, products, quantities, terms, reliability..." />
        <Field label="Supply Shortages & Disruptions" hint="Do you anticipate any supply shortages or delivery disruptions, and if so, how will you handle them?" value={d.suppliersDisruptions} onChange={v => set('suppliersDisruptions', v)} placeholder="Anticipated disruptions and contingency plans..." />
        <Row>
          <Field label="Backup Suppliers" hint="Identify backup suppliers to mitigate single-source dependency risk." value={d.suppliersBackup} onChange={v => set('suppliersBackup', v)} placeholder="Backup suppliers and alternatives..." />
          <Field label="Cost Fluctuation Management" hint="Are input costs likely to remain stable or fluctuate? How will you manage cost increases?" value={d.suppliersCostFluctuation} onChange={v => set('suppliersCostFluctuation', v)} placeholder="Cost stability, hedging, pass-through strategies..." />
        </Row>
        <Field label="Supplier Payment Terms & Cash Flow Impact" hint="How do payment terms affect your cash flow?" value={d.suppliersPaymentTerms} onChange={v => set('suppliersPaymentTerms', v)} placeholder="Payment terms and their impact on cash flow..." />
      </Group>

      {/* ==================== 10. CREDIT POLICIES ==================== */}
      <Group title="Credit Policies" number="10">
        <Field label="Industry Practice & Customer Expectations" hint="Is offering credit standard practice in your industry? Do customers expect it?" value={d.creditIndustryStandard} onChange={v => set('creditIndustryStandard', v)} placeholder="Industry norms around extending credit..." />
        <Row>
          <Field label="Credit Amount & Eligibility Criteria" hint="How much credit will you extend, and what criteria will you use to determine eligibility?" value={d.creditAmountCriteria} onChange={v => set('creditAmountCriteria', v)} placeholder="Credit limits and eligibility criteria..." />
          <Field label="Creditworthiness Assessment" hint="How will you assess a new customer's creditworthiness — credit checks, trade references, or payment history?" value={d.creditAssessment} onChange={v => set('creditAssessment', v)} placeholder="Methods for assessing creditworthiness..." />
        </Row>
        <Row>
          <Field label="Credit Terms" hint="What terms will you offer: net 30, net 60, early payment discounts?" value={d.creditTerms} onChange={v => set('creditTerms', v)} placeholder="e.g. Net 30, early payment discount of 2% if paid within 10 days" />
          <Field label="Cost of Offering Credit" hint="What does it cost you to offer credit, and have you built those costs into your pricing?" value={d.creditCosts} onChange={v => set('creditCosts', v)} placeholder="Costs of extending credit and how they're factored into pricing..." />
        </Row>
        <Field label="Collections & Non-Payment Handling" hint="How will you handle slow or non-paying customers?" value={d.creditCollections} onChange={v => set('creditCollections', v)} placeholder="Collections process, late fees, escalation procedures..." />
      </Group>
    </SectionPage>
  )
}