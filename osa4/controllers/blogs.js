
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {  
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user
  if (user === null) {
    return response.status(401).json({ error: 'token invalid' })
  }

  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (user === null) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blogid = request.params.id
  const blog = await Blog.findById(blogid)
  console.log("blog user = ",blog.user.toString())
  console.log("userid = ",user.toString())
  if ( blog.user.toString() === user.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'not allowed' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = new Blog({
    _id: request.params.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })
  
  await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.status(200).end()
})


module.exports = blogsRouter