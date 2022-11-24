const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    var favBlog = { likes: 0 }
    blogs.forEach(blog => {
        if (blog.likes >= favBlog.likes) {
            favBlog = blog
        }
    })
    return favBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}