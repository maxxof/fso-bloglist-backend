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
    var maxBlogs = 0
    for (var i = 0; i < blogs.length; i++) {

        var author = blogs[i].author
        !map[author]
        ? map[author] = 1
        : map[author]++

        if (map[author] > maxBlogs) {
            maxBlogs = map[author]
            favAuthor = author
        }
    }
    return { author: favAuthor, blogs: maxBlogs }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    var map = {}
    var favAuthor = "someone"
    var maxLikes = 0
    for (var i = 0; i < blogs.length; i++) {

        var author = blogs[i].author
        var likes = blogs[i].likes
        !map[author]
        ? map[author] = likes
        : map[author] += likes

        if (map[author] > maxLikes) {
            maxLikes = map[author]
            favAuthor = author
        }
    }
    return { author: favAuthor, likes: maxLikes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}