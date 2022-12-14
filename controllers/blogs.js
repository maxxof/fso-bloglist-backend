const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (req, res) => {
  const body = req.body

  if (!body.url || !body.title) {
    return res.status(400).json({ error: `cannot create a blog withour url and title`})
  }

  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  let savedBlog = await blog.save()
  savedBlog = await Blog.findById(savedBlog.id).populate('user', { username: 1, name: 1 })
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {

  const user = req.user

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(400).json({ error: 'blog does not exist'})
  }
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } else {
    res.status(401).json({ error: 'invalid user' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  if (!body.url || !body.title) {
    return res.status(400).json({ error: `cannot update a blog withour url and title`})
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true }).populate('user', { username: 1, name: 1 })
  return res.status(200).json(updatedBlog)
})

module.exports = blogsRouter