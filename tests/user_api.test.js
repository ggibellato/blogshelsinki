const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const testHelper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('users add api tests', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'u01',
      name: 'User 1',
      password: '123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await testHelper.usersInDb()
    expect(users.length).toBe(1)
    expect(users[0].username).toBe('u01')
  })

  test('add user missing username and/or password', async () => {
    const newUserMissingUsername = {
      password: '1234',
      name: 'User Missing Username'
    }

    await api
      .post('/api/users')
      .send(newUserMissingUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const newUserMissingPassword = {
      username: 'ump01',
      name: 'User Missing Username'
    }

    await api
      .post('/api/users')
      .send(newUserMissingPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('add user with invalid length ', async () => {
    const newUsernameShort = {
      username: 'u',
      name: 'User 1',
      password: '123'
    }

    await api
      .post('/api/users')
      .send(newUsernameShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const newPasswordShort = {
      username: 'u01',
      name: 'User 1',
      password: '1'
    }

    await api
      .post('/api/users')
      .send(newPasswordShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})
