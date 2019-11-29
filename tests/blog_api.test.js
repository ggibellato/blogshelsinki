const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = testHelper.listWithBlogs
    .map(note => new Blog(note))
  const promiseArray = blogObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

test('api/blogs get', async () => {
  const response = await api.get('/api/blogs')
  expect(response.status).toBe(200)
  expect(response.type).toBe('application/json')
  expect(response.body.length).toBe(testHelper.listWithBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})