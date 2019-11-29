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
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(testHelper.listWithBlogs.length)
})

test('Blog has id', async() => {
  const blogs = await testHelper.blogsInDb()
  const blog = blogs[0]
  expect(blog.id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New blog to test',
    author: 'GGS',
    url: 'http://www.u.arizona.edu',
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await testHelper.blogsInDb()
  expect(blogsAtEnd.length).toBe(testHelper.listWithBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain('New blog to test')
})

test('default likes 0', async () => {
  const newBlog = {
    title: 'New blog to test',
    author: 'GGS',
    url: 'http://www.u.arizona.edu'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogSaved = new Blog(response.body)
  expect(blogSaved.likes).toBeDefined()
  expect(blogSaved.likes).toBe(0)
})

test('add blog missing title and/or url', async () => {
  const newBlogMissingTitle = {
    author: 'GGS',
    url: 'http://www.u.arizona.edu'
  }

  await api
    .post('/api/blogs')
    .send(newBlogMissingTitle)
    .expect(400)

  const newBlogMissingUrl = {
    title: 'New lbog',
    author: 'GGS'
  }

  await api
    .post('/api/blogs')
    .send(newBlogMissingUrl)
    .expect(400)

  const newBlogMissingBoth = {
    author: 'GGS'
  }

  await api
    .post('/api/blogs')
    .send(newBlogMissingBoth)
    .expect(400)
})


afterAll(() => {
  mongoose.connection.close()
})