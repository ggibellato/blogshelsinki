const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(testHelper.listWithBlogs)
    expect(result).toBe(36)
  })
})

describe('favoriteBlog', () => {
  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({ title: '', author: '', likes: 0 })
  })

  test('when list has only one blog', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog)
    expect(result).toEqual({ title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithBlogs)
    expect(result).toEqual({ title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 })
  })
})

describe('mostBlogs', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({ author: '', blogs: 0 })
  })

  test('when list has only one blog', () => {
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of a bigger list', () => {
    const result = listHelper.mostBlogs(testHelper.listWithBlogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('mostLikes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({ author: '', likes: 0 })
  })

  test('when list has only one blog', () => {
    const result = listHelper.mostLikes(testHelper.listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list', () => {
    const result = listHelper.mostLikes(testHelper.listWithBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})