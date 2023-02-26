import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
      )
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)

      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(
        'login successful'
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage(
        'incorrect username or password'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }


  const handleLike = async (blogObject) => {
    const id = blogObject.id
    const userId = blogObject.user.id
    blogObject.user = userId
    blogObject.likes += 1

    const response = await blogService.update(blogObject.id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : response))
  }


  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(
        blogObject
      )
      setBlogs (blogs.concat(newBlog))
      blogFormRef.current.toggleVisibility()

      setNotificationMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage(
        'Blog must contain a title, an author and a url'
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      try {
        const id = blogObject.id
        await blogService.remove(id)

        setBlogs(blogs.filter(blog => blog.id !== id))

        setNotificationMessage(
          `blog ${blogObject.title} was removed`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)

      } catch (exception) {
        setErrorMessage(
          'something went wrong :/'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }


  const Notification = ( { message } ) => {
    if (!message) {
      return null
    }
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  const Error = ( { error } ) => {
    if (!error) {
      return null
    }
    return (
      <div className="error">
        {error}
      </div>
    )
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message = {notificationMessage}/>
        <Error error = {errorMessage}/>
        <form onSubmit={handleLogin}>
          <div>
        username
            <input
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
        password
            <input
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-button' type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <p>
        {user.name} logged in
        <button onClick={handleLogout}> logout </button>
      </p>
      <Notification message = {notificationMessage}/>
      <Error error = {errorMessage}/>
      <Togglable buttonLabel='new blog' ref = {blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes-a.likes )
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            removeBlog={removeBlog} />
        )}
    </div>
  )
}

export default App