const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.username === undefined || body.password === undefined) {
    return response.status(400).json({ error: 'username and password must be given' })
  } else if (body.username.length < 3 || body.password.length < 3) {
    return response.status(400).json({ error: 'username and password must be atleast 3 characters long' })
  }
  const username = body.username
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const passwordHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    ...body,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

module.exports = usersRouter
