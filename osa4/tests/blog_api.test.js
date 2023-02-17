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
  const newBlog = {
    "title": "TDD harms architecture",
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    "likes": 0
  }  
  
  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  
  expect(response.body).toHaveLength(helper.initialBlogs.length+1)
  const titles = response.body.map(blog => blog.title)
  expect(titles).toContain("TDD harms architecture")
})

test('posting a blog without likes sets it to 0', async () => {
  const newBlog = {
    "title": "TDD harms architecture",
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
  }  

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  
  const testBlog = response.body[2]
  expect(testBlog.likes).toBeDefined()
})

test('posting a blog without title returns bad request', async () => {
  const newBlog = {
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
  }  

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('posting a blog without url returns bad request', async () => {
  const newBlog = {
    "title": "TDD harms architecture",
    "author": "Robert C. Martin"
  }  

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

describe('delete', () => {

  test('removes a blog', async () => {
    await api.delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length-1)
  })

  test('doesnt remove with incorrect id', async () => {
    await api.delete('/api/blogs/badId')
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

})

describe('put', () => {

  const newBlog = {
    "title": "TDD harms architecture",
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    "likes": 10
  }  

  test('updates blog', async () => {
    await api.put('/api/blogs/5a422a851b54a676234d17f7')
      .send(newBlog)
      .expect(200)

    const response = await api.get('/api/blogs')
    const testBlog = response.body[0]
    
    expect(testBlog.title).toBe("TDD harms architecture")
    expect(testBlog.likes).toBe(10)
  })

  test('doesnt update with incorrect id', async () => {
    await api.put('/api/blogs/badId')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    const testBlog = response.body[0]
    expect(testBlog.title).toBe("React patterns")
    expect(testBlog.likes).toBe(7)
  })

})

afterAll(async () => {
  await mongoose.connection.close()
  
})