import request from 'supertest'

import app from '~/app'

describe('GET /api/home', () => {
    it('return text Hello, My Express JS!', async () => {
        const res = await request(app).get('/api/home')
        expect(res.text).toContain('Hello, My Express JS!') 
    })
})
