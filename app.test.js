const request = require('supertest')
const app = require('./server')

describe('Test Ticketing System API', function () {
  let userID
  let userToken
  describe('Auth API', function () {
    it('POST /register', async function () {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          idNumber: 'testId123',
          password: 'password',
          role: 'local',
        })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(201)
      expect(response.body.user).toEqual({
        userId: expect.any(String),
        name: 'Test User',
        role: 'local',
        idNumber: 'testId123',
      })
      expect(response.body.token).toEqual(expect.any(String))
    })

    it('POST /login', async function () {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ idNumber: 'testId123', password: 'password' })
        .set('Accept', 'application/json')

      userID = response.body.user.userId
      userToken = `Bearer ${response.body.token}`

      expect(response.status).toEqual(200)
      expect(response.body.user).toEqual({
        userId: expect.any(String),
        name: 'Test User',
        role: 'local',
        idNumber: 'testId123',
      })
      expect(response.body.token).toEqual(expect.any(String))
    })
  })

  describe('User API', function () {
    it('GET /:id', async function () {
      const response = await request(app)
        .get(`/api/v1/user/${userID}`)
        .set('Accept', 'application/json')
        .set('authorization', userToken)

      expect(response.status).toEqual(200)
      expect(response.body.user).toEqual({
        _id: expect.any(String),
        name: 'Test User',
        role: 'local',
        idNumber: 'testId123',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      })
    })

    it('PUT /:id', async function () {
      const response = await request(app)
        .put(`/api/v1/user/update-password`)
        .send({
          oldPassword: 'password',
          newPassword: 'secret',
        })
        .set('Accept', 'application/json')
        .set('authorization', userToken)

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        msg: 'Success! Password Updated.',
      })
    })

    it('DELETE /:id', async function () {
      const response = await request(app)
        .delete(`/api/v1/user/${userID}`)
        .set('Accept', 'application/json')
        .set('authorization', userToken)

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        msg: 'Success! User Deleted.',
      })
    })
  })
})
