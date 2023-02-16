
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}