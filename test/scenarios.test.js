import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { createTestServer } from '../server/index.js'

let app

beforeAll(async () => {
  app = await createTestServer()
})

describe('Scenario API', () => {
  let businessId
  let scenarioId

  beforeAll(async () => {
    const res = await request(app).post('/api/businesses').send({ name: 'Scenario Test Biz', industry: 'Testing' })
    businessId = res.body.id
  })

  it('POST scenarios creates first scenario with is_default=true', async () => {
    const res = await request(app)
      .post(`/api/businesses/${businessId}/scenarios`)
      .send({ name: 'Base (bought lot)', notes: 'Case A', content: { startup: 11110600, grossFull: 63000 } })

    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()
    expect(res.body.is_default).toBe(true)
    expect(res.body.content.startup).toBe(11110600)
    scenarioId = res.body.id
  })

  it('POST second scenario is not default unless flagged', async () => {
    const res = await request(app)
      .post(`/api/businesses/${businessId}/scenarios`)
      .send({ name: 'Family lot', content: { startup: 8110600 } })

    expect(res.status).toBe(201)
    expect(res.body.is_default).toBe(false)
  })

  it('POST third scenario with is_default=true demotes the first', async () => {
    const res = await request(app)
      .post(`/api/businesses/${businessId}/scenarios`)
      .send({ name: 'Bank-financed', content: { startup: 5000000 }, is_default: true })

    expect(res.status).toBe(201)
    expect(res.body.is_default).toBe(true)
    const list = await request(app).get(`/api/businesses/${businessId}/scenarios`)
    const defaults = list.body.filter(s => s.is_default)
    expect(defaults.length).toBe(1)
    expect(defaults[0].name).toBe('Bank-financed')
  })

  it('POST duplicate name returns 409', async () => {
    const res = await request(app)
      .post(`/api/businesses/${businessId}/scenarios`)
      .send({ name: 'Family lot', content: {} })
    expect(res.status).toBe(409)
  })

  it('PATCH updates notes/content without clobbering name', async () => {
    const res = await request(app)
      .patch(`/api/businesses/${businessId}/scenarios/${scenarioId}`)
      .send({ notes: 'Case A updated', content: { startup: 11110600, escalated: true } })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Base (bought lot)')
    expect(res.body.notes).toBe('Case A updated')
    expect(res.body.content.escalated).toBe(true)
  })

  it('GET lists all scenarios parsed', async () => {
    const res = await request(app).get(`/api/businesses/${businessId}/scenarios`)
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(3)
    res.body.forEach(s => expect(typeof s.content).toBe('object'))
  })

  it('DELETE removes a scenario', async () => {
    const list = await request(app).get(`/api/businesses/${businessId}/scenarios`)
    const victim = list.body.find(s => s.name === 'Family lot')
    const del = await request(app).delete(`/api/businesses/${businessId}/scenarios/${victim.id}`)
    expect(del.status).toBe(200)
    const after = await request(app).get(`/api/businesses/${businessId}/scenarios`)
    expect(after.body.length).toBe(2)
  })

  it('cascade: deleting the plan deletes its scenarios', async () => {
    const biz = await request(app).post('/api/businesses').send({ name: 'Cascade Biz' })
    const sid = biz.body.id
    await request(app).post(`/api/businesses/${sid}/scenarios`).send({ name: 's1', content: {} })
    await request(app).delete(`/api/businesses/${sid}`)
    const fresh = await request(app).post('/api/businesses').send({ name: 'Probe' })
    // create another with the SAME name on the fresh plan — would 409 if cascade failed and orphan remained... simpler: count scenarios of removed plan via list (should 404/empty):
    const list = await request(app).get(`/api/businesses/${sid}/scenarios`)
    expect([404, 200]).toContain(list.status)
    if (list.status === 200) expect(list.body.length).toBe(0)
    await request(app).delete(`/api/businesses/${fresh.body.id}`)
  })
})