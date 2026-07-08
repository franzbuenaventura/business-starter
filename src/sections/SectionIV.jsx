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
  },
  chipActive: {
    padding: '6px 14px',
    border: '2px solid #0066cc',
    borderRadius: 20,
    fontSize: 13,
    cursor: 'pointer',
    background: '#f0f7ff',
    fontWeight: 600,
  },
  salesTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    marginTop: 12,
  },
  salesTh: {
    border: '1px solid #ddd',
    padding: '6px 4px',
    background: '#f5f5f5',
    fontWeight: 600,
    fontSize: 11,
    textAlign: 'center',
  },
  salesTd: {
    border: '1px solid #ddd',
    padding: '4px',
  },
  salesInput: {
    width: '100%',
    padding: '4px 2px',
    border: '1px solid transparent',
    borderRadius: 3,
    fontSize: 12,
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'right',
    boxSizing: 'border-box',
    outline: 'none',
  },
  salesInputFocused: {
    border: '1px solid #0066cc',
  },
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function emptyRow() {
  return MONTHS.reduce((a, m) => ({ ...a, [m]: '' }), {})
}

function defaultData() {
  return {
    industryOverview: '',
    industryTrends: '',
    targetMarketSize: '',
    marketShareEstimate: '',
    customerNeeds: '',
    primaryResearch: '',
    secondaryResearch: '',
    barriersToEntry: '',
    barrierStrategies: '',
    regulatoryChanges: '',
    technologyShifts: '',
    economicConditions: '',
    industryEvolution: '',
    swotStrengths: '',
    swotWeaknesses: '',
    swotOpportunities: '',
    swotThreats: '',
    swotActionPlan: '',
    swotImmediateGoals: '',
    swotLongTermGoals: '',
    productFeatures: '',
    productBenefits: '',
    afterSalesSupport: '',
    targetCustomerDescription: '',
    consumerAge: '',
    consumerGender: '',
    consumerLocation: '',
    consumerIncome: '',
    consumerOccupation: '',
    consumerEducation: '',
    businessIndustry: '',
    businessLocation: '',
    businessSize: '',
    businessStage: '',
    businessRevenue: '',
    directCompetitors: '',
    indirectCompetitors: '',
    usp: '',
    competitiveStrategy: '',
    competitiveAnalysis: '',
    positioningNiche: '',
    advertisingTactics: '',
    marketingTactics: '',
    brandIdentity: '',
    prelaunchBudget: '',
    ongoingBudget: '',
    pricingStrategy: '',
    pricingExplanation: '',
    pricePoints: '',
    industryPricing: '',
    competitorPriceComparison: '',
    creditPaymentTerms: '',
    locationDescription: '',
    locationAccessibility: '',
    locationParking: '',
    locationTransit: '',
    locationSpaceType: '',
    neighboringBusinesses: '',
    distributionChannels: '',
    strategicPartnerships: '',
    forecastAssumptions: '',
    estimatedCustomers: '',
    conversionRate: '',
    averageTransaction: '',
    primaryRevenueSource: '',
    seasonalityNotes: '',
    bestGuessSources: ['', '', '', '', ''],
    worstCaseSources: ['', '', '', '', ''],
    bestGuessRows: [emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()],
    worstCaseRows: [emptyRow(), emptyRow(), emptyRow(), emptyRow(), emptyRow()],
    forecastNotes: '',
  }
}

export default function SectionIV({ data, onChange }) {
  const [d, setD] = useState(null)

  useEffect(() => {
    setD(data && typeof data === 'object' && Object.keys(data).length > 0
      ? { ...defaultData(), ...data }
      : { ...defaultData() })
  }, [data])

  if (d === null) return null

  function set(field, value) {
    const next = { ...d, [field]: value }
    setD(next)
    onChange(next)
  }

  function setBestGuessSource(i, value) {
    const arr = [...d.bestGuessSources]
    arr[i] = value
    set('bestGuessSources', arr)
  }

  function setWorstCaseSource(i, value) {
    const arr = [...d.worstCaseSources]
    arr[i] = value
    set('worstCaseSources', arr)
  }

  function setBestGuessCell(sourceIdx, month, value) {
    const rows = d.bestGuessRows.map((r, i) =>
      i === sourceIdx ? { ...r, [month]: value } : r
    )
    set('bestGuessRows', rows)
  }

  function setWorstCaseCell(sourceIdx, month, value) {
    const rows = d.worstCaseRows.map((r, i) =>
      i === sourceIdx ? { ...r, [month]: value } : r
    )
    set('worstCaseRows', rows)
  }

  function calcTotal(rows) {
    const totals = MONTHS.map(m => {
      return rows.reduce((acc, r) => acc + (parseFloat(r[m]) || 0), 0)
    })
    const yearTotal = totals.reduce((a, b) => a + b, 0)
    return { totals, yearTotal }
  }

  const bestTotal = calcTotal(d.bestGuessRows)
  const worstTotal = calcTotal(d.worstCaseRows)

  return (
    <div style={styles.container}>
      <p style={{ color: '#666', marginBottom: 20, fontSize: 14 }}>
        Complete each section below to build your Marketing Plan. The template instructions provide guidance for each topic.
      </p>

      {/* ==================== 1. MARKET RESEARCH ==================== */}
      <h2 style={styles.sectionHeading}>1. Market Research</h2>

      <FieldArea label="Industry Overview / Market Size" hint="Describe the overall size of your industry — total revenue, number of businesses, and your specific segment." rows={3} value={d.industryOverview} onChange={v => set('industryOverview', v)} placeholder="e.g. The US pet care industry is a $150B market, growing at 4% annually..." />

      <FieldArea label="Industry Trends" hint="Is the industry growing, shrinking, or stable? What are the driving forces?" rows={3} value={d.industryTrends} onChange={v => set('industryTrends', v)} placeholder="Key trends shaping the industry..." />

      <FieldArea label="Target Market Size" hint="What is the size of your specific target market?" rows={2} value={d.targetMarketSize} onChange={v => set('targetMarketSize', v)} placeholder="e.g. 500,000 households within a 15-mile radius" />

      <FieldArea label="Realistic Market Share Estimate" hint="What share of this market can you realistically capture, and over what timeframe?" rows={2} value={d.marketShareEstimate} onChange={v => set('marketShareEstimate', v)} placeholder="e.g. 2% market share by end of year 2, reaching $500K in revenue" />

      <FieldArea label="Customer Needs &amp; Preferences" hint="How are customer needs and preferences in your market shifting?" rows={3} value={d.customerNeeds} onChange={v => set('customerNeeds', v)} placeholder="e.g. Customers increasingly demand eco-friendly packaging and fast delivery..." />

      <FieldArea label="Primary Research Summary" hint="Information you gathered yourself — surveys, interviews, store visits, product testing." rows={3} value={d.primaryResearch} onChange={v => set('primaryResearch', v)} placeholder="Summarize your surveys, interviews, or observations..." />

      <FieldArea label="Secondary Research Summary" hint="Information from existing sources — industry reports, census data, trade publications." rows={3} value={d.secondaryResearch} onChange={v => set('secondaryResearch', v)} placeholder="Industry reports, demographic data, trade publication findings..." />

      {/* ==================== 2. BARRIERS TO ENTRY ==================== */}
      <h2 style={styles.sectionHeading}>2. Barriers to Entry</h2>

      <FieldArea label="Key Barriers to Entry" hint="What challenges and obstacles does your new business face? (startup costs, marketing costs, finding talent, regulations, established competitors, etc.)" rows={3} value={d.barriersToEntry} onChange={v => set('barriersToEntry', v)} placeholder="e.g. High startup costs for equipment, established competitors with loyal customer bases..." />

      <FieldArea label="Strategies to Overcome Barriers" hint="Explain how you plan to address each barrier identified above." rows={3} value={d.barrierStrategies} onChange={v => set('barrierStrategies', v)} placeholder="e.g. Leasing equipment instead of buying, focusing on underserved customer segments..." />

      {/* ==================== 3. THREATS AND OPPORTUNITIES ==================== */}
      <h2 style={styles.sectionHeading}>3. Threats &amp; Opportunities (SWOT)</h2>

      <div style={styles.row2}>
        <FieldArea label="Strengths" rows={2} value={d.swotStrengths} onChange={v => set('swotStrengths', v)} placeholder="Products, brand, staff, finance, operations, market..." />
        <FieldArea label="Weaknesses" rows={2} value={d.swotWeaknesses} onChange={v => set('swotWeaknesses', v)} placeholder="Products, brand, staff, finance, operations, market..." />
      </div>
      <div style={styles.row2}>
        <FieldArea label="Opportunities" rows={2} value={d.swotOpportunities} onChange={v => set('swotOpportunities', v)} placeholder="External opportunities..." />
        <FieldArea label="Threats" rows={2} value={d.swotThreats} onChange={v => set('swotThreats', v)} placeholder="External threats..." />
      </div>

      <FieldArea label="SWOT Action Plan" hint="Can any of your strengths help improve your weaknesses or combat your threats?" rows={2} value={d.swotActionPlan} onChange={v => set('swotActionPlan', v)} placeholder="How strengths can address weaknesses and threats..." />

      <div style={styles.row2}>
        <FieldArea label="SWOT Immediate Goals / Next Steps" rows={2} value={d.swotImmediateGoals} onChange={v => set('swotImmediateGoals', v)} placeholder="Short-term actions based on SWOT..." />
        <FieldArea label="SWOT Long-Term Goals / Next Steps" rows={2} value={d.swotLongTermGoals} onChange={v => set('swotLongTermGoals', v)} placeholder="Longer-term strategic goals..." />
      </div>

      <FieldArea label="Regulatory Changes (Risks &amp; Opportunities)" hint="New laws, licensing requirements, or industry regulations that could affect your business." rows={2} value={d.regulatoryChanges} onChange={v => set('regulatoryChanges', v)} placeholder="e.g. New environmental regulations could increase costs but also create demand..." />

      <FieldArea label="Technology Shifts (Risks &amp; Opportunities)" hint="Automation, new platforms, outdated equipment, or disruption to your business model." rows={2} value={d.technologyShifts} onChange={v => set('technologyShifts', v)} placeholder="e.g. AI tools could reduce operational costs but require new training..." />

      <FieldArea label="Economic Conditions (Risks &amp; Opportunities)" hint="Consumer spending trends, inflation, interest rates, economic downturn." rows={2} value={d.economicConditions} onChange={v => set('economicConditions', v)} placeholder="e.g. Rising interest rates may slow expansion, but demand for value-driven services may increase..." />

      <FieldArea label="Industry Evolution (Risks &amp; Opportunities)" hint="Consolidation, new competitors, changing customer behaviors or expectations." rows={2} value={d.industryEvolution} onChange={v => set('industryEvolution', v)} placeholder="e.g. More large chains entering local market, but consumers increasingly value local businesses..." />

      {/* ==================== 4. PRODUCT/SERVICE FEATURES AND BENEFITS ==================== */}
      <h2 style={styles.sectionHeading}>4. Product/Service Features &amp; Benefits</h2>

      <FieldArea label="Features" hint="What makes your offering distinctive? What does it include, and what sets it apart from alternatives?" rows={3} value={d.productFeatures} onChange={v => set('productFeatures', v)} placeholder="Key features that differentiate your product or service..." />

      <FieldArea label="Benefits" hint="What the customer actually gains — how does it save them time, reduce costs, solve a problem, or improve their situation?" rows={3} value={d.productBenefits} onChange={v => set('productBenefits', v)} placeholder="Customer benefits — time saved, costs reduced, problems solved..." />

      <FieldArea label="After-Sales Support" hint="Delivery options, warranties, satisfaction guarantees, service contracts, customer support, training, return/refund policies." rows={3} value={d.afterSalesSupport} onChange={v => set('afterSalesSupport', v)} placeholder="Warranties, guarantees, support, training, return policies..." />

      {/* ==================== 5. TARGET CUSTOMER ==================== */}
      <h2 style={styles.sectionHeading}>5. Target Customer</h2>

      <FieldArea label="Target Customer Description" hint="Describe your ideal customer(s) or buyer persona(s). You may have more than one group." rows={2} value={d.targetCustomerDescription} onChange={v => set('targetCustomerDescription', v)} placeholder="Describe each target customer group..." />

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>For Individual Consumers</p>
      <div style={styles.row3}>
        <FieldInput label="Age" value={d.consumerAge} onChange={v => set('consumerAge', v)} placeholder="e.g. 25–45" />
        <FieldInput label="Gender" value={d.consumerGender} onChange={v => set('consumerGender', v)} placeholder="e.g. All / Female" />
        <FieldInput label="Location" value={d.consumerLocation} onChange={v => set('consumerLocation', v)} placeholder="e.g. Urban metro area" />
      </div>
      <div style={styles.row3}>
        <FieldInput label="Income Level" value={d.consumerIncome} onChange={v => set('consumerIncome', v)} placeholder="e.g. $50K–$100K" />
        <FieldInput label="Occupation" value={d.consumerOccupation} onChange={v => set('consumerOccupation', v)} placeholder="e.g. Professionals" />
        <FieldInput label="Education Level" value={d.consumerEducation} onChange={v => set('consumerEducation', v)} placeholder="e.g. College degree+" />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: '#555', marginBottom: 10 }}>For Business Customers (B2B)</p>
      <div style={styles.row3}>
        <FieldInput label="Industry" value={d.businessIndustry} onChange={v => set('businessIndustry', v)} placeholder="e.g. Healthcare" />
        <FieldInput label="Location" value={d.businessLocation} onChange={v => set('businessLocation', v)} placeholder="e.g. Pacific NW" />
        <FieldInput label="Company Size" value={d.businessSize} onChange={v => set('businessSize', v)} placeholder="e.g. 10–50 employees" />
      </div>
      <div style={styles.row2}>
        <FieldInput label="Stage of Business" value={d.businessStage} onChange={v => set('businessStage', v)} placeholder="Startup / Growing / Established" />
        <FieldInput label="Annual Revenue" value={d.businessRevenue} onChange={v => set('businessRevenue', v)} placeholder="e.g. $1M–$5M" />
      </div>

      {/* ==================== 6. KEY COMPETITORS ==================== */}
      <h2 style={styles.sectionHeading}>6. Key Competitors</h2>

      <FieldArea label="Direct Competitors" hint="List direct competitors — their names, locations, offerings, pricing, and target market." rows={3} value={d.directCompetitors} onChange={v => set('directCompetitors', v)} placeholder="e.g. Competitor A in [location] offers similar products at $X price targeting [segment]..." />

      <FieldArea label="Indirect Competitors" hint="Businesses that compete for the same consumer dollars or attention but aren't the same category." rows={2} value={d.indirectCompetitors} onChange={v => set('indirectCompetitors', v)} placeholder="e.g. A restaurant competes with bars, entertainment venues, and delivery services..." />

      <FieldArea label="Unique Selling Proposition (USP)" hint="What makes your business stand out from both direct and indirect competitors?" rows={2} value={d.usp} onChange={v => set('usp', v)} placeholder="Your unique differentiator..." />

      <FieldArea label="Competitive Strategy" hint="How will you differentiate and compete against each key competitor?" rows={2} value={d.competitiveStrategy} onChange={v => set('competitiveStrategy', v)} placeholder="Strategy for standing out from each competitor..." />

      <FieldArea label="Competitive Analysis Summary" hint="Summarize how you compare across products, price, quality, service, location, reputation, etc." rows={3} value={d.competitiveAnalysis} onChange={v => set('competitiveAnalysis', v)} placeholder="Comparison across key competitive factors..." />

      {/* ==================== 7. POSITIONING AND NICHE ==================== */}
      <h2 style={styles.sectionHeading}>7. Positioning &amp; Niche</h2>

      <FieldArea label="Positioning Statement" hint="What is your niche — the specific segment you're targeting — and how do you want customers to perceive your business? This statement will inform every marketing and branding decision." rows={3} value={d.positioningNiche} onChange={v => set('positioningNiche', v)} placeholder="e.g. For [target customer], [business name] is the [category] that provides [key benefit] unlike [competitor] because [differentiator]." />

      {/* ==================== 8. HOW YOU WILL MARKET YOUR BUSINESS ==================== */}
      <h2 style={styles.sectionHeading}>8. How You Will Market Your Business</h2>

      <FieldArea label="Advertising Tactics" hint="Paid placements to build awareness and drive traffic — digital ads, print, radio, TV, out-of-home." rows={3} value={d.advertisingTactics} onChange={v => set('advertisingTactics', v)} placeholder="Digital ads (paid search, social, display), print, radio, TV, out-of-home..." />

      <FieldArea label="Marketing Tactics" hint="Broader efforts to build brand and generate leads — website, social media, email, SEO, content, PR, events, networking, referrals, etc." rows={4} value={d.marketingTactics} onChange={v => set('marketingTactics', v)} placeholder="Website, social media, email marketing, SEO, content marketing, PR, trade shows, networking, referral programs..." />

      <FieldArea label="Brand Identity" hint="What should customers feel when they encounter your brand? How will visuals reinforce that impression?" rows={3} value={d.brandIdentity} onChange={v => set('brandIdentity', v)} placeholder="Brand values, visual identity, tone, and the customer experience you want to create..." />

      {/* ==================== 9. PROMOTIONAL BUDGET ==================== */}
      <h2 style={styles.sectionHeading}>9. Promotional Budget</h2>

      <div style={styles.row2}>
        <FieldInput label="Pre-Launch Marketing Budget ($)" hint="Website build, initial ad campaigns, printed materials, launch event." type="number" value={d.prelaunchBudget} onChange={v => set('prelaunchBudget', v)} placeholder="e.g. 15000" />
        <FieldInput label="Ongoing Marketing Budget ($/month)" hint="Regular monthly or annual marketing spend once you're up and running." type="number" value={d.ongoingBudget} onChange={v => set('ongoingBudget', v)} placeholder="e.g. 2000" />
      </div>

      {/* ==================== 10. PRICING ==================== */}
      <h2 style={styles.sectionHeading}>10. Pricing</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Pricing Strategy</label>
        <div style={styles.chipGroup}>
          {['Cost Plus','Value Based','Competitive','Other'].map(s => (
            <button key={s} type="button"
              onClick={() => set('pricingStrategy', s)}
              style={d.pricingStrategy === s ? styles.chipActive : styles.chip}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <FieldArea label="Pricing Explanation" hint="Explain the thinking behind your pricing strategy. How does your price point reinforce your positioning and compare to competitors?" rows={2} value={d.pricingExplanation} onChange={v => set('pricingExplanation', v)} placeholder="Why you chose this pricing approach and how it aligns with your brand..." />

      <FieldArea label="Major Product/Service Price Points" rows={2} value={d.pricePoints} onChange={v => set('pricePoints', v)} placeholder="List your key products/services and their prices..." />

      <FieldArea label="Industry / Market Pricing Practices" rows={2} value={d.industryPricing} onChange={v => set('industryPricing', v)} placeholder="How does your pricing compare to typical industry practices?" />

      <FieldArea label="Competitor Price Comparison" hint="Are your prices higher, lower, or in line with competitors? Explain why." rows={2} value={d.competitorPriceComparison} onChange={v => set('competitorPriceComparison', v)} placeholder="Comparison with competitor pricing..." />

      <FieldArea label="Customer Credit &amp; Payment Terms" hint="How do you handle payment terms, returns, and disputes?" rows={2} value={d.creditPaymentTerms} onChange={v => set('creditPaymentTerms', v)} placeholder="Payment methods accepted, credit terms, return policies..." />

      {/* ==================== 11. LOCATION ==================== */}
      <h2 style={styles.sectionHeading}>11. Location</h2>

      <FieldArea label="Location Description" hint="Describe your chosen location (or criteria if still deciding). Why is it the right fit for your business and customers?" rows={2} value={d.locationDescription} onChange={v => set('locationDescription', v)} placeholder="Address, area, and strategic rationale for your location..." />

      <div style={styles.row2}>
        <FieldInput label="Customer Accessibility" value={d.locationAccessibility} onChange={v => set('locationAccessibility', v)} placeholder="Easy to find and reach?" />
        <FieldInput label="Parking" value={d.locationParking} onChange={v => set('locationParking', v)} placeholder="Adequate for customers and employees?" />
      </div>
      <div style={styles.row3}>
        <FieldInput label="Transit &amp; Road Access" value={d.locationTransit} onChange={v => set('locationTransit', v)} placeholder="Near transit/highways?" />
        <FieldInput label="Type of Space / Zoning" value={d.locationSpaceType} onChange={v => set('locationSpaceType', v)} placeholder="Retail / Industrial / Office" />
        <FieldInput label="Neighboring Businesses" value={d.neighboringBusinesses} onChange={v => set('neighboringBusinesses', v)} placeholder="Complementary or conflicting?" />
      </div>

      {/* ==================== 12. DISTRIBUTION CHANNELS ==================== */}
      <h2 style={styles.sectionHeading}>12. Distribution Channels</h2>

      <FieldArea label="Distribution Channels" hint="How does your product or service reach customers? Retail, direct sales, e-commerce, wholesale, inside/outside sales, OEM partnerships." rows={3} value={d.distributionChannels} onChange={v => set('distributionChannels', v)} placeholder="Your primary and secondary distribution channels..." />

      <FieldArea label="Strategic Partnerships / Key Distributors" hint="Describe any established strategic partnerships or key distributor relationships that give you a competitive advantage." rows={2} value={d.strategicPartnerships} onChange={v => set('strategicPartnerships', v)} placeholder="Key partners or distributors..." />

      {/* ==================== 13. 12-MONTH SALES FORECAST ==================== */}
      <h2 style={styles.sectionHeading}>13. 12-Month Sales Forecast</h2>

      <FieldArea label="Key Assumptions" hint="Use this space to document the research and reasoning behind your numbers." rows={2} value={d.forecastAssumptions} onChange={v => set('forecastAssumptions', v)} placeholder="Your key assumptions driving the forecast..." />

      <div style={styles.row3}>
        <FieldInput label="Estimated Customers Reached per Month" type="number" value={d.estimatedCustomers} onChange={v => set('estimatedCustomers', v)} placeholder="e.g. 1000" />
        <FieldInput label="Projected Conversion Rate (%)" type="number" min="0" max="100" step="0.1" value={d.conversionRate} onChange={v => set('conversionRate', v)} placeholder="e.g. 5" />
        <FieldInput label="Average Transaction Value ($)" type="number" min="0" step="0.01" value={d.averageTransaction} onChange={v => set('averageTransaction', v)} placeholder="e.g. 50" />
      </div>

      <div style={styles.row2}>
        <FieldInput label="Primary Revenue Source" value={d.primaryRevenueSource} onChange={v => set('primaryRevenueSource', v)} placeholder="e.g. Product sales, subscriptions" />
        <FieldInput label="Seasonality Notes" value={d.seasonalityNotes} onChange={v => set('seasonalityNotes', v)} placeholder="e.g. Peak season Q4" />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12, color: '#333' }}>Best Guess Scenario</h3>
      <SalesForecastTable
        sources={d.bestGuessSources}
        rows={d.bestGuessRows}
        totals={bestTotal.totals}
        yearTotal={bestTotal.yearTotal}
        onSourceChange={setBestGuessSource}
        onCellChange={setBestGuessCell}
      />

      <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 12, color: '#333' }}>Worst Case Scenario</h3>
      <SalesForecastTable
        sources={d.worstCaseSources}
        rows={d.worstCaseRows}
        totals={worstTotal.totals}
        yearTotal={worstTotal.yearTotal}
        onSourceChange={setWorstCaseSource}
        onCellChange={setWorstCaseCell}
      />

      <FieldArea label="Notes / Assumptions Behind These Projections" rows={3} value={d.forecastNotes} onChange={v => set('forecastNotes', v)} placeholder="Additional details about your projections..." />
    </div>
  )
}

/* ---------- Sub-components ---------- */

function FieldInput({ label, hint, type, value, onChange, placeholder, min, max, step }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <div style={styles.hint}>{hint}</div>}
      <input
        style={styles.input}
        type={type || 'text'}
        min={min}
        max={max}
        step={step}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function FieldArea({ label, hint, rows, value, onChange, placeholder }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>{label}</label>
      {hint && <div style={styles.hint}>{hint}</div>}
      <textarea
        style={styles.textarea}
        rows={rows || 3}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

const salesTh = {
  border: '1px solid #ddd',
  padding: '6px 4px',
  background: '#f5f5f5',
  fontWeight: 600,
  fontSize: 11,
  textAlign: 'center',
}

const salesTd = {
  border: '1px solid #ddd',
  padding: '4px',
}

function SalesForecastTable({ sources, rows, totals, yearTotal, onSourceChange, onCellChange }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
        <thead>
          <tr>
            <th style={salesTh}>Revenue Source</th>
            {MONTHS.map(m => <th key={m} style={salesTh}>{m}</th>)}
            <th style={salesTh}>Total</th>
          </tr>
        </thead>
        <tbody>
          {[0,1,2,3,4].map(si => (
            <tr key={si}>
              <td style={{ ...salesTd, padding: '2px 4px' }}>
                <input
                  style={{ width: '100%', padding: '4px 2px', border: '1px solid transparent', borderRadius: 3, fontSize: 12, fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', outline: 'none' }}
                  value={sources[si] || ''}
                  onChange={e => onSourceChange(si, e.target.value)}
                  placeholder={`Source ${si + 1}`}
                />
              </td>
              {MONTHS.map(m => (
                <td key={m} style={salesTd}>
                  <input
                    style={{ width: '100%', padding: '4px 2px', border: '1px solid transparent', borderRadius: 3, fontSize: 12, fontFamily: 'system-ui, sans-serif', textAlign: 'right', boxSizing: 'border-box', outline: 'none' }}
                    type="number"
                    min="0"
                    step="0.01"
                    value={rows[si][m] || ''}
                    onChange={e => onCellChange(si, m, e.target.value)}
                  />
                </td>
              ))}
              <td style={{ ...salesTd, fontWeight: 600, textAlign: 'right', padding: '4px 6px' }}>
                ${rows[si][MONTHS[0]] || rows[si][MONTHS[1]] || rows[si][MONTHS[2]] ? rows.reduce((a, m) => a + (parseFloat(rows[si][m]) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f0f7ff' }}>
            <td style={{ ...salesTd, fontWeight: 700, padding: '6px 4px' }}>TOTAL</td>
            {totals.map((t, i) => (
              <td key={i} style={{ ...salesTd, fontWeight: 700, textAlign: 'right', padding: '4px 6px' }}>
                ${t.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            ))}
            <td style={{ ...salesTd, fontWeight: 700, textAlign: 'right', padding: '4px 6px', color: '#0066cc' }}>
              ${yearTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
