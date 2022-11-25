const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
    const body = req.body
    if (!body.url || !body.title) {
      return res.status(400).json({ error: `cannot create a blog withour url and title`})
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })
  
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  if (!body.url || !body.title) {
    return res.status(400).json({ error: `cannot update a blog withour url and title`})
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true })
  res.status(200).json(updatedBlog)
})

module.exports = blogsRouter