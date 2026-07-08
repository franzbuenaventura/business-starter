import { useState, useEffect } from 'react'

const API = '/api/businesses'

export default function App() {
  const [businesses, setBusinesses] = useState([])
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')

  async function load() {
    const res = await fetch(API)
    const data = await res.json()
    setBusinesses(data)
  }

  useEffect(() => { load() }, [])

  async function addBusiness(e) {
    e.preventDefault()
    if (!name.trim()) return
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, industry })
    })
    setName('')
    setIndustry('')
    load()
  }

  async function deleteBusiness(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🚀 Business Starter</h1>

      <form onSubmit={addBusiness} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          placeholder="Business name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <input
          placeholder="Industry"
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>ID</th>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Industry</th>
            <th style={{ padding: 8 }}>Created</th>
            <th style={{ padding: 8 }}></th>
          </tr>
        </thead>
        <tbody>
          {businesses.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{b.id}</td>
              <td style={{ padding: 8 }}>{b.name}</td>
              <td style={{ padding: 8 }}>{b.industry || '—'}</td>
              <td style={{ padding: 8 }}>{new Date(b.created_at).toLocaleDateString()}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => deleteBusiness(b.id)} style={{ color: 'red', border: 'none', cursor: 'pointer' }}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
          {businesses.length === 0 && (
            <tr><td colSpan={5} style={{ padding: 16, textAlign: 'center', color: '#999' }}>No businesses yet. Add one above!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}