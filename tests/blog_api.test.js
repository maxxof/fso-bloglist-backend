const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
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

test('blog without "likes" property gets 0 likes by default', async () => {
  const newBlog = {
    title: 'blahblahblah',
    author: 'someone important',
    url: 'long url',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAfterAdd = await helper.blogsInDb()
    expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length + 1)

    const addedBlog = blogsAfterAdd.find(b => b.url === newBlog.url)
    expect(addedBlog.likes).toBe(0)
})

test('blog without title or url gets responed with code 400', async () => {
  const newBlog = {
    title: 'blahblahblah',
    author: 'someone important',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAfterAdd = await helper.blogsInDb()
  expect(blogsAfterAdd).toHaveLength(helper.initialBlogs.length)
})

test('deleting blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDel = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDel.id}`)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()
  expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)

  const urls = blogsAfterDelete.map(b => b.url)
  expect(urls).not.toContain(blogToDel.url)
})

test('updating amount of likes of the blog post', async () => {
  const blogsBeforeUpdate = await helper.blogsInDb()
  const blogToUpdate = blogsBeforeUpdate[0]
  blogToUpdate.likes++
  const blogLikesAfter = blogToUpdate.likes

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogsAfterUpdate = await helper.blogsInDb()
  const updatedBlog = blogsAfterUpdate.find(b => b.id === blogToUpdate.id)
  expect(updatedBlog.likes).toBe(blogLikesAfter)
})

test('updating title of a blog', async () => {
  const blogsBeforeUpdate = await helper.blogsInDb()
  const blogToUpdate = blogsBeforeUpdate[0]
  blogToUpdate.title = "new title"
  const blogTitleAfter = blogToUpdate.title

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogsAfterUpdate = await helper.blogsInDb()
  const updatedBlog = blogsAfterUpdate.find(b => b.id === blogToUpdate.id)
  expect(updatedBlog.title).toBe(blogTitleAfter)
})

test('cannot update blog with undefined title or url', async () => {
  const blogsBeforeUpdate = await helper.blogsInDb()
  const blogToUpdate = blogsBeforeUpdate[0]
  const blogUrlBefore = blogToUpdate.url
  delete blogToUpdate.url

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(400)
  
  const blogsAfterUpdate = await helper.blogsInDb()
  const updatedBlog = blogsAfterUpdate.find(b => b.id === blogToUpdate.id)
  expect(updatedBlog.url).toBe(blogUrlBefore)

})

afterAll(() => {
  mongoose.connection.close()
})
