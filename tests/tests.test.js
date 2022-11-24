const listHelper = require('../utils/list_helper.js')
const blogs = require('./testing_blogs.js')

test('dummy returns one', () => {

  const result = listHelper.dummy([])
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
  
  test('within a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result.author).toBe("Robert C. Martin")
  })

  test('in empty list is null', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })
})

describe('author with most likes', () => {
  
  test('within a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogs)
    console.log(result)
    expect(result.author).toBe("Edsger W. Dijkstra")
  })

  test('in empty list is null', () => {
    expect(listHelper.mostLikes([])).toBe(null)
  })
})