import express from 'express'
import cors from 'cors'
import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SECTIONS = ['I','II','III','IV','V','VI','VII','VIII','IX','X']
const SECTION_LABELS = { I:'Executive Summary', II:'Company Description', III:'Products & Services', IV:'Marketing Plan', V:'Operational Plan', VI:'Management & Organization', VII:'Startup Expenses & Capitalization', VIII:'Financial Plan', IX:'Appendices', X:'Refining the Plan' }

function rowsToObjects(result) { if (!result || result.length === 0) return []; const cols = result[0].columns; return result[0].values.map(row => { const obj = {}; cols.forEach((col, i) => { obj[col] = row[i] }); return obj }) }
function rowToObject(result) { return rowsToObjects(result)[0] || null }

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

  const distPath = path.join(__dirname, '..', 'dist')
  if (fs.existsSync(distPath)) app.use(express.static(distPath))

  app.get('/api/businesses', (req, res) => { res.json(rowsToObjects(db.exec('SELECT * FROM businesses ORDER BY id DESC'))) })

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

  app.get('/api/sections', (req, res) => { res.json(SECTIONS.map(key => ({ key, label: SECTION_LABELS[key] || key }))) })

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
  db.run(`CREATE TABLE IF NOT EXISTS businesses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, industry TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.run(`CREATE TABLE IF NOT EXISTS plan_sections (id INTEGER PRIMARY KEY AUTOINCREMENT, plan_id INTEGER NOT NULL, section_key TEXT NOT NULL, content TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (plan_id) REFERENCES businesses(id) ON DELETE CASCADE, UNIQUE (plan_id, section_key))`)
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

  db.run(`CREATE TABLE IF NOT EXISTS businesses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, industry TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.run(`CREATE TABLE IF NOT EXISTS plan_sections (id INTEGER PRIMARY KEY AUTOINCREMENT, plan_id INTEGER NOT NULL, section_key TEXT NOT NULL, content TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (plan_id) REFERENCES businesses(id) ON DELETE CASCADE, UNIQUE (plan_id, section_key))`)

  function persist() { const data = db.export(); fs.writeFileSync(dbPath, Buffer.from(data)) }

  const app = createApp(db, persist)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => { console.log(`Business Starter server running on http://localhost:${PORT}`) })
}

export { createApp, createTestServer }
