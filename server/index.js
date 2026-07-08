import express from 'express'
import cors from 'cors'
import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'app.db')

fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const SQL = await initSqlJs()

// Load existing DB or create new
let db
if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath)
  db = new SQL.Database(buffer)
} else {
  db = new SQL.Database()
}

db.run(`
  CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    industry TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

function persist() {
  const data = db.export()
  fs.writeFileSync(dbPath, Buffer.from(data))
}

const app = express()
app.use(cors())
app.use(express.json())

// Serve built frontend in production
const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
}

// --- API routes ---

app.get('/api/businesses', (req, res) => {
  const result = db.exec('SELECT * FROM businesses ORDER BY id DESC')
  if (result.length === 0) return res.json([])
  const cols = result[0].columns
  const rows = result[0].values.map(row => {
    const obj = {}
    cols.forEach((col, i) => { obj[col] = row[i] })
    return obj
  })
  res.json(rows)
})

app.post('/api/businesses', (req, res) => {
  const { name, industry } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  db.run('INSERT INTO businesses (name, industry) VALUES (?, ?)', [name, industry || null])
  const result = db.exec('SELECT last_insert_rowid() as id')
  const id = result[0].values[0][0]
  const rowResult = db.exec('SELECT * FROM businesses WHERE id = ' + id)
  const cols = rowResult[0].columns
  const row = {}
  cols.forEach((col, i) => { row[col] = rowResult[0].values[0][i] })
  persist()
  res.status(201).json(row)
})

app.delete('/api/businesses/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM businesses WHERE id = ?', [id])
  persist()
  res.status(204).end()
})

// Catch-all: serve index.html for SPA routing (production)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' })
  }
  const indexPath = path.join(distPath, 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(200).send('Business Starter API running. Build the frontend with `npm run build`.')
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Business Starter server running on http://localhost:${PORT}`)
})