import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../server/index.js'

let app

beforeAll(async () => {
  app = await createTestServer()
})

describe('Business API', () => {
  let businessId

  it('POST /api/businesses creates a business and returns 201', async () => {
    const res = await request(app)
      .post('/api/businesses')
      .send({ name: 'Test Biz', industry: 'Testing' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Test Biz')
    expect(res.body.industry).toBe('Testing')
    businessId = res.body.id
  })

  it('GET /api/businesses returns array including the created business', async () => {
    const res = await request(app).get('/api/businesses')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(1)
    const found = res.body.find(b => b.id === businessId)
    expect(found).toBeTruthy()
    expect(found.name).toBe('Test Biz')
  })

  it('GET /api/businesses/:id returns the business with sections object', async () => {
    const res = await request(app).get(`/api/businesses/${businessId}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(businessId)
    expect(res.body.name).toBe('Test Biz')
    expect(res.body).toHaveProperty('sections')
    expect(typeof res.body.sections).toBe('object')
  })

  it('PUT /api/businesses/:id/sections/I saves section content', async () => {
    const content = { businessIdea: 'A great idea', targetMarket: 'Everyone' }
    const res = await request(app)
      .put(`/api/businesses/${businessId}/sections/I`)
      .send({ content })

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('GET /api/businesses/:id/sections/I returns saved content', async () => {
    const res = await request(app).get(`/api/businesses/${businessId}/sections/I`)

    expect(res.status).toBe(200)
    expect(res.body.content).toEqual({
      businessIdea: 'A great idea',
      targetMarket: 'Everyone',
    })
  })

  it('DELETE /api/businesses/:id returns 204', async () => {
    const res = await request(app).delete(`/api/businesses/${businessId}`)

    expect(res.status).toBe(204)
  })

  it('GET /api/businesses/:id after delete returns 404', async () => {
    const res = await request(app).get(`/api/businesses/${businessId}`)

    expect(res.status).toBe(404)
  })

  it('POST /api/businesses without name returns 400', async () => {
    const res = await request(app)
      .post('/api/businesses')
      .send({ industry: 'NoName' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})