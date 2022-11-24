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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    var map = {}
    var favAuthor = "someone"
    var max = 0
    for (var i = 0; i < blogs.length; i++) {

        var author = blogs[i].author
        !map[author]
        ? map[author] = 1
        : map[author]++

        if (map[author] > max) {
            max = map[author]
            favAuthor = author
        }
    }
    return { author: favAuthor, blogs: max }
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}