import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogCreationVisible, setBlogCreationVisible] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
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
        `login successful`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      setErrorMessage(
        `incorrect usernmae or password`
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

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url
      })
      setBlogs (blogs.concat(newBlog))

      setNotificationMessage(
        `a new blog ${title} by ${author} added`
      )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      setErrorMessage(
        `Blog must contain a title, an author and a url`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
     
      
  }

  const Notification = ({message}) => {
    if (!message) {
      return null
    }
    return (
      <div className="notification">
        {message}
      </div>
    )
  }

  const Error = ({error}) => {
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
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
          </div>
          <button type="submit">login</button>
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
      <button onClick={() => setBlogCreationVisible(true)}>new blog</button>
      <h2>create new</h2>
      <Notification message = {notificationMessage}/>
      <Error error = {errorMessage}/>
      <form onSubmit={handleBlogCreation}>
        <div>
          title:
          <input
          type="title"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
          type="author"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
          type="url "
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      <button onClick={() => setBlogCreationVisible(false)}>cancel</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App