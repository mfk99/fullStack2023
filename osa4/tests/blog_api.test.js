const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require("../models/blog")
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('correct amount of blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)

})

test('all blogs have id attribute', async () => {
  const response = await api.get('/api/blogs')
  const body = response.body
  body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('posting a blog adds it to the list', async () => {
  const blog = {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  }
  await api.post('/api/blogs', blog)
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})

afterAll(async () => {
  await mongoose.connection.close()
})