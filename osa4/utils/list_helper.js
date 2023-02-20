
const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
   const total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
   return total
}

const favoriteBlog = (blogs) => {
   if (blogs.length === 0) {
    return null
   }
   const best = blogs.reduce((best, blog) => best.likes > blog.likes ? best : blog)
   //console.log('best = ',best);
   
   return ({
    title: best.title,
    author: best.author,
    likes: best.likes
   })
}

const mostBlogs = (blogs) => {
  const authorList = lodash.groupBy(blogs, 'author')
  const author = lodash.maxBy(authorList, 'length')
  console.log(author)
  return author
}

const mostLikes = (blogs) => {
   //code goes here
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}