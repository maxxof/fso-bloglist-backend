const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
    const body = req.body
    if (!body.url || !body.title) {
      return res.status(400).json({ error: `can't create a blog withour url and title`})
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

module.exports = blogsRouter