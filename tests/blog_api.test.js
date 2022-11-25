const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const blogs = require('./testing_blogs')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
})

test('returns correct amount of blogs in JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(blogs.length)
})

test('unique identifier of blog posts is named "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})
