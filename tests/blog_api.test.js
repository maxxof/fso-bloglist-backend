const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    
})

test('returns correct amount of blogs in JSON', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier of blog posts is named "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'something',
        author: 'someone',
        url: 'also something',
        likes: 100,
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfterAdd = await helper.blogsInDb()
    expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1)

    const urls = blogsAfterAdd.map(b => b.url)
    expect(urls).toContain(newBlog.url)
})

afterAll(() => {
  mongoose.connection.close()
})
