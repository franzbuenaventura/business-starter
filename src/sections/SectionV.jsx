import { useState, useEffect } from 'react'

const styles = {
  container: {
    maxWidth: 800,
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.6,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 32,
    marginBottom: 16,
    paddingBottom: 6,
    borderBottom: '2px solid #0066cc',
    color: '#111',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginTop: 20,
    marginBottom: 12,
    color: '#333',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d0d0d0',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d0d0d0',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.6,
    resize: 'vertical',
    boxSizing: 'border-box',
    minHeight: 80,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  row3: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 16,
  },
  row4: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: 12,
  },
  chipGroup: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    padding: '6px 14px',
    border: '2px solid #d0d0d0',
    borderRadius: 20,
    fontSize: 13,
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.15s',
  },
  chipActive: {
    padding: '6px 14px',
    border: '2px solid #0066cc',
    borderRadius: 20,
    fontSize: 13,
    cursor: 'pointer',
    background: '#f0f7ff',
    fontWeight: 600,
    transition: 'all 0.15s',
  },
  insuranceTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 20,
  },
  insuranceTh: {
    border: '1px solid #ddd',
    padding: '6px 4px',
    background: '#f5f5f5',
    fontWeight: 600,
    fontSize: 11,
    textAlign: 'center',
  },
  insuranceTd: {
    border: '1px solid #ddd',
    padding: '4px',
  },
  insuranceInput: {
    width: '100%',
    padding: '4px 2px',
    border: '1px solid transparent',
    borderRadius: 3,
    fontSize: 12,
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box',
    outline: 'none',
  },
  insuranceInputFocused: {
    border: '1px solid #0066cc',
  },
}

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
  const [focusedCell, setFocusedCell] = useState(null)

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

  function focusStyle(key) {
    return focusedCell === key ? { ...styles.insuranceInput, ...styles.insuranceInputFocused } : styles.insuranceInput
  }

  if (!d) return null

  return (
    <div style={styles.container}>
      <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
        Complete each section below to build your Operational Plan. The template instructions provide guidance for each topic.
      </p>

      {/* ==================== 1. PRODUCTION ==================== */}
      <h2 style={styles.sectionHeading}>1. Production</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Production / Delivery Process</label>
        <div style={styles.hint}>Describe how you will produce your product or deliver your service. Walk through your process from start to finish.</div>
        <textarea style={styles.textarea} rows={4} value={d.productionProcess} onChange={e => set('productionProcess', e.target.value)} placeholder="Step-by-step description of how you produce your product or deliver your service..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Methods, Equipment &amp; Technology</label>
        <div style={styles.hint}>What methods, equipment, or technology will you use in production or delivery?</div>
        <textarea style={styles.textarea} rows={3} value={d.productionMethods} onChange={e => set('productionMethods', e.target.value)} placeholder="Manufacturing equipment, software, tools, technology platforms..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Unit Economics</label>
        <div style={styles.hint}>What does it cost to produce one unit, fulfill one order, or deliver one engagement? Understanding your unit economics is essential for a sustainable business model.</div>
        <textarea style={styles.textarea} rows={3} value={d.unitEconomics} onChange={e => set('unitEconomics', e.target.value)} placeholder="Cost per unit, cost per order, cost per engagement — break down the components..." />
      </div>

      {/* ==================== 2. QUALITY CONTROL ==================== */}
      <h2 style={styles.sectionHeading}>2. Quality Control</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Quality Control Systems</label>
        <div style={styles.hint}>How will you ensure consistency in what you deliver? Describe systems and procedures for monitoring quality — production checks, customer feedback loops, service standards, or technology-assisted monitoring.</div>
        <textarea style={styles.textarea} rows={4} value={d.qualityControl} onChange={e => set('qualityControl', e.target.value)} placeholder="Production checks, customer feedback loops, service standards, technology-assisted monitoring..." />
      </div>

      {/* ==================== 3. COMMERCIAL SPACE ==================== */}
      <h2 style={styles.sectionHeading}>3. Commercial Space</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Size of the Space</label>
        <input style={styles.input} value={d.commercialSpaceSize} onChange={e => set('commercialSpaceSize', e.target.value)} placeholder="e.g. 2,000 sq ft" />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Type of Building</label>
        <div style={styles.hint}>Retail, industrial, commercial, office, home-based, etc.</div>
        <input style={styles.input} value={d.commercialSpaceType} onChange={e => set('commercialSpaceType', e.target.value)} placeholder="e.g. Retail storefront, industrial warehouse, office suite" />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Zoning Requirements &amp; Restrictions</label>
        <textarea style={styles.textarea} rows={2} value={d.commercialZoning} onChange={e => set('commercialZoning', e.target.value)} placeholder="Zoning requirements and any restrictions that apply..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Accessibility</label>
        <div style={styles.hint}>Accessibility for customers, employees, suppliers, delivery or transportation needs.</div>
        <textarea style={styles.textarea} rows={2} value={d.commercialAccessibility} onChange={e => set('commercialAccessibility', e.target.value)} placeholder="Accessibility for customers, employees, suppliers, transportation..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Associated Costs</label>
        <div style={styles.hint}>Rent, utilities, insurance, maintenance, buildout or renovation expenses.</div>
        <textarea style={styles.textarea} rows={3} value={d.commercialCosts} onChange={e => set('commercialCosts', e.target.value)} placeholder="Rent, utilities, insurance, maintenance, buildout/renovation expenses..." />
      </div>

      {/* ==================== 4. HOME-BASED LOCATION ==================== */}
      <h2 style={styles.sectionHeading}>4. Home-Based Location</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Home-Based Business? (Overview)</label>
        <div style={styles.hint}>If your business operates from home, describe the overall arrangement and why it suits your needs.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedLocation} onChange={e => set('homeBasedLocation', e.target.value)} placeholder="Describe your home-based setup and why it works for your business..." />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>Physical Location &amp; Zoning</p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Dedicated Space</label>
        <div style={styles.hint}>Describe the specific area of your home used for business (e.g., a 200 sq ft converted garage or a dedicated office).</div>
        <input style={styles.input} value={d.homeBasedDedicatedSpace} onChange={e => set('homeBasedDedicatedSpace', e.target.value)} placeholder="e.g. 200 sq ft converted garage / dedicated home office" />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Zoning Compliance</label>
        <div style={styles.hint}>Indicate that you're in compliance with local zoning laws. Check with your HOA to ensure you're not violating any CC&amp;Rs.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedZoningCompliance} onChange={e => set('homeBasedZoningCompliance', e.target.value)} placeholder="Confirmation of compliance with local zoning laws and HOA CC&amp;Rs..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Lease / Mortgage Constraints</label>
        <div style={styles.hint}>If you're a renter, make sure you have your landlord's permission to operate a business.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedLeaseConstraints} onChange={e => set('homeBasedLeaseConstraints', e.target.value)} placeholder="Landlord permission, lease restrictions, mortgage considerations..." />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>Supply Chain &amp; Inventory Management</p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Storage Solutions</label>
        <div style={styles.hint}>How will you store raw materials or finished goods? Mention climate control if necessary.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedStorage} onChange={e => set('homeBasedStorage', e.target.value)} placeholder="Storage space, climate control, organization..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Order Fulfillment</label>
        <div style={styles.hint}>Detail the process from receiving an order to shipping it. Which carriers will you use (USPS, UPS, FedEx)? Do you have a scheduled pickup or drop-off arrangement?</div>
        <textarea style={styles.textarea} rows={3} value={d.homeBasedOrderFulfillment} onChange={e => set('homeBasedOrderFulfillment', e.target.value)} placeholder="Order processing, packaging, carriers, pickup/drop-off arrangements..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Suppliers (Home-Based)</label>
        <div style={styles.hint}>List your primary vendors and backup options to prove your business can survive a supply chain disruption.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedSuppliers} onChange={e => set('homeBasedSuppliers', e.target.value)} placeholder="Primary vendors and backup suppliers..." />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>Technology &amp; Equipment</p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Hardware</label>
        <div style={styles.hint}>List essential equipment such as high-spec computers, 3D printers, industrial sewing machines, or specialized kitchen appliances.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedHardware} onChange={e => set('homeBasedHardware', e.target.value)} placeholder="Computers, printers, specialized equipment..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Software</label>
        <div style={styles.hint}>Identify your core tools for project management, CRM, and accounting.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedSoftware} onChange={e => set('homeBasedSoftware', e.target.value)} placeholder="Project management, CRM, accounting, design tools..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Connectivity / Internet Redundancy</label>
        <div style={styles.hint}>If your home Wi-Fi goes down, do you have a 5G backup or a local co-working space as a fallback?</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedConnectivity} onChange={e => set('homeBasedConnectivity', e.target.value)} placeholder="Internet backup plan, 5G hotspot, co-working space fallback..." />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>Workflow &amp; Production</p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Production Stages</label>
        <div style={styles.hint}>Break down the steps involved in creating your product or delivering your service.</div>
        <textarea style={styles.textarea} rows={3} value={d.homeBasedProductionStages} onChange={e => set('homeBasedProductionStages', e.target.value)} placeholder="Step-by-step production stages..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Quality Control (Home-Based)</label>
        <div style={styles.hint}>How do you ensure every deliverable meets your standards before it leaves your home?</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedQualityControl} onChange={e => set('homeBasedQualityControl', e.target.value)} placeholder="Home-based quality checks and standards..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Capacity &amp; Scalability</label>
        <div style={styles.hint}>What is the maximum volume you can produce in your current space? Identify triggers that would require moving to a commercial space or using a 3PL provider.</div>
        <textarea style={styles.textarea} rows={3} value={d.homeBasedCapacityScalability} onChange={e => set('homeBasedCapacityScalability', e.target.value)} placeholder="Maximum production volume, triggers for scaling up, 3PL considerations..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Logistics (Mail &amp; Shipping)</label>
        <div style={styles.hint}>How will you handle incoming professional mail? (e.g., a P.O. Box vs. home address)</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedLogistics} onChange={e => set('homeBasedLogistics', e.target.value)} placeholder="P.O. Box, home address, virtual mailbox..." />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>Risk Management</p>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Business Insurance (Home-Based)</label>
        <div style={styles.hint}>Specify that you have a home-based business rider or a separate commercial general liability policy (standard homeowners or renters policies rarely cover business liabilities).</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedBusinessInsurance} onChange={e => set('homeBasedBusinessInsurance', e.target.value)} placeholder="Business insurance rider, general liability policy..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Data Security</label>
        <div style={styles.hint}>If you handle client data, describe how you will protect sensitive information: encryption, secure backups, and VPN usage.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedDataSecurity} onChange={e => set('homeBasedDataSecurity', e.target.value)} placeholder="Encryption, backups, VPN, data protection measures..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Licenses (Home-Based)</label>
        <div style={styles.hint}>List any required professional or local business licenses.</div>
        <textarea style={styles.textarea} rows={2} value={d.homeBasedLicenses} onChange={e => set('homeBasedLicenses', e.target.value)} placeholder="Required licenses and permits for home-based business..." />
      </div>

      {/* ==================== 5. LEGAL ENVIRONMENT ==================== */}
      <h2 style={styles.sectionHeading}>5. Legal Environment</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Licenses &amp; Permits</label>
        <div style={styles.hint}>Licenses and permits required to operate, and whether you've already obtained them.</div>
        <textarea style={styles.textarea} rows={3} value={d.legalLicensesPermits} onChange={e => set('legalLicensesPermits', e.target.value)} placeholder="Required licenses, permits, and current status..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Trademarks, Copyrights &amp; Patents</label>
        <div style={styles.hint}>Trademarks, copyrights, or patents you hold or have applied for.</div>
        <textarea style={styles.textarea} rows={2} value={d.legalIP} onChange={e => set('legalIP', e.target.value)} placeholder="IP protection you hold or have applied for..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Insurance Coverage (Legal)</label>
        <div style={styles.hint}>Insurance coverage required and estimated costs.</div>
        <textarea style={styles.textarea} rows={2} value={d.legalInsurance} onChange={e => set('legalInsurance', e.target.value)} placeholder="Required insurance coverage and estimated costs..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Environmental, Health &amp; Safety Regulations</label>
        <div style={styles.hint}>Environmental, health, or workplace safety regulations that apply to your business.</div>
        <textarea style={styles.textarea} rows={2} value={d.legalRegulations} onChange={e => set('legalRegulations', e.target.value)} placeholder="Environmental, health, and safety regulations that apply..." />
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Industry-Specific Regulations</label>
          <textarea style={styles.textarea} rows={2} value={d.legalIndustrySpecific} onChange={e => set('legalIndustrySpecific', e.target.value)} placeholder="Industry-specific compliance requirements..." />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Bonding Requirements</label>
          <textarea style={styles.textarea} rows={2} value={d.legalBonding} onChange={e => set('legalBonding', e.target.value)} placeholder="Bonding requirements, if applicable..." />
        </div>
      </div>

      {/* ==================== 6. INSURANCE COVERAGE ==================== */}
      <h2 style={styles.sectionHeading}>6. Insurance Coverage</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Insurance Agent / Broker</label>
      </div>
      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Agent / Broker Name</label>
          <input style={styles.input} value={d.insuranceAgentName} onChange={e => set('insuranceAgentName', e.target.value)} placeholder="Agent name" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Agency Name</label>
          <input style={styles.input} value={d.insuranceAgencyName} onChange={e => set('insuranceAgencyName', e.target.value)} placeholder="Agency name" />
        </div>
      </div>
      <div style={styles.row3}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Phone</label>
          <input style={styles.input} value={d.insurancePhone} onChange={e => set('insurancePhone', e.target.value)} placeholder="Phone number" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} value={d.insuranceEmail} onChange={e => set('insuranceEmail', e.target.value)} placeholder="Email address" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Website</label>
          <input style={styles.input} value={d.insuranceWebsite} onChange={e => set('insuranceWebsite', e.target.value)} placeholder="Website URL" />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Insurance Coverage Worksheet</label>
        <div style={styles.hint}>Document your coverage, premiums, and contacts. Include this information in the body of your plan.</div>
        <table style={styles.insuranceTable}>
          <thead>
            <tr>
              <th style={styles.insuranceTh}>Coverage Type</th>
              <th style={{ ...styles.insuranceTh, width: 60 }}>Required?</th>
              <th style={{ ...styles.insuranceTh, width: 60 }}>Annual Premium ($)</th>
              <th style={{ ...styles.insuranceTh, width: 60 }}>Monthly Cost ($)</th>
              <th style={styles.insuranceTh}>Provider / Carrier</th>
              <th style={styles.insuranceTh}>Notes / Status</th>
            </tr>
          </thead>
          <tbody>
            {d.insuranceRows.map((row, i) => (
              <tr key={i}>
                <td style={{ ...styles.insuranceTd, fontWeight: 600, fontSize: 11, color: '#333' }}>{INSURANCE_TYPES[i]}</td>
                <td style={styles.insuranceTd}>
                  <select
                    style={{ ...styles.insuranceInput, fontSize: 11 }}
                    value={row.required}
                    onChange={e => setInsuranceRow(i, 'required', e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </td>
                <td style={styles.insuranceTd}>
                  <input
                    style={focusStyle(`annual-${i}`)}
                    type="number"
                    min="0"
                    step="10"
                    value={row.annualPremium}
                    onFocus={() => setFocusedCell(`annual-${i}`)}
                    onBlur={() => setFocusedCell(null)}
                    onChange={e => setInsuranceRow(i, 'annualPremium', e.target.value)}
                    placeholder="$"
                  />
                </td>
                <td style={styles.insuranceTd}>
                  <input
                    style={focusStyle(`monthly-${i}`)}
                    type="number"
                    min="0"
                    step="10"
                    value={row.monthlyCost}
                    onFocus={() => setFocusedCell(`monthly-${i}`)}
                    onBlur={() => setFocusedCell(null)}
                    onChange={e => setInsuranceRow(i, 'monthlyCost', e.target.value)}
                    placeholder="$"
                  />
                </td>
                <td style={styles.insuranceTd}>
                  <input
                    style={styles.insuranceInput}
                    value={row.provider}
                    onChange={e => setInsuranceRow(i, 'provider', e.target.value)}
                    placeholder="Carrier name"
                  />
                </td>
                <td style={styles.insuranceTd}>
                  <input
                    style={styles.insuranceInput}
                    value={row.notes}
                    onChange={e => setInsuranceRow(i, 'notes', e.target.value)}
                    placeholder="Status / notes"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Total Annual Insurance Cost ($)</label>
          <input style={styles.input} type="number" min="0" step="100" value={d.totalAnnualInsuranceCost} onChange={e => set('totalAnnualInsuranceCost', e.target.value)} placeholder="e.g. 5000" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Risk Assessment Notes</label>
          <textarea style={styles.textarea} rows={2} value={d.riskAssessmentNotes} onChange={e => set('riskAssessmentNotes', e.target.value)} placeholder="Risk assessment analysis..." />
        </div>
      </div>

      {/* ==================== 7. PERSONNEL ==================== */}
      <h2 style={styles.sectionHeading}>7. Personnel</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Key Roles &amp; Requirements</label>
        <div style={styles.hint}>What roles do you need, and are there any licensing, certification, or educational requirements?</div>
        <textarea style={styles.textarea} rows={3} value={d.personnelRoles} onChange={e => set('personnelRoles', e.target.value)} placeholder="Key roles needed and their licensing/certification/education requirements..." />
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Headcount at Launch</label>
          <div style={styles.hint}>How many employees will you need at launch, and how might that change over time?</div>
          <textarea style={styles.textarea} rows={2} value={d.personnelHeadcount} onChange={e => set('personnelHeadcount', e.target.value)} placeholder="e.g. 2 full-time at launch, growing to 8 by year 3" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Freelancers / Contractors</label>
          <div style={styles.hint}>Will you use freelancers, independent contractors, or gig workers?</div>
          <textarea style={styles.textarea} rows={2} value={d.personnelContractors} onChange={e => set('personnelContractors', e.target.value)} placeholder="Freelancers, contractors, or gig workers and their roles..." />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Job Descriptions</label>
        <div style={styles.hint}>What does each role involve? Include brief job descriptions.</div>
        <textarea style={styles.textarea} rows={3} value={d.personnelJobDescriptions} onChange={e => set('personnelJobDescriptions', e.target.value)} placeholder="Brief job descriptions for each role..." />
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Pay Structure</label>
          <div style={styles.hint}>Hourly, salaried, commission-based, or a combination?</div>
          <textarea style={styles.textarea} rows={2} value={d.personnelPayStructure} onChange={e => set('personnelPayStructure', e.target.value)} placeholder="Salary ranges, hourly rates, commission structures..." />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Recruiting &amp; Hiring</label>
          <div style={styles.hint}>How will you find and recruit qualified people?</div>
          <textarea style={styles.textarea} rows={2} value={d.personnelRecruiting} onChange={e => set('personnelRecruiting', e.target.value)} placeholder="Job boards, recruiters, networks, hiring process..." />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Training</label>
        <div style={styles.hint}>What training will new employees need, and how will you deliver it?</div>
        <textarea style={styles.textarea} rows={2} value={d.personnelTraining} onChange={e => set('personnelTraining', e.target.value)} placeholder="Onboarding, ongoing training, certifications..." />
      </div>

      {/* ==================== 8. INVENTORY ==================== */}
      <h2 style={styles.sectionHeading}>8. Inventory</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Inventory Types &amp; Storage</label>
        <div style={styles.hint}>What types of inventory will you keep on hand — raw materials, supplies, work-in-progress, or finished products — and where will you store them?</div>
        <textarea style={styles.textarea} rows={3} value={d.inventoryTypes} onChange={e => set('inventoryTypes', e.target.value)} placeholder="Types of inventory and storage locations..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Estimated Average Inventory Value ($)</label>
        <input style={styles.input} type="number" min="0" step="100" value={d.inventoryValue} onChange={e => set('inventoryValue', e.target.value)} placeholder="e.g. 25000" />
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Inventory Turnover Rate</label>
          <div style={styles.hint}>What inventory turnover rate do you expect, and how does that compare to industry averages?</div>
          <textarea style={styles.textarea} rows={2} value={d.inventoryTurnover} onChange={e => set('inventoryTurnover', e.target.value)} placeholder="Expected turnover rate and industry comparison..." />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Seasonal Fluctuations</label>
          <div style={styles.hint}>Are there seasonal fluctuations in demand that will require you to stock up at certain times of year?</div>
          <textarea style={styles.textarea} rows={2} value={d.inventorySeasonality} onChange={e => set('inventorySeasonality', e.target.value)} placeholder="Seasonal demand patterns and inventory planning..." />
        </div>
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Lead Time for Ordering</label>
          <div style={styles.hint}>What is your typical lead time for ordering inventory?</div>
          <textarea style={styles.textarea} rows={2} value={d.inventoryLeadTime} onChange={e => set('inventoryLeadTime', e.target.value)} placeholder="e.g. 2-3 weeks from order to delivery" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Inventory Management Tools</label>
          <div style={styles.hint}>What inventory management tools or software will you use?</div>
          <textarea style={styles.textarea} rows={2} value={d.inventoryTools} onChange={e => set('inventoryTools', e.target.value)} placeholder="Software, spreadsheets, tracking systems..." />
        </div>
      </div>

      {/* ==================== 9. SUPPLIERS ==================== */}
      <h2 style={styles.sectionHeading}>9. Suppliers</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Key Supplier Details</label>
        <div style={styles.hint}>For each key supplier, provide: name, address, website, what they supply and in what quantities, their credit and delivery terms, and their track record for reliability and consistency.</div>
        <textarea style={styles.textarea} rows={4} value={d.suppliersDetails} onChange={e => set('suppliersDetails', e.target.value)} placeholder="Supplier names, addresses, products, quantities, terms, reliability..." />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Supply Shortages &amp; Disruptions</label>
        <div style={styles.hint}>Do you anticipate any supply shortages or delivery disruptions, and if so, how will you handle them?</div>
        <textarea style={styles.textarea} rows={2} value={d.suppliersDisruptions} onChange={e => set('suppliersDisruptions', e.target.value)} placeholder="Anticipated disruptions and contingency plans..." />
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Backup Suppliers</label>
          <div style={styles.hint}>Identify backup suppliers to mitigate single-source dependency risk.</div>
          <textarea style={styles.textarea} rows={2} value={d.suppliersBackup} onChange={e => set('suppliersBackup', e.target.value)} placeholder="Backup suppliers and alternatives..." />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Cost Fluctuation Management</label>
          <div style={styles.hint}>Are input costs likely to remain stable or fluctuate? How will you manage cost increases?</div>
          <textarea style={styles.textarea} rows={2} value={d.suppliersCostFluctuation} onChange={e => set('suppliersCostFluctuation', e.target.value)} placeholder="Cost stability, hedging, pass-through strategies..." />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Supplier Payment Terms &amp; Cash Flow Impact</label>
        <div style={styles.hint}>How do payment terms affect your cash flow?</div>
        <textarea style={styles.textarea} rows={2} value={d.suppliersPaymentTerms} onChange={e => set('suppliersPaymentTerms', e.target.value)} placeholder="Payment terms and their impact on cash flow..." />
      </div>

      {/* ==================== 10. CREDIT POLICIES ==================== */}
      <h2 style={styles.sectionHeading}>10. Credit Policies</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Industry Practice &amp; Customer Expectations</label>
        <div style={styles.hint}>Is offering credit standard practice in your industry? Do customers expect it?</div>
        <textarea style={styles.textarea} rows={2} value={d.creditIndustryStandard} onChange={e => set('creditIndustryStandard', e.target.value)} placeholder="Industry norms around extending credit..." />
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Credit Amount &amp; Eligibility Criteria</label>
          <div style={styles.hint}>How much credit will you extend, and what criteria will you use to determine eligibility?</div>
          <textarea style={styles.textarea} rows={2} value={d.creditAmountCriteria} onChange={e => set('creditAmountCriteria', e.target.value)} placeholder="Credit limits and eligibility criteria..." />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Creditworthiness Assessment</label>
          <div style={styles.hint}>How will you assess a new customer's creditworthiness — credit checks, trade references, or payment history?</div>
          <textarea style={styles.textarea} rows={2} value={d.creditAssessment} onChange={e => set('creditAssessment', e.target.value)} placeholder="Methods for assessing creditworthiness..." />
        </div>
      </div>

      <div style={styles.row2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Credit Terms</label>
          <div style={styles.hint}>What terms will you offer: net 30, net 60, early payment discounts?</div>
          <textarea style={styles.textarea} rows={2} value={d.creditTerms} onChange={e => set('creditTerms', e.target.value)} placeholder="e.g. Net 30, early payment discount of 2% if paid within 10 days" />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Cost of Offering Credit</label>
          <div style={styles.hint}>What does it cost you to offer credit, and have you built those costs into your pricing?</div>
          <textarea style={styles.textarea} rows={2} value={d.creditCosts} onChange={e => set('creditCosts', e.target.value)} placeholder="Costs of extending credit and how they're factored into pricing..." />
        </div>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Collections &amp; Non-Payment Handling</label>
        <div style={styles.hint}>How will you handle slow or non-paying customers?</div>
        <textarea style={styles.textarea} rows={2} value={d.creditCollections} onChange={e => set('creditCollections', e.target.value)} placeholder="Collections process, late fees, escalation procedures..." />
      </div>
    </div>
  )
}
