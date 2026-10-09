import { useState, useEffect } from 'react'
import { Chip } from '@heroui/react'
import { SectionPage, Group, Field, Row, CellInput, SubTitle } from '../components/Fields.jsx'

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
    <SectionPage title="Marketing Plan" intro="Complete each section below to build your Marketing Plan. The template instructions provide guidance for each topic.">
      {/* ==================== 1. MARKET RESEARCH ==================== */}
      <Group title="Market Research" number="1">
        <Field label="Industry Overview / Market Size" hint="Describe the overall size of your industry — total revenue, number of businesses, and your specific segment." value={d.industryOverview} onChange={v => set('industryOverview', v)} placeholder="e.g. The US pet care industry is a $150B market, growing at 4% annually..." />
        <Field label="Industry Trends" hint="Is the industry growing, shrinking, or stable? What are the driving forces?" value={d.industryTrends} onChange={v => set('industryTrends', v)} placeholder="Key trends shaping the industry..." />
        <Field label="Target Market Size" hint="What is the size of your specific target market?" value={d.targetMarketSize} onChange={v => set('targetMarketSize', v)} placeholder="e.g. 500,000 households within a 15-mile radius" />
        <Field label="Realistic Market Share Estimate" hint="What share of this market can you realistically capture, and over what timeframe?" value={d.marketShareEstimate} onChange={v => set('marketShareEstimate', v)} placeholder="e.g. 2% market share by end of year 2, reaching $500K in revenue" />
        <Field label="Customer Needs & Preferences" hint="How are customer needs and preferences in your market shifting?" value={d.customerNeeds} onChange={v => set('customerNeeds', v)} placeholder="e.g. Customers increasingly demand eco-friendly packaging and fast delivery..." />
        <Field label="Primary Research Summary" hint="Information you gathered yourself — surveys, interviews, store visits, product testing." value={d.primaryResearch} onChange={v => set('primaryResearch', v)} placeholder="Summarize your surveys, interviews, or observations..." />
        <Field label="Secondary Research Summary" hint="Information from existing sources — industry reports, census data, trade publications." value={d.secondaryResearch} onChange={v => set('secondaryResearch', v)} placeholder="Industry reports, demographic data, trade publication findings..." />
      </Group>

      {/* ==================== 2. BARRIERS TO ENTRY ==================== */}
      <Group title="Barriers to Entry" number="2">
        <Field label="Key Barriers to Entry" hint="What challenges and obstacles does your new business face? (startup costs, marketing costs, finding talent, regulations, established competitors, etc.)" value={d.barriersToEntry} onChange={v => set('barriersToEntry', v)} placeholder="e.g. High startup costs for equipment, established competitors with loyal customer bases..." />
        <Field label="Strategies to Overcome Barriers" hint="Explain how you plan to address each barrier identified above." value={d.barrierStrategies} onChange={v => set('barrierStrategies', v)} placeholder="e.g. Leasing equipment instead of buying, focusing on underserved customer segments..." />
      </Group>

      {/* ==================== 3. THREATS AND OPPORTUNITIES ==================== */}
      <Group title="Threats & Opportunities (SWOT)" number="3">
        <Row>
          <Field label="Strengths" value={d.swotStrengths} onChange={v => set('swotStrengths', v)} placeholder="Products, brand, staff, finance, operations, market..." />
          <Field label="Weaknesses" value={d.swotWeaknesses} onChange={v => set('swotWeaknesses', v)} placeholder="Products, brand, staff, finance, operations, market..." />
        </Row>
        <Row>
          <Field label="Opportunities" value={d.swotOpportunities} onChange={v => set('swotOpportunities', v)} placeholder="External opportunities..." />
          <Field label="Threats" value={d.swotThreats} onChange={v => set('swotThreats', v)} placeholder="External threats..." />
        </Row>
        <Field label="SWOT Action Plan" hint="Can any of your strengths help improve your weaknesses or combat your threats?" value={d.swotActionPlan} onChange={v => set('swotActionPlan', v)} placeholder="How strengths can address weaknesses and threats..." />
        <Row>
          <Field label="SWOT Immediate Goals / Next Steps" value={d.swotImmediateGoals} onChange={v => set('swotImmediateGoals', v)} placeholder="Short-term actions based on SWOT..." />
          <Field label="SWOT Long-Term Goals / Next Steps" value={d.swotLongTermGoals} onChange={v => set('swotLongTermGoals', v)} placeholder="Longer-term strategic goals..." />
        </Row>
        <Field label="Regulatory Changes (Risks & Opportunities)" hint="New laws, licensing requirements, or industry regulations that could affect your business." value={d.regulatoryChanges} onChange={v => set('regulatoryChanges', v)} placeholder="e.g. New environmental regulations could increase costs but also create demand..." />
        <Field label="Technology Shifts (Risks & Opportunities)" hint="Automation, new platforms, outdated equipment, or disruption to your business model." value={d.technologyShifts} onChange={v => set('technologyShifts', v)} placeholder="e.g. AI tools could reduce operational costs but require new training..." />
        <Field label="Economic Conditions (Risks & Opportunities)" hint="Consumer spending trends, inflation, interest rates, economic downturn." value={d.economicConditions} onChange={v => set('economicConditions', v)} placeholder="e.g. Rising interest rates may slow expansion, but demand for value-driven services may increase..." />
        <Field label="Industry Evolution (Risks & Opportunities)" hint="Consolidation, new competitors, changing customer behaviors or expectations." value={d.industryEvolution} onChange={v => set('industryEvolution', v)} placeholder="e.g. More large chains entering local market, but consumers increasingly value local businesses..." />
      </Group>

      {/* ==================== 4. PRODUCT/SERVICE FEATURES AND BENEFITS ==================== */}
      <Group title="Product/Service Features & Benefits" number="4">
        <Field label="Features" hint="What makes your offering distinctive? What does it include, and what sets it apart from alternatives?" value={d.productFeatures} onChange={v => set('productFeatures', v)} placeholder="Key features that differentiate your product or service..." />
        <Field label="Benefits" hint="What the customer actually gains — how does it save them time, reduce costs, solve a problem, or improve their situation?" value={d.productBenefits} onChange={v => set('productBenefits', v)} placeholder="Customer benefits — time saved, costs reduced, problems solved..." />
        <Field label="After-Sales Support" hint="Delivery options, warranties, satisfaction guarantees, service contracts, customer support, training, return/refund policies." value={d.afterSalesSupport} onChange={v => set('afterSalesSupport', v)} placeholder="Warranties, guarantees, support, training, return policies..." />
      </Group>

      {/* ==================== 5. TARGET CUSTOMER ==================== */}
      <Group title="Target Customer" number="5">
        <Field label="Target Customer Description" hint="Describe your ideal customer(s) or buyer persona(s). You may have more than one group." value={d.targetCustomerDescription} onChange={v => set('targetCustomerDescription', v)} placeholder="Describe each target customer group..." />
        <SubTitle>For Individual Consumers</SubTitle>
        <Row cols={3}>
          <Field label="Age" type="text" value={d.consumerAge} onChange={v => set('consumerAge', v)} placeholder="e.g. 25–45" />
          <Field label="Gender" type="text" value={d.consumerGender} onChange={v => set('consumerGender', v)} placeholder="e.g. All / Female" />
          <Field label="Location" type="text" value={d.consumerLocation} onChange={v => set('consumerLocation', v)} placeholder="e.g. Urban metro area" />
        </Row>
        <Row cols={3}>
          <Field label="Income Level" type="text" value={d.consumerIncome} onChange={v => set('consumerIncome', v)} placeholder="e.g. $50K–$100K" />
          <Field label="Occupation" type="text" value={d.consumerOccupation} onChange={v => set('consumerOccupation', v)} placeholder="e.g. Professionals" />
          <Field label="Education Level" type="text" value={d.consumerEducation} onChange={v => set('consumerEducation', v)} placeholder="e.g. College degree+" />
        </Row>
        <SubTitle>For Business Customers (B2B)</SubTitle>
        <Row cols={3}>
          <Field label="Industry" type="text" value={d.businessIndustry} onChange={v => set('businessIndustry', v)} placeholder="e.g. Healthcare" />
          <Field label="Location" type="text" value={d.businessLocation} onChange={v => set('businessLocation', v)} placeholder="e.g. Pacific NW" />
          <Field label="Company Size" type="text" value={d.businessSize} onChange={v => set('businessSize', v)} placeholder="e.g. 10–50 employees" />
        </Row>
        <Row>
          <Field label="Stage of Business" type="text" value={d.businessStage} onChange={v => set('businessStage', v)} placeholder="Startup / Growing / Established" />
          <Field label="Annual Revenue" type="text" value={d.businessRevenue} onChange={v => set('businessRevenue', v)} placeholder="e.g. $1M–$5M" />
        </Row>
      </Group>

      {/* ==================== 6. KEY COMPETITORS ==================== */}
      <Group title="Key Competitors" number="6">
        <Field label="Direct Competitors" hint="List direct competitors — their names, locations, offerings, pricing, and target market." value={d.directCompetitors} onChange={v => set('directCompetitors', v)} placeholder="e.g. Competitor A in [location] offers similar products at $X price targeting [segment]..." />
        <Field label="Indirect Competitors" hint="Businesses that compete for the same consumer dollars or attention but aren't the same category." value={d.indirectCompetitors} onChange={v => set('indirectCompetitors', v)} placeholder="e.g. A restaurant competes with bars, entertainment venues, and delivery services..." />
        <Field label="Unique Selling Proposition (USP)" hint="What makes your business stand out from both direct and indirect competitors?" value={d.usp} onChange={v => set('usp', v)} placeholder="Your unique differentiator..." />
        <Field label="Competitive Strategy" hint="How will you differentiate and compete against each key competitor?" value={d.competitiveStrategy} onChange={v => set('competitiveStrategy', v)} placeholder="Strategy for standing out from each competitor..." />
        <Field label="Competitive Analysis Summary" hint="Summarize how you compare across products, price, quality, service, location, reputation, etc." value={d.competitiveAnalysis} onChange={v => set('competitiveAnalysis', v)} placeholder="Comparison across key competitive factors..." />
      </Group>

      {/* ==================== 7. POSITIONING AND NICHE ==================== */}
      <Group title="Positioning & Niche" number="7">
        <Field label="Positioning Statement" hint="What is your niche — the specific segment you're targeting — and how do you want customers to perceive your business? This statement will inform every marketing and branding decision." value={d.positioningNiche} onChange={v => set('positioningNiche', v)} placeholder="e.g. For [target customer], [business name] is the [category] that provides [key benefit] unlike [competitor] because [differentiator]." />
      </Group>

      {/* ==================== 8. HOW YOU WILL MARKET YOUR BUSINESS ==================== */}
      <Group title="How You Will Market Your Business" number="8">
        <Field label="Advertising Tactics" hint="Paid placements to build awareness and drive traffic — digital ads, print, radio, TV, out-of-home." value={d.advertisingTactics} onChange={v => set('advertisingTactics', v)} placeholder="Digital ads (paid search, social, display), print, radio, TV, out-of-home..." />
        <Field label="Marketing Tactics" hint="Broader efforts to build brand and generate leads — website, social media, email, SEO, content, PR, events, networking, referrals, etc." value={d.marketingTactics} onChange={v => set('marketingTactics', v)} placeholder="Website, social media, email marketing, SEO, content marketing, PR, trade shows, networking, referral programs..." />
        <Field label="Brand Identity" hint="What should customers feel when they encounter your brand? How will visuals reinforce that impression?" value={d.brandIdentity} onChange={v => set('brandIdentity', v)} placeholder="Brand values, visual identity, tone, and the customer experience you want to create..." />
      </Group>

      {/* ==================== 9. PROMOTIONAL BUDGET ==================== */}
      <Group title="Promotional Budget" number="9">
        <Row>
          <Field label="Pre-Launch Marketing Budget ($)" hint="Website build, initial ad campaigns, printed materials, launch event." type="number" value={d.prelaunchBudget} onChange={v => set('prelaunchBudget', v)} placeholder="e.g. 15000" />
          <Field label="Ongoing Marketing Budget ($/month)" hint="Regular monthly or annual marketing spend once you're up and running." type="number" value={d.ongoingBudget} onChange={v => set('ongoingBudget', v)} placeholder="e.g. 2000" />
        </Row>
      </Group>

      {/* ==================== 10. PRICING ==================== */}
      <Group title="Pricing" number="10">
        <div className="mb-5">
          <div className="text-sm font-medium text-foreground mb-1">Pricing Strategy</div>
          <div className="flex gap-2 flex-wrap">
            {['Cost Plus','Value Based','Competitive','Other'].map(s => (
              <Chip
                key={s} as="button" type="button" size="sm"
                variant={d.pricingStrategy === s ? 'solid' : 'bordered'}
                color={d.pricingStrategy === s ? 'primary' : 'default'}
                onClick={() => set('pricingStrategy', s)}
              >
                {s}
              </Chip>
            ))}
          </div>
        </div>
        <Field label="Pricing Explanation" hint="Explain the thinking behind your pricing strategy. How does your price point reinforce your positioning and compare to competitors?" value={d.pricingExplanation} onChange={v => set('pricingExplanation', v)} placeholder="Why you chose this pricing approach and how it aligns with your brand..." />
        <Field label="Major Product/Service Price Points" value={d.pricePoints} onChange={v => set('pricePoints', v)} placeholder="List your key products/services and their prices..." />
        <Field label="Industry / Market Pricing Practices" value={d.industryPricing} onChange={v => set('industryPricing', v)} placeholder="How does your pricing compare to typical industry practices?" />
        <Field label="Competitor Price Comparison" hint="Are your prices higher, lower, or in line with competitors? Explain why." value={d.competitorPriceComparison} onChange={v => set('competitorPriceComparison', v)} placeholder="Comparison with competitor pricing..." />
        <Field label="Customer Credit & Payment Terms" hint="How do you handle payment terms, returns, and disputes?" value={d.creditPaymentTerms} onChange={v => set('creditPaymentTerms', v)} placeholder="Payment methods accepted, credit terms, return policies..." />
      </Group>

      {/* ==================== 11. LOCATION ==================== */}
      <Group title="Location" number="11">
        <Field label="Location Description" hint="Describe your chosen location (or criteria if still deciding). Why is it the right fit for your business and customers?" value={d.locationDescription} onChange={v => set('locationDescription', v)} placeholder="Address, area, and strategic rationale for your location..." />
        <Row>
          <Field label="Customer Accessibility" type="text" value={d.locationAccessibility} onChange={v => set('locationAccessibility', v)} placeholder="Easy to find and reach?" />
          <Field label="Parking" type="text" value={d.locationParking} onChange={v => set('locationParking', v)} placeholder="Adequate for customers and employees?" />
        </Row>
        <Row cols={3}>
          <Field label="Transit & Road Access" type="text" value={d.locationTransit} onChange={v => set('locationTransit', v)} placeholder="Near transit/highways?" />
          <Field label="Type of Space / Zoning" type="text" value={d.locationSpaceType} onChange={v => set('locationSpaceType', v)} placeholder="Retail / Industrial / Office" />
          <Field label="Neighboring Businesses" type="text" value={d.neighboringBusinesses} onChange={v => set('neighboringBusinesses', v)} placeholder="Complementary or conflicting?" />
        </Row>
      </Group>

      {/* ==================== 12. DISTRIBUTION CHANNELS ==================== */}
      <Group title="Distribution Channels" number="12">
        <Field label="Distribution Channels" hint="How does your product or service reach customers? Retail, direct sales, e-commerce, wholesale, inside/outside sales, OEM partnerships." value={d.distributionChannels} onChange={v => set('distributionChannels', v)} placeholder="Your primary and secondary distribution channels..." />
        <Field label="Strategic Partnerships / Key Distributors" hint="Describe any established strategic partnerships or key distributor relationships that give you a competitive advantage." value={d.strategicPartnerships} onChange={v => set('strategicPartnerships', v)} placeholder="Key partners or distributors..." />
      </Group>

      {/* ==================== 13. 12-MONTH SALES FORECAST ==================== */}
      <Group title="12-Month Sales Forecast" number="13">
        <Field label="Key Assumptions" hint="Use this space to document the research and reasoning behind your numbers." value={d.forecastAssumptions} onChange={v => set('forecastAssumptions', v)} placeholder="Your key assumptions driving the forecast..." />
        <Row cols={3}>
          <Field label="Estimated Customers Reached per Month" type="number" value={d.estimatedCustomers} onChange={v => set('estimatedCustomers', v)} placeholder="e.g. 1000" />
          <Field label="Projected Conversion Rate (%)" type="number" min="0" max="100" step="0.1" value={d.conversionRate} onChange={v => set('conversionRate', v)} placeholder="e.g. 5" />
          <Field label="Average Transaction Value ($)" type="number" min="0" step="0.01" value={d.averageTransaction} onChange={v => set('averageTransaction', v)} placeholder="e.g. 50" />
        </Row>
        <Row>
          <Field label="Primary Revenue Source" type="text" value={d.primaryRevenueSource} onChange={v => set('primaryRevenueSource', v)} placeholder="e.g. Product sales, subscriptions" />
          <Field label="Seasonality Notes" type="text" value={d.seasonalityNotes} onChange={v => set('seasonalityNotes', v)} placeholder="e.g. Peak season Q4" />
        </Row>

        <SubTitle>Best Guess Scenario</SubTitle>
        <SalesForecastTable
          sources={d.bestGuessSources}
          rows={d.bestGuessRows}
          totals={bestTotal.totals}
          yearTotal={bestTotal.yearTotal}
          onSourceChange={setBestGuessSource}
          onCellChange={setBestGuessCell}
        />

        <SubTitle>Worst Case Scenario</SubTitle>
        <SalesForecastTable
          sources={d.worstCaseSources}
          rows={d.worstCaseRows}
          totals={worstTotal.totals}
          yearTotal={worstTotal.yearTotal}
          onSourceChange={setWorstCaseSource}
          onCellChange={setWorstCaseCell}
        />

        <Field label="Notes / Assumptions Behind These Projections" value={d.forecastNotes} onChange={v => set('forecastNotes', v)} placeholder="Additional details about your projections..." />
      </Group>
    </SectionPage>
  )
}

/* ---------- Sales forecast table ---------- */

function SalesForecastTable({ sources, rows, totals, yearTotal, onSourceChange, onCellChange }) {
  return (
    <div className="overflow-x-auto mb-5 rounded-xl border border-divider">
      <table className="w-full border-collapse text-xs mt-0">
        <thead>
          <tr className="bg-content2">
            <th className="border-b border-divider px-2 py-2 text-left font-semibold">Revenue Source</th>
            {MONTHS.map(m => <th key={m} className="border-b border-divider px-1.5 py-2 text-center font-semibold">{m}</th>)}
            <th className="border-b border-divider px-2 py-2 text-center font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {[0,1,2,3,4].map(si => (
            <tr key={si} className="border-b border-divider last:border-b-0">
              <td className="px-2 py-1">
                <CellInput value={sources[si]} onChange={v => onSourceChange(si, v)} placeholder={`Source ${si + 1}`} />
              </td>
              {MONTHS.map(m => (
                <td key={m} className="px-1 py-1">
                  <CellInput type="number" align="right" value={rows[si][m]} onChange={v => onCellChange(si, m, v)} />
                </td>
              ))}
              <td className="px-2 py-1 text-right font-semibold whitespace-nowrap">
                ${rows[si][MONTHS[0]] || rows[si][MONTHS[1]] || rows[si][MONTHS[2]] ? rows.reduce((a, m) => a + (parseFloat(rows[si][m]) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-primary-100/20 font-bold">
            <td className="px-2 py-2">TOTAL</td>
            {totals.map((t, i) => (
              <td key={i} className="px-1.5 py-2 text-right">
                ${t.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            ))}
            <td className="px-2 py-2 text-right text-primary">
              ${yearTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}