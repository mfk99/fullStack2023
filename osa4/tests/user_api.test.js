const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require("../models/user")

beforeEach(async () => {
  await User.deleteMany({})
})

describe('posting a user', () => {

  test('works with proper parameters', async () => {
    const newUser = {
      "username": "testUser",
      "name": "tester",
      "password": "password"
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(1)
    const returnedUser = (response.body[0])
    expect(returnedUser.username).toBe("testUser")
    expect(returnedUser.name).toBe("tester")
  })

  
  test('doesnt work with too short username', async () => {
    const newUser = {
      "username": "te",
      "name": "tester",
      "password": "password"
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe("User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).")    
  })

  test('doesnt work if username inst unique', async () => {
    const newUser = {
      "username": "testUser",
      "name": "tester",
      "password": "password"
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe("User validation failed: username: Error, expected `username` to be unique. Value: `testUser`")    
  })

  test('doesnt work with too short password', async () => {
    const newUser = {
      "username": "testUser",
      "name": "tester",
      "password": "pa"
    }
    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBe("password must be at least 3 characters")    
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})