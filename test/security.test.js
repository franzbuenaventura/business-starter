import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../server/index.js'

let app

beforeAll(async () => {
  app = await createTestServer()
})

describe('Security: SQL injection / input validation', () => {
  it('GET /api/businesses/:id rejects non-integer id (no injection)', async () => {
    const res = await request(app).get('/api/businesses/1%20OR%201=1')
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('GET /api/businesses/:id rejects zero/negative ids', async () => {
    const zero = await request(app).get('/api/businesses/0')
    expect(zero.status).toBe(400)
    const neg = await request(app).get('/api/businesses/-1')
    expect(neg.status).toBe(400)
  })

  it("GET sections rejects SQL-injected section key (' OR '1'='1)", async () => {
    const res = await request(app).get("/api/businesses/1/sections/'%20OR%20'1'='1")
    expect(res.status).toBe(400)
  })

  it('PUT sections rejects unknown section keys', async () => {
    const res = await request(app)
      .put('/api/businesses/1/sections/FOO')
      .send({ content: { x: 'y' } })
    expect(res.status).toBe(400)
  })

  it('malformed JSON body returns 400 (not unhandled 500)', async () => {
    const res = await request(app)
      .post('/api/businesses')
      .set('Content-Type', 'application/json')
      .send('{"name": broken')
    expect(res.status).toBe(400)
  })
})

describe('Security: template path traversal', () => {
  it('rejects templateId with path traversal', async () => {
    const res = await request(app)
      .post('/api/businesses/from-template')
      .send({ templateId: '../../etc/passwd' })
    expect(res.status).toBe(400)
  })

  it('rejects templateId with url-encoded separators', async () => {
    const res = await request(app)
      .post('/api/businesses/from-template')
      .send({ templateId: '..%2F..%2Fserver%2Findex' })
    expect(res.status).toBe(400)
  })
})

describe('Security: PIN auth + login lockout', () => {
  let authApp
  let token

  beforeAll(async () => {
    authApp = await createTestServer()
    const setup = await request(authApp).post('/api/auth/setup').send({ pin: '4321' })
    expect(setup.status).toBe(201)
    token = setup.body.token
  })

  it('rejects unauthenticated /api/businesses when PIN is set', async () => {
    const res = await request(authApp).get('/api/businesses')
    expect(res.status).toBe(401)
  })

  it('accepts a valid bearer token', async () => {
    const res = await request(authApp).get('/api/businesses').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('locks login after 5 failed attempts (429), even with correct PIN', async () => {
    for (let i = 0; i < 5; i++) {
      const wrong = await request(authApp).post('/api/auth/login').send({ pin: '0000' })
      expect(wrong.status).toBe(401)
    }
    const res = await request(authApp).post('/api/auth/login').send({ pin: '4321' })
    expect(res.status).toBe(429)
    expect(res.body).toHaveProperty('retryAfterSeconds')
  })
})