# Business Starter — Commit b346666 Scenario Feature & Financial Audit

## Part 1 — Feature Design & Code-Review Check

| Item | Verdict | Reason |
| :--- | :--- | :--- |
| **A1. Data Model (JSON Copy vs Normalized)** | **CONCERN** | Unindexed `content` JSON blobs suffer silent schema drift when base sections evolve, lack database-level queryability/constraints, and complicate data migrations. |
| **A2. PATCH Route COALESCE & State** | **CONCERN** | `COALESCE(?, notes)` prevents nulling/clearing fields, `is_default` demotion is non-atomic outside a transaction, and coarse JSON overwrites wipe unmentioned nested keys. |
| **A3. Copy-on-Create & Base Drift UX** | **CONCERN** | Silent divergence misleads users into comparing outdated base assumptions against revised models; requires a base-revision watermark/hash and divergence warning badge. |
| **A4. Autosave, Debounce & Offline Queue** | **CONCERN** | Scenario saves bypass debounce (bursting out-of-order PATCHes), silently drop edits offline without queueing, and mutate client base `sectionData` state in memory. |
| **A5. Compare-Table Metrics & Completeness** | **CONCERN** | Lumping debt service into opex distorts Net Operating Income / margin; table critically omits Upfront Equity Outlay, Payback Period, Break-Even Occupancy, and DSCR. |

---

## Part 2 — Numbers Audit

### 1. Scenario A: AAC Budget Build (Capex & Valuation)

#### Capex Breakdown & Arithmetic Verification
| Cost Item | Base Model | Scenario A Claimed | Scenario A Computed | Variance | Flag (>₱1k / >0.5%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Structural Shell + Roof (260 sqm)** | ₱6,500,000 (@₱25k) | ₱5,070,000 (@₱19.5k) | ₱5,070,000 | ₱0 (0.0%) | OK |
| **Fit-Out Lines (5 items subtotal)** | ₱1,080,000 | ₱1,080,000 | ₱1,080,000 | ₱0 (0.0%) | OK |
| *Parking pad + drainage* | *₱300,000* | *₱300,000* | *₱300,000* | *₱0* | OK |
| *2F partitions / glass / CRs* | *₱220,000* | *₱220,000* | *₱220,000* | *₱0* | OK |
| *Signage band + 8 meters* | *₱180,000* | *₱180,000* | *₱180,000* | *₱0* | OK |
| *Design + permits + CO* | *₱280,000* | *₱280,000* | *₱280,000* | *₱0* | OK |
| *Fence + gate* | *₱100,000* | *₱100,000* | *₱100,000* | *₱0* | OK |
| **Build Subtotal (before contingency)** | ₱7,580,000 | ₱6,150,000 | ₱6,150,000 | ₱0 (0.0%) | OK |
| **Contingency (7% on build)** | ₱530,600 | ₱430,500 | ₱430,500 | ₱0 (0.0%) | OK |
| **Total Build Cost** | ₱8,110,600 | ₱6,580,500 | ₱6,580,500 | ₱0 (0.0%) | OK |
| **Land (300 sqm @ ₱10k/sqm)** | ₱3,000,000 | ₱3,000,000 | ₱3,000,000 | ₱0 (0.0%) | OK |
| **Total Capex (Case A)** | **₱11,110,600** | **₱9,580,500** | **₱9,580,500** | **₱0 (0.0%)** | **OK (Arithmetic)** |
| *JSON `content.VII.categories` Sum* | *₱11,110,600* | *₱9,580,500* | *₱11,110,600* | *+₱1,530,100* | **MISMATCH (13.8%)** |

> **Audit Note on JSON Desync:** While the arithmetic total in `content.VIII.totalStartupInScenario` is ₱9,580,500, the seeded `content.VII.startupCosts.categories` list was never updated and retains the unhaircut Base categories (summing to ₱11,110,600). The compare table references `startupCosts.totalNote`, displaying the stale ₱11.11M total.

#### Rent Roll & Rent Haircut Audit
| Revenue Metric | Base Model | Scenario A Claimed | Scenario A Computed | Variance | Flag (>₱1k / >0.5%) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Y1 Ramp Revenue** | ₱221,400 | ₱214,758 | ₱214,758 (Base × 0.97) | ₱0 (0.0%) | OK (Arithmetic) |
| **Y2 Stabilized Revenue** | ₱718,200 | ₱696,654 | ₱696,654 (Base × 0.97) | ₱0 (0.0%) | OK (Arithmetic) |
| **Y3 Escalated Revenue** | ₱756,000 | ₱733,320 | ₱733,320 (Base × 0.97) | ₱0 (0.0%) | OK (Arithmetic) |
| **Annual Operating Expenses** | ₱154,276 | ₱154,276 | ₱154,276 | ₱0 (0.0%) | OK |
| *JSON `threeYearRevenueY2/Y3`* | *₱718k / ₱756k* | *₱697k / ₱733k* | *₱718,200 / ₱756,000* | *Stale base data* | **MISMATCH (JSON)** |

- **Is a 3% rent haircut defensible for AAC?** **NO (Indefensible).** In the Philippine commercial leasing market, AAC is considered a modern, superior walling alternative to CHB due to superior thermal insulation (lowering tenant HVAC bills), flatter surfaces (clean skim coat vs rough plaster), and higher fire resistance. Commercial tenants lease space based on location, frontage, foot traffic, and usable area; they demand **0% haircut** for AAC walls over CHB. Anchoring specialized equipment requires nylon toggle anchors, but this is a fit-out spec detail, not a rental discount driver.
- **Is ₱19,500/sqm defensible for AAC commercial shell in 2026?** **YES (Defensible).** The ₱19,500/sqm rate applies strictly to the bare two-storey structural frame, roof, and AAC wall envelope (₱5.07M for 260 sqm GFA). Site works, fit-out, permits, and contingency are separated into other lines, bringing all-in build cost to **₱25,310/sqm GFA**. Compared to GLI Bahay Build ep31 (real-world residential AAC at ₱16,823/sqm all-in) and Constructioncost.ph Cauayan standard (₱29,750/sqm including full residential interior finishes), a commercial warm-shell excludes residential interior cabinetry/flooring/fixtures while AAC cuts structural dead load and wall labor.

---

### 2. Scenario B: Bank-Financed ₱6M @ 7.35% × 10 Yrs

#### Debt Service & Amortization
| Loan Metric | Claimed (Prompt / JSON) | Computed Exact | Variance | Flag (>₱1k / >0.5%) |
| :--- | :--- | :--- | :--- | :--- |
| **Monthly Amortization (PMT)** | ₱71,317 (Prompt) / ₱70,752 (JSON) | ₱70,752.21 | −₱564.79 vs Prompt<br>+₱0.21 vs JSON | **MISMATCH vs Prompt (0.80%)** |
| **Annual Debt Service** | ₱849,027 (JSON line) | ₱849,026.55 | −₱0.45 (0.0%) | OK |
| **Effective Interest Rate** | 7.35% nominal | 7.35% (JSON: 7.35% / Prompt: 7.53%) | +0.18% in prompt | MISMATCH in prompt |

#### Net Income Verification (Base Net − Debt Service ₱849,027)
| Year | Base Net | Less Debt Service | Scenario B Claimed | Scenario B Computed | Variance | Flag |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Y1 Net** | ₱67,124 | ₱849,027 | −₱781,903 | −₱781,903 | ₱0 | OK (Arithmetic) |
| **Y2 Net** | ₱563,924 | ₱849,027 | −₱285,103 | −₱285,103 | ₱0 | OK (Arithmetic) |
| **Y3 Net** | ₱601,724 | ₱849,027 | −₱247,303 | −₱247,303 | ₱0 | OK (Arithmetic) |

> **Accounting & JSON Distortion:** Scenario B embeds principal + interest amortization into `operatingExpenses`. Principal repayment is a financing cash flow, not an operating expense; expensing it distorts operating margin. Additionally, Scenario B's `threeYearEndingCash` fields in JSON still show the unfinanced positive balances (₱267k, ₱831k, ₱1.43M), and `totalLoanFinancing` in VII remains ₱0.

#### DSCR & Coverage Verification
| Metric | Claimed | Computed Exact | Variance | Flag (>₱1k / >0.5%) |
| :--- | :--- | :--- | :--- | :--- |
| **Monthly Opex** | ₱12,856.33 | ₱12,856.33 | ₱0.00 | OK |
| **Monthly Debt Service** | ₱70,752.21 | ₱70,752.21 | ₱0.00 | OK |
| **Rent Roll for DSCR = 1.0 (NOI = PMT)** | **≥ ₱115,000/mo** | **₱83,608.55/mo** | **−₱31,391.45/mo** | **MISMATCH (27.3%)** |
| **DSCR at Claimed ₱115,000/mo Rent** | 1.00× | **1.44×** (NOI ₱102,144 / PMT ₱70,752) | +0.44× | **MISMATCH** |
| **Gross Cash Coverage at ₱115,000/mo** | 1.00× | **1.38×** (Rent / [Opex + PMT]) | +0.38× | MISMATCH |

- **DSCR Verdict:** The claim that "DSCR crosses 1.0 only at rent roll ≥ ₱115K/mo" is **mathematically false**. Net Operating Income covers debt service (DSCR = 1.0) at **₱83,609/mo**. The ₱115,000/mo threshold achieves a **1.44× DSCR**, which reflects standard commercial bank debt-covenant approval requirements (typically 1.25×–1.40×), but is not the 1.0 breakeven line.

#### Bank Lending Terms Realism (Philippines 2025–2026)
- **7.35% Interest Rate:** **REALISTIC (Prime Band).** Following BSP benchmark easing to 4.75%–5.0%, Philippine commercial bank rates for secured SME property loans range between **6.5% and 8.5%** for prime borrowers with strong collateral.
- **10-Year Fixed Term Structure:** **UNREALISTIC.** Philippine universal banks (BDO, BPI, Metrobank, Security Bank) do not fix commercial real estate loans for 10 years. Standard terms fix rates for **1, 3, or 5 years**, after which loans reprice annually against PHP BVAL benchmark rates plus bank spread. Tenors for commercial property builds are frequently capped at 5 to 7 years or require balloon structures. Assuming an unhedged 10-year fixed rate ignores repricing risk.

---

### Summary of Flagged Mismatches (>₱1,000 or >0.5%)

1. **Scenario A JSON Category Desync:** `content.VII.startupCosts.categories` sums to **₱11,110,600** vs claimed **₱9,580,500** (Variance: **+₱1,530,100 / 13.8%**).
2. **Scenario B Monthly Amortization:** Claimed in prompt **₱71,317/mo** vs computed **₱70,752.21/mo** (Variance: **+₱564.79/mo / 0.80%**, reflecting a ~7.53% rate).
3. **Scenario B DSCR = 1.0 Breakeven Rent:** Claimed **₱115,000/mo** vs computed **₱83,608.55/mo** (Variance: **−₱31,391.45/mo / 27.3%**; actual DSCR at ₱115k is **1.44×**).
4. **Scenario A & B Three-Year P&L / Ending Cash Fields:** Secondary projection fields in the JSON retain unhaircut / unfinanced base numbers instead of scenario values.
