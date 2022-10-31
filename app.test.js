const request = require('supertest')
const app = require('./server')
const CommonConstants = require('./CommonConstants')

describe('Test Ticketing System API', function () {
  let userID
  let userToken
  let id

  describe('Auth API', function () {
    //! Register User
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

    //! Login User
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

    //! Register with Same Credentials
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

    //! Login With Invalid Credentials
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
    //! Get User By Id
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

    //! User With Invalid Id
    it('GET / user with invalid id', async function () {
      const id = '123'
      const response = await request(app)
        .get(`/api/v1/user/${id}`)
        .set('Accept', 'application/json')
        .set('authorization', userToken)

      expect(response.status).toEqual(404)
      expect(response.body.msg).toEqual(`No item found with id : ${id}`)
    })

    //! User With Invalid Token
    it('GET / user with invalid token', async function () {
      const response = await request(app)
        .get(`/api/v1/user/${userID}`)
        .set('Accept', 'application/json')
        .set('authorization', 'invalid token')

      expect(response.status).toEqual(401)
      expect(response.body.msg).toEqual(`Authentication Invalid`)
    })

    //! Update User Password With Invalid Credentials
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

    //! Update User Password
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

    //! Delete User From Database
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

  describe('Manager API', function () {
    //! manager register testing POSITIVE
    it('POST manager/register', async function () {
      const response = await request(app)
        .post(CommonConstants.MANAGER_PATH + '/register')
        .send({
          name: 'Test Manager',
          email: 'test@gmail.com',
          password: 'password',
        })
        .set('Accept', 'application/json')
      expect(response.status).toEqual(201)
      expect(response.body.user).toEqual({
        userId: expect.any(String),
        name: 'Test Manager',
        email: 'test@gmail.com',
      })
      expect(response.body.token).toEqual(expect.any(String))
    })

    //! manager login testing POSITIVE
    it('POST manager/login', async function () {
      const response = await request(app)
        .post(CommonConstants.MANAGER_PATH + '/login')
        .send({ email: 'test@gmail.com', password: 'password' })
        .set('Accept', 'application/json')

      userID = response.body.user.userId
      userToken = `Bearer ${response.body.token}`

      expect(response.status).toEqual(200)
      expect(response.body.user).toEqual({
        userId: expect.any(String),
        name: 'Test Manager',
        email: 'test@gmail.com',
      })
      expect(response.body.token).toEqual(expect.any(String))
    })

    //! manager register testing NEGATIVE
    it('POST /register manager again with same credentials', async function () {
      const response = await request(app)
        .post(CommonConstants.MANAGER_PATH + '/register')
        .send({
          name: 'Test Manager',
          email: 'test@gmail.com',
          password: 'password',
        })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(400)
      expect(response.body.msg).toEqual(CommonConstants.USER_ALREADY_EXISTS)
    })

    //! manager login testing NEGATIVE manager login with invalid credentials
    it('POST manager/login manager login with invalid credentials', async function () {
      const response = await request(app)
        .post(CommonConstants.MANAGER_PATH + '/login')
        .send({ email: 'test@.com', password: 'password' })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(401)
      expect(response.body.msg).toEqual(CommonConstants.INVALID_CREDENTIALS)
    })

    //! delete created test data
    it('DELETE /:id', async function () {
      const response = await request(app)
        .delete(CommonConstants.MANAGER_PATH + `/${userID}`)
        .set('Accept', 'application/json')

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        msg: CommonConstants.SUCCESSFULL_USER_DELETE,
      })
    })

    //! manager add route testing POSITIVE
    it('POST manager/route', async function () {
      const response = await request(app)
        .post(CommonConstants.ROUTE_PATH + '/addroute')
        .send({
          Routename: 'Routename',
          bus: 'bus',
          startpoint: 'startpoint',
          stops: 'stops',
          starttime: 'starttime',
          endtime: 'endtime',
          totdistance: 100,
          addedby: 'addedby',
        })
        .set('Accept', 'application/json')
      id = response.body.route._id
      expect(response.status).toEqual(201)
      expect(response.body.route).toEqual({
        Routename: 'Routename',
        bus: 'bus',
        startpoint: 'startpoint',
        stops: expect.any(Array),
        starttime: 'starttime',
        endtime: 'endtime',
        totdistance: 100,
        addedby: 'addedby',
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      })
    })

    //! manager add same route route testing NEGATIVE
    it('POST manager/add route', async function () {
      const response = await request(app)
        .post(CommonConstants.ROUTE_PATH + '/addroute')
        .send({
          Routename: 'Routename',
          bus: 'bus',
          startpoint: 'startpoint',
          stops: 'stops',
          starttime: 'starttime',
          endtime: 'endtime',
          totdistance: 100,
          addedby: 'addedby',
        })
        .set('Accept', 'application/json')
      expect(response.status).toEqual(400)
      expect(response.body).toEqual({
        msg: CommonConstants.ROUTE_ALREADY_EXISTS,
      })
    })

    //! Delete route created
    it('DELETE /route', async function () {
      const response = await request(app)
        .post(CommonConstants.ROUTE_PATH + '/delroute')
        .send({
          id: id,
        })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(200)
    })

    //! invalid id for delete testing NEGATIVE
    it('DELETE /route', async function () {
      const response = await request(app)
        .post(CommonConstants.ROUTE_PATH + '/delroute')
        .send({
          id: 123,
        })
        .set('Accept', 'application/json')

      expect(response.status).toEqual(400)
      expect(response.body).toEqual({
        msg: CommonConstants.ERROR,
      })
    })
  })
})
