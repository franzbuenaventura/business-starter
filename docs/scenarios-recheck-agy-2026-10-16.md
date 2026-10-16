# Senior Reviewer Audit: Scenario Scope Lock & Modal Fixes

---

### Task A. SCOPE-LOCK CORRECTNESS
**Verdict: ISSUE**

1. **Catastrophic State Leak to Base Rows via `setSectionData`**
   - **Location:** [src/App.jsx:716](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L716)
   - **Mechanism:** `saveScenarioSection` executes `setSectionData(prev => ({ ...prev, [key]: content })) // keep dashboard live`. `sectionData` is the in-memory representation of the **base plan**. Mutating it causes three distinct leaks:
     - **Base row overwrite on scenario exit:** When the user returns to "Base model", `activeScenario` becomes `null`. `scenarioOverride` falls back to `sectionData` (now holding scenario edits). Any subsequent edit or autosave in base mode runs `scheduleSave` and overwrites the SQLite `plan_sections` base rows. (In fact, [base_plan9_vii_viii.json#L120](file:///tmp/agy_recheck_corpus/base_plan9_vii_viii.json#L120) and [#L282-L296](file:///tmp/agy_recheck_corpus/base_plan9_vii_viii.json#L282-L296) already exhibit AAC scenario contamination from this exact flaw).
     - **Base-only PDF export contamination:** `handleExportPDF` ([src/App.jsx:840](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L840)) reads directly from `sectionData[s.key]`. Once edited in scenario mode, exports are no longer base-only.
     - **Comparison & clone corruption:** `<ScenarioBar>` receives `baseVIII={sectionData?.VIII}` ([src/App.jsx:929](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L929)). Its "Base model" comparison column and the `+ New` clone payload ([ScenarioBar.jsx:57](file:///tmp/agy_recheck_corpus/ScenarioBar.jsx#L57)) both ingest the scenario's numbers as base.
   - **Fix:** In `src/App.jsx:716`, remove `setSectionData(prev => ({ ...prev, [key]: content }))`. Only update scenario state via `setActiveScenario(updated)`. Calculate completion and progress from `scenarioOverride`, not `sectionData`.

2. **Unflushed Base Save Race Condition on Auto-Jump**
   - **Location:** [src/App.jsx:759](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L759) & [src/App.jsx:929](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L929)
   - **Mechanism:** If a user edits Section VII under Base mode and activates a scenario within the 1500ms debounce window, `onActiveChange` invokes `handleTabSwitch('VII')`. Because `activeTab === 'VII'`, `handleTabSwitch` returns early (`if (newKey === activeTab) return`), bypassing `flushSave()`. 1.5s later, the stale timer fires into `PUT /sections/VII` while the user is actively working in the scenario.
   - **Fix:** In `onActiveChange`, unconditionally flush pending saves before setting scenario state: `if (saveTimerRef.current) flushSave()`.

3. **Silent Drop on Offline Scenario Save**
   - **Location:** [src/App.jsx:705-708](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L705-L708)
   - **Mechanism:** If `!navigator.onLine`, `saveScenarioSection` flashes `'saved'` but discards changes without queueing to `business-starter-offline-queue`.

---

### Task B. LOCK-UI COMPLETENESS
**Verdict: ISSUE**

1. **`pointer-events-none` Does Not Prevent Keyboard Focus or Input**
   - **Location:** [src/App.jsx:1046-1049](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L1046-L1049) (`scope_lock.diff`)
   - **Mechanism:** CSS `pointer-events: none` only intercepts cursor/touch actions; it has zero effect on keyboard focus. Any user can `Tab` into inputs, textareas, selects, and buttons inside locked sections I–VI, IX, and X.
   - **Consequences:** 
     - Keystrokes fire `onChange`, updating `localData` in `SectionRouter` ([src/App.jsx:1016](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L1016)) and setting `dirtyRef.current = true`. 
     - Pressing `Enter` triggers form submissions.
     - Screen readers still announce inputs as fully interactive.
     - While `onSave` drops the write in scenario mode, when the user switches back to "Base model", `locked` becomes false, `localData` retains the typed modifications, and the subsequent user edit persists the polluted text to the base row.
   - **Fix:** Apply the HTML `inert` attribute to the container when locked:
     ```jsx
     <div
       className={locked ? "relative select-none opacity-60 pointer-events-none" : "relative"}
       inert={locked ? "" : undefined}
       aria-disabled={locked}
     >
       <SectionComponent data={localData} onChange={handleChange} />
       {locked && <div className="absolute inset-0" aria-hidden="true" />}
     </div>
     ```

---

### Task C. FINANCIAL CONSISTENCY
**Verdict: ISSUE**

#### 1. Scenario 3: "AAC budget build (GLI-validated)" ([scenarios_prod.json:323](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L323))
- **`revenueItems` Typo (+₱100,000):** [scenarios_prod.json:361](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L361) has `"amount": "172000"` for GF Unit 1 instead of `72000` (5 mos @ ₱14,400 = ₱72,000). This inflates `revenueItems` sum to ₱321,400 (vs projected ₱221,400) and distorts the `ScenarioBar` comparison table (NOI ₱167,127 vs actual ₱67,124).
- **`VII.expenses` is 100% Stale Base Data:** [scenarios_prod.json:560-601](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L560-L601) retains the base shell (`6500000`) and base contingency (`530600`), summing to ₱11,110,600, while `startupCosts.categories` correctly sums to ₱9,580,500 (AAC shell `5070000`, contingency `430500`).
- **Stale Base Reserves & Explanation Artifacts:** `contingencyReserve` is `530600` (should be `430500`), and `startupExpensesExplanation` ([scenarios_prod.json:604](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L604)) cites base `₱11,110,600` with test keystrokes (`iopiop`).
- **Balance Sheet:** Content VII balances (Assets ₱9,580,500 == Equity ₱9,580,500 + Liabilities ₱0).

#### 2. Scenario 2: "Bank-financed ₱6M @ 7.35%" ([scenarios_prod.json:2](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L2))
- **`cashOutflowItems` Grid Desync (-₱849,027 mismatch):** [scenarios_prod.json:134-152](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L134-L152) lists only base opex (₱12,856/mo = ₱154,276/yr), completely omitting the ₱70,752.21/mo (₱849,027/yr) debt service. The cash grid net (+₱67,124) directly contradicts `cashFlowSummary.y1` (-₱781,903) and `threeYearEndingCashY1` (-₱581,903).
- **Stale `expenseProjections` Array:** [scenarios_prod.json:25-32](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L25-L32) retains base opex projections (`y1: 154273, y2: 154273, y3: 154273`) instead of reflecting the ~₱1,003,300 annual expense with debt service.
- **Stale "No Debt" Narrative Copies:** `VIII.balanceSheetSummary` ([scenarios_prod.json:43](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L43)), `VIII.balanceSheetNotes` ([#L192](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L192)), `VII.capitalSources` ([#L246](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L246)), and `VII.capitalizationNotes` ([#L301](file:///tmp/agy_recheck_corpus/scenarios_prod.json#L301)) all copy base text claiming "No debt", and line 300 contains test keystrokes (`tyuty`).
- **Missing Metric Key:** `VIII.totalStartupInScenario` is absent, causing `ScenarioBar` to render `—` for startup capex.
- **Balance Sheet:** Content VII balances (Assets ₱11,110,600 == Debt ₱6,000,000 + Equity ₱5,110,600).

---

### Task D. REGRESSIONS
**Verdict: ISSUE**

1. **Global Modal Breakages (`modal_blur_css.diff`)**
   - **Dialog Scrolling & Sticky Header/Footer Breakage:** [src/styles.css:109-118](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/styles.css#L109-L118) forces `position: fixed !important; transform: translate(-50%, -50%) !important; overflow: auto !important;` on `section` (HeroUI's `ModalContent`). This turns the outer dialog container into the scroller. In tall modals (e.g., "New Business Plan" template selector, "AI Draft Preview"), `ModalHeader` and `ModalFooter` (action buttons) scroll out of view, or create double scrollbars against `ModalBody`.
   - **HeroUI Placement & Motion Override:** Hardcoded centering and transforms break HeroUI's `placement` props (`top`, `bottom`) and override Framer-Motion transition transforms, causing modal pop-in and abrupt closing glitches across all modals.
   - **Print View Contamination:** Neither `styles.css` nor `print.css` hides active modal overlays in `@media print`. If a print action is triggered while any modal/portal is mounted, the `background: rgba(0, 0, 0, 0.45)` backdrop and fixed dialog print across all document pages.
   - **Fix:** Scope overrides strictly to `.scenario-modal` or `#scenario-portal`, wrap in `@media screen`, and avoid putting `overflow: auto !important` on `<section>`.

2. **Auto-Jump to VII Navigation Bug (`scope_lock.diff`)**
   - **Location:** [src/App.jsx:929](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L929)
   - **Mechanism:** `onActiveChange={(sc) => { setActiveScenario(sc); if (sc) handleTabSwitch('VII') }}`
   - **Bug:** Section VIII (Financial Plan) is a valid, fully editable scenario section. If a user is working on Section VIII and switches between scenarios in the dropdown, the handler forcefully kicks them back to Section VII.
   - **Fix:** Only jump if the user is currently on a locked tab:
     ```jsx
     onActiveChange={(sc) => {
       if (saveTimerRef.current) flushSave()
       setActiveScenario(sc)
       if (sc && activeTab !== 'VII' && activeTab !== 'VIII') handleTabSwitch('VII')
     }}
     ```
II Workflow**
   * **Location**: [`src/App.jsx:929`](file:///Users/mrkrabs/.openclaw/workspace/business-starter/src/App.jsx#L929)
   * **Problem**: `if (sc) handleTabSwitch('VII')` unconditionally kicks the user out of Section VIII (Financial Plan) to Section VII when selecting a scenario, even though Section VIII is also an unlocked scenario section.
   * **Fix**: Restrict auto-jump to non-financial tabs:
     ```javascript
     if (sc && activeTab !== 'VII' && activeTab !== 'VIII') handleTabSwitch('VII')
     ```
