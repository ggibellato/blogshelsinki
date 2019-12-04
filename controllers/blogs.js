const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

///api/blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try{
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch(exception){
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
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
