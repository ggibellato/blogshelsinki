const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { url:1, title:1, author:1, id:1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  try{
    const body = request.body

    if (body.password === undefined || body.password.length < 2) {
      return response.status(400).json({ error: 'password is required with minimum lenght of 3' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const result = await user.save()
    response.status(201).json(result)
  } catch(exception){
    next(exception)
  }
})

module.exports = usersRouter