const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


///api/blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user',{ username:1, name:1, id:1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('decodedToken', decodedToken)

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  }
  catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)

    if(blog && blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(401).end({ error: 'only owner user can delete blog' })
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const tempBlog = new Blog(request.body)
    const blog = {
      author: tempBlog.author,
      title: tempBlog.title,
      url: tempBlog.url,
      likes: tempBlog.likes
    }
    await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
      .catch(error => {
        console.log('er', error)
        next(error)
      })
  }
  catch(exception) {
    console.log('e', exception)
    next(exception)
  }
})


module.exports = blogsRouter
