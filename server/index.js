import express from 'express'
import cors from 'cors'
import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SECTIONS = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
const SECTION_LABELS = { I:'Executive Summary', II:'Company Description', III:'Products & Services', IV:'Marketing Plan', V:'Operational Plan', VI:'Management & Organization', VII:'Startup Expenses & Capitalization', VIII:'Financial Plan', IX:'Appendices', X:'Refining the Plan' }
const STATUSES = ['draft', 'in-progress', 'complete']

// AI Draft: section prompt templates
const SECTION_TEMPLATES = {
  I: `Generate an executive summary for a business plan. Return a JSON object with these fields:
- businessIdea: 1-2 sentence overview of what the business is and why it matters
- productService: what the product/service is and what problem it solves
- businessModel: how the business makes money, primary revenue streams
- goals1Year: realistic 1-year goals
- goals3Year: realistic 3-year goals
- goals5Year: realistic 5-year goals
- customerAcquisition: how to reach and attract target customers
- targetMarket: who the ideal customers are
- competition: key competitors and competitive edge
- managementTeam: highlights of the management team experience
- financialOutlook: financial outlook and financing needs
- evidenceOfTraction: any early traction evidence`,
  II: `Generate a company description for a business plan. Return a JSON object with these fields:
- missionStatement: concise mission statement
- philosophyValues: core values and principles
- companyVision: long-term vision
- shortTermGoals: 1-2 year goals
- longTermGoals: 3-5+ year goals
- keyMilestones: measurable milestones
- targetMarketDescription: ideal customer description
- industryDescription: industry description and trends
- competitiveLandscape: key competitors
- legalStructure: business structure (LLC, sole prop, etc.)
- ownershipStructure: ownership/equity breakdown`,
  III: `Generate a products and services section for a business plan. Return a JSON object with fields covering: productDescription, pricingStructure, competitiveAdvantages, productionProcess, intellectualProperty, and futureProductPlans. Use realistic, specific content.`,
  IV: `Generate a marketing plan section for a business plan. Return a JSON object with fields covering: marketResearch, targetMarketAnalysis, positioningStrategy, marketingChannels, advertisingStrategy, salesStrategy, pricingStrategy, and marketingBudget. Use realistic, specific content.`,
  V: `Generate an operational plan section for a business plan. Return a JSON object with fields covering: businessLocation, facilities, equipment, productionProcess, supplyChain, qualityControl, staffingRequirements, and operationalTimeline. Use realistic, specific content.`,
  VI: `Generate a management and organization section for a business plan. Return a JSON object with fields covering: managementTeam, organizationalStructure, boardOfAdvisors, staffingPlan, compensationStrategy, and governance. Use realistic, specific content.`,
  VII: `Generate a startup expenses and capitalization section for a business plan. Return a JSON object with fields covering: startupCosts, capitalSources, fundingTimeline, useOfFunds, and breakevenAnalysis. Use realistic, specific content.`,
  VIII: `Generate a financial plan section for a business plan. Return a JSON object with fields covering: revenueProjections, expenseProjections, cashFlowSummary, profitLossSummary, balanceSheetSummary, and financialAssumptions. Use realistic, specific content.`,
  IX: `Generate an appendices section for a business plan. Return a JSON object with fields covering: supportingDocuments, resumes, marketResearchData, productSamples, legalDocuments, and additionalReferences. Use realistic, specific content.`,
  X: `Generate a refining the plan section for a business plan. Return a JSON object with fields covering: reviewChecklist, keyRisks, mitigationStrategies, implementationTimeline, milestoneTracking, and planUpdateSchedule. Use realistic, specific content.`,
}


function hasSectionData(content) {
  if (!content) return false
  let parsed = content
  if (typeof content === 'string') {
    try { parsed = JSON.parse(content) } catch { return false }
  }
  if (!parsed || typeof parsed !== 'object') return false
  return Object.values(parsed).some(v => {
    if (v == null) return false
    if (typeof v === 'string') return v.trim() !== ''
    if (Array.isArray(v)) return v.length > 0
    if (typeof v === 'object') return Object.values(v).some(x => x != null && String(x).trim() !== '')
    return true
  })
}

function autoCalcStatus(db, planId) {
  const result = db.exec(`SELECT section_key, content FROM plan_sections WHERE plan_id = ${planId}`)
  const sections = result.length > 0 ? rowsToObjects(result) : []
  const filled = sections.filter(s => hasSectionData(s.content)).length
  if (filled === 0) return 'draft'
  if (filled >= 10) return 'complete'
  return 'in-progress'
}

function getBusinessStatus(db, business) {
  if (business.status && STATUSES.includes(business.status)) return business.status
  return autoCalcStatus(db, business.id)
}

function rowsToObjects(result) { if (!result || result.length === 0) return []; const cols = result[0].columns; return result[0].values.map(row => { const obj = {}; cols.forEach((col, i) => { obj[col] = row[i] }); return obj }) }
function rowToObject(result) { return rowsToObjects(result)[0] || null }

/* ── Auth helpers ───────────────────────────────────────────── */

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex')
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex')
}

function isPinSet(db) {
  const result = db.exec("SELECT value FROM auth_settings WHERE key = 'pin_hash'")
  return !!(result && result.length > 0 && result[0].values[0][0])
}

function createSession(db, persistFn) {
  const token = generateToken()
  db.run('INSERT INTO sessions (token, created_at) VALUES (?, datetime("now"))', [token])
  if (persistFn) persistFn()
  return token
}

function isValidSession(db, token) {
  if (!token) return false
  const result = db.exec(`SELECT token FROM sessions WHERE token = '${token.replace(/'/g, "''")}'`)
  return !!(result && result.length > 0)
}

/* ── Auth middleware ────────────────────────────────────────── */

function authMiddleware(db) {
  return (req, res, next) => {
    // Skip auth for auth endpoints and non-API routes
    if (req.path.startsWith('/api/auth')) return next()
    if (!req.path.startsWith('/api')) return next()

    // Open mode: if no PIN is set, allow all requests
    if (!isPinSet(db)) return next()

    // Protected: require valid token
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const token = auth.slice(7)
    if (!isValidSession(db, token)) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }
    next()
  }
}

/**
 * Create an Express app wired to the given sql.js Database instance.
 * @param {import('sql.js').Database} db
 * @param {Function} [persistFn] - optional persist callback after writes
 * @returns {import('express').Express}
 */
function createApp(db, persistFn) {
  const app = express()
  app.use(cors())
  app.use(express.json())

  // Auth middleware – must be before API routes
  app.use(authMiddleware(db))

  const distPath = path.join(__dirname, '..', 'dist')
  if (fs.existsSync(distPath)) app.use(express.static(distPath))

  /* ── Auth endpoints ──────────────────────────────────────── */

  app.get('/api/auth/status', (req, res) => {
    res.json({ pinSet: isPinSet(db) })
  })

  app.post('/api/auth/setup', (req, res) => {
    const { pin } = req.body
    if (!pin || pin.length < 4) return res.status(400).json({ error: 'PIN must be at least 4 characters' })
    if (isPinSet(db)) return res.status(409).json({ error: 'PIN has already been set' })
    db.run("INSERT INTO auth_settings (key, value) VALUES ('pin_hash', ?)", [sha256(pin)])
    const token = createSession(db, persistFn)
    if (persistFn) persistFn()
    res.status(201).json({ token })
  })

  app.post('/api/auth/login', (req, res) => {
    const { pin } = req.body
    if (!pin) return res.status(400).json({ error: 'PIN is required' })
    if (!isPinSet(db)) return res.status(400).json({ error: 'PIN has not been set. Use /api/auth/setup first.' })
    const storedHash = db.exec("SELECT value FROM auth_settings WHERE key = 'pin_hash'")[0].values[0][0]
    if (sha256(pin) !== storedHash) return res.status(401).json({ error: 'Incorrect PIN' })
    const token = createSession(db, persistFn)
    if (persistFn) persistFn()
    res.json({ token })
  })

  app.post('/api/auth/logout', (req, res) => {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7)
      db.run('DELETE FROM sessions WHERE token = ?', [token])
      if (persistFn) persistFn()
    }
    res.json({ ok: true })
  })

  /* ── Business endpoints ──────────────────────────────────── */

  app.get('/api/businesses', (req, res) => {
    const businesses = rowsToObjects(db.exec('SELECT * FROM businesses ORDER BY id DESC'))
    businesses.forEach(b => { b.status = getBusinessStatus(db, b) })
    res.json(businesses)
  })

  app.post('/api/businesses', (req, res) => {
    const { name, industry } = req.body
    if (!name) return res.status(400).json({ error: 'Name is required' })
    db.run('INSERT INTO businesses (name, industry) VALUES (?, ?)', [name, industry || null])
    const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0]
    const business = rowToObject(db.exec('SELECT * FROM businesses WHERE id = ' + id))
    if (persistFn) persistFn()
    res.status(201).json(business)
  })

  app.get('/api/businesses/:id', (req, res) => {
    const business = rowToObject(db.exec(`SELECT * FROM businesses WHERE id = ${req.params.id}`))
    if (!business) return res.status(404).json({ error: 'Not found' })
    business.status = getBusinessStatus(db, business)
    const sections = rowsToObjects(db.exec(`SELECT section_key, content FROM plan_sections WHERE plan_id = ${req.params.id}`))
    business.sections = {}
    sections.forEach(s => { business.sections[s.section_key] = s.content ? JSON.parse(s.content) : null })
    res.json(business)
  })

  app.delete('/api/businesses/:id', (req, res) => {
    db.run('DELETE FROM plan_sections WHERE plan_id = ?', [req.params.id])
    db.run('DELETE FROM businesses WHERE id = ?', [req.params.id])
    if (persistFn) persistFn()
    res.status(204).end()
  })

  app.get('/api/businesses/:id/sections/:key', (req, res) => {
    const result = db.exec(`SELECT content FROM plan_sections WHERE plan_id = ${req.params.id} AND section_key = '${req.params.key}'`)
    if (!result || result.length === 0) return res.json({ content: null })
    const content = result[0].values[0][0]
    res.json({ content: content ? JSON.parse(content) : null })
  })

  app.put('/api/businesses/:id/sections/:key', (req, res) => {
    const { id, key } = req.params
    const contentStr = JSON.stringify(req.body.content || {})
    db.run(`INSERT INTO plan_sections (plan_id, section_key, content, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(plan_id, section_key) DO UPDATE SET content = excluded.content, updated_at = datetime('now')`, [id, key, contentStr])
    if (persistFn) persistFn()
    res.json({ ok: true })
  })

  app.put('/api/businesses/:id/status', (req, res) => {
    const { status } = req.body
    if (status && !STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' })
    db.run('UPDATE businesses SET status = ? WHERE id = ?', [status || null, req.params.id])
    if (persistFn) persistFn()
    const business = rowToObject(db.exec('SELECT * FROM businesses WHERE id = ' + req.params.id))
    if (business) business.status = getBusinessStatus(db, business)
    res.json(business || { error: 'Not found' })
  })

  app.get('/api/sections', (req, res) => { res.json(SECTIONS.map(key => ({ key, label: SECTION_LABELS[key] || key }))) })

  // Export all businesses + their sections as JSON
  app.get('/api/export', (req, res) => {
    const businesses = rowsToObjects(db.exec('SELECT * FROM businesses ORDER BY id DESC'))
    const sections = rowsToObjects(db.exec('SELECT plan_id, section_key, content FROM plan_sections ORDER BY plan_id, section_key'))
    const sectionMap = {}
    sections.forEach(s => {
      if (!sectionMap[s.plan_id]) sectionMap[s.plan_id] = {}
      sectionMap[s.plan_id][s.section_key] = s.content ? JSON.parse(s.content) : null
    })
    businesses.forEach(b => {
      b.sections = sectionMap[b.id] || {}
    })
    res.setHeader('Content-Disposition', 'attachment; filename="business-starter-backup.json"')
    res.json({ version: 1, exportedAt: new Date().toISOString(), businesses })
  })

  // Import businesses + sections from a JSON backup
  app.post('/api/import', (req, res) => {
    const backup = req.body
    if (!backup || !Array.isArray(backup.businesses)) {
      return res.status(400).json({ error: 'Invalid backup format: expected { businesses: [...] }' })
    }
    let imported = 0
    for (const b of backup.businesses) {
      if (!b.name) continue
      db.run('INSERT INTO businesses (name, industry) VALUES (?, ?)', [b.name, b.industry || null])
      const newId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0]
      if (b.sections && typeof b.sections === 'object') {
        for (const [key, content] of Object.entries(b.sections)) {
          const contentStr = content ? JSON.stringify(content) : null
          db.run('INSERT INTO plan_sections (plan_id, section_key, content, updated_at) VALUES (?, ?, ?, datetime(\'now\'))', [newId, key, contentStr])
        }
      }
      imported++
    }
    if (persistFn) persistFn()
    res.status(201).json({ imported, message: `Imported ${imported} business plan(s)` })
  })

  // AI Draft: generate draft content for a section using glm-5.2:cloud
  app.post('/api/ai-draft', async (req, res) => {
    const { businessId, sectionId } = req.body
    if (!businessId || !sectionId) {
      return res.status(400).json({ error: 'businessId and sectionId are required' })
    }
    const template = SECTION_TEMPLATES[sectionId]
    if (!template) {
      return res.status(400).json({ error: 'Unknown section: ' + sectionId })
    }
    const business = rowToObject(db.exec('SELECT * FROM businesses WHERE id = ' + businessId))
    if (!business) {
      return res.status(404).json({ error: 'Business not found' })
    }
    const sectionLabel = SECTION_LABELS[sectionId] || sectionId
    const businessName = business.name || 'the business'
    const industry = business.industry || 'unspecified'
    const prompt = `You are a business plan writing assistant. Write a ${sectionLabel} section for a business plan. The business name is "${businessName}" and the industry is "${industry}". ${template} Return ONLY a valid JSON object, no markdown formatting, no code fences, no explanation. Every field value should be a string with realistic, professional content (2-4 sentences each).`

    try {
      const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat'
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 120000)
      const ollamaRes = await fetch(ollamaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'glm-5.2:cloud',
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!ollamaRes.ok) {
        const errText = await ollamaRes.text().catch(() => 'unknown error')
        return res.status(502).json({ error: 'AI service error: ' + ollamaRes.status, detail: errText })
      }
      const ollamaData = await ollamaRes.json()
      let text = ollamaData.message?.content || ollamaData.content || ''
      // Strip markdown code fences if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch {
        // Try to extract JSON from the text
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
          try { parsed = JSON.parse(match[0]) } catch { parsed = null }
        } else {
          parsed = null
        }
      }
      if (!parsed || typeof parsed !== 'object') {
        return res.status(502).json({ error: 'AI returned non-JSON response', raw: text.substring(0, 500) })
      }
      res.json({ content: parsed, sectionId, businessName, industry })
    } catch (e) {
      res.status(500).json({ error: 'AI draft failed', detail: String(e) })
    }
  })

  // Templates: list available industry templates
  app.get('/api/templates', (req, res) => {
    const templates = [
      { id: 'restaurant', name: 'Restaurant & Food Service', description: 'Full-service Italian trattoria with house-made pasta and wood-fired pizza' },
      { id: 'retail', name: 'Retail / Fashion', description: 'Omnichannel fashion boutique with e-commerce and physical showroom' },
      { id: 'consulting', name: 'Professional Consulting', description: 'Digital transformation consulting for small-to-mid-sized businesses' },
      { id: 'tech-startup', name: 'Technology / SaaS', description: 'Project management SaaS for small teams — simple and affordable' },
    ]
    res.json(templates)
  })

  // Templates: create a business from a template
  app.post('/api/businesses/from-template', (req, res) => {
    const { templateId, name, industry } = req.body
    if (!templateId) return res.status(400).json({ error: 'templateId is required' })

    const templatePath = path.join(__dirname, '..', 'src', 'data', 'templates', `${templateId}.json`)
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ error: 'Template not found' })
    }

    try {
      const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'))
      const bizName = name || template.name
      const bizIndustry = industry || template.industry

      if (!bizName) return res.status(400).json({ error: 'Name is required' })

      db.run('INSERT INTO businesses (name, industry) VALUES (?, ?)', [bizName, bizIndustry || null])
      const id = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0]

      // Insert all template sections
      if (template.sections) {
        for (const [key, content] of Object.entries(template.sections)) {
          db.run(`INSERT INTO plan_sections (plan_id, section_key, content, updated_at) VALUES (?, ?, ?, datetime('now'))`,
            [id, key, JSON.stringify(content)])
        }
      }

      const business = rowToObject(db.exec('SELECT * FROM businesses WHERE id = ' + id))
      if (persistFn) persistFn()
      res.status(201).json(business)
    } catch (e) {
      res.status(500).json({ error: 'Failed to create from template', detail: String(e) })
    }
  })

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' })
    const indexPath = path.join(distPath, 'index.html')
    if (fs.existsSync(indexPath)) res.sendFile(indexPath)
    else res.status(200).send('Business Starter API running. Build the frontend with `npm run build`.')
  })

  return app
}

/**
 * Create a fresh in-memory sql.js server (used by tests).
 */
async function createTestServer() {
  const SQL = await initSqlJs()
  const db = new SQL.Database()
  db.run(`CREATE TABLE IF NOT EXISTS businesses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, industry TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.run(`CREATE TABLE IF NOT EXISTS plan_sections (id INTEGER PRIMARY KEY AUTOINCREMENT, plan_id INTEGER NOT NULL, section_key TEXT NOT NULL, content TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (plan_id) REFERENCES businesses(id) ON DELETE CASCADE, UNIQUE (plan_id, section_key))`)
  db.run(`CREATE TABLE IF NOT EXISTS auth_settings (key TEXT PRIMARY KEY, value TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  const app = createApp(db)
  return app
}

// --- Standalone server startup (only when run directly) ---
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'app.db')
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })

  const SQL = await initSqlJs()
  let db
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`CREATE TABLE IF NOT EXISTS businesses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, industry TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.run(`CREATE TABLE IF NOT EXISTS plan_sections (id INTEGER PRIMARY KEY AUTOINCREMENT, plan_id INTEGER NOT NULL, section_key TEXT NOT NULL, content TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (plan_id) REFERENCES businesses(id) ON DELETE CASCADE, UNIQUE (plan_id, section_key))`)
  db.run(`CREATE TABLE IF NOT EXISTS auth_settings (key TEXT PRIMARY KEY, value TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)

  // Migration: add status column if missing (existing DBs)
  try {
    db.exec('ALTER TABLE businesses ADD COLUMN status TEXT')
  } catch (e) { /* column already exists */ }

  function persist() { const data = db.export(); fs.writeFileSync(dbPath, Buffer.from(data)) }

  const app = createApp(db, persist)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => { console.log(`Business Starter server running on http://localhost:${PORT}`) })
}

export { createApp, createTestServer }
