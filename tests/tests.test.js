const listHelper = require('../utils/list_helper.js')
const blogs = require('./testing_blogs.js')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })
})

describe('most likes', () => {

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result.title).toBe("Canonical string reduction")
  })

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })
})

describe('author with most blogs', () => {
  
  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result.author).toBe("Robert C. Martin")
  })

  test('of empty list is null', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })
})