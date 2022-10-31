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

    it('POST /register again with same credentials', async function () {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          idNumber: 'testId123',
          password: 'password',
          role: 'local',
        })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(400)
      expect(response.body.msg).toEqual('User already exists')
    })

    it('POST /login with invalid credentials', async function () {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ idNumber: 'testId', password: 'wrong' })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(401)
      expect(response.body.msg).toEqual('Invalid Credentials')
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

    it('GET / user with invalid id', async function () {
      const id = '123'
      const response = await request(app)
        .get(`/api/v1/user/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', userToken)

      expect(response.status).toEqual(404)
      expect(response.body.msg).toEqual(`No item found with id : ${id}`)
    })

    it('GET / user with invalid token', async function () {
      const response = await request(app)
        .get(`/api/v1/user/${userID}`)
        .set('Accept', 'application/json')
        .set('authorization', 'invalid token')

      expect(response.status).toEqual(401)
      expect(response.body.msg).toEqual(`Authentication Invalid`)
    })

    it('PUT / update password with invalid credentials', async function () {
      const response = await request(app)
        .put(`/api/v1/user/update-password`)
        .send({
          oldPassword: 'invalid',
          newPassword: 'secret',
        })
        .set('Accept', 'application/json')
        .set('authorization', userToken)

      expect(response.status).toEqual(401)
      expect(response.body).toEqual({
        msg: 'Invalid Credentials',
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
