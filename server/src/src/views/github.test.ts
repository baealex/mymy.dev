import request from 'supertest'

import app from '~/app'

describe('POST /api/github/raw', () => {
    it('요청 데이터에 raw가 없으면 404를 응답한다.', async () => {
        const res = await request(app).post('/api/github/raw').send({})
        expect(res.status).toBe(404)
    })

    it('raw가 있으면 소스코드를 응답한다.', async () => {
        const res = await request(app).post('/api/github/raw').send({ raw: '/baealex/baealex/master/.gitemoji' })
        expect(res.text).toContain('Feat')
    })
})
