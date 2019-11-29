const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes , 0)
}

const favoriteBlog = (blogs) => {
  if(!blogs || blogs.length === 0) {
    return { title: '', author: '', likes: 0 }
  }
  const blog = blogs.reduce((prev, current) => prev.likes > current.likes ? prev : current )
  return { title: blog.title, author: blog.author, likes: blog.likes }
}

const mostBlogs = (blogs) => {
  if(!blogs || blogs.length === 0) {
    return { author: '', blogs: 0 }
  }
  return _(blogs)
    .groupBy('author')
    .map((items, key) => ({ author: key, blogs: items.length }))
    .reduce((prev, current) => prev.blogs > current.blogs ? prev : current)
}

const mostLikes = (blogs) => {
  if(!blogs || blogs.length === 0) {
    return { author: '', likes: 0 }
  }
  return _(blogs)
    .map(blog => ({ author: blog.author, likes: blog.likes }))
    .groupBy('author')
    .map((items, key) => ({ author: key, likes: _.sumBy(items, 'likes') }))
    .reduce((prev, current) => prev.likes > current.likes ? prev : current)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}