import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import userService from './services/users'
import loginService from './services/login'
import storageService from './services/storage'
import commentService from './services/comments'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Button,
  TextField,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material'
import '@fontsource/roboto/300.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'

import LoginForm from './components/Login'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState('')
  const [info, setInfo] = useState({ message: null })
  const [comment, setComment] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    const user = storageService.loadUser()
    setUser(user)
  }, [])

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  const notifyWith = (message, type = 'info') => {
    setInfo({
      message,
      type,
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 3000)
  }

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      storageService.saveUser(user)
      notifyWith('welcome!')
    } catch (e) {
      notifyWith('wrong username or password', 'error')
    }
  }

  const logout = async () => {
    setUser(null)
    storageService.removeUser()
    notifyWith('logged out')
  }

  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog)
    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' added`)
    setBlogs(blogs.concat(createdBlog))
    blogFormRef.current.toggleVisibility()
  }

  const like = async (blog) => {
    const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    const updatedBlog = await blogService.update(blogToUpdate)
    notifyWith(`A like for the blog '${blog.title}' by '${blog.author}'`)
    setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
  }

  const remove = async (blog) => {
    const ok = window.confirm(
      `Sure you want to remove '${blog.title}' by ${blog.author}`
    )
    if (ok) {
      await blogService.remove(blog.id)
      notifyWith(`The blog' ${blog.title}' by '${blog.author} removed`)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
    }
  }

  const createComment = async (id) => {
    const newComment = { comment }
    const response = commentService.create(id, newComment)
  }

  if (!user) {
    return (
      <Container>
        <div>
          <Typography variant="h2" gutterBottom>
            log in to the application
          </Typography>
          <Notification info={info} />
          <LoginForm login={login} />
        </div>
      </Container>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const Blog = ({ blog }) => {
    return (
      <TableRow>
        <TableCell>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </TableCell>
      </TableRow>
    )
  }

  const CommentForm = (id) => {
    return (
      <form onSubmit={() => createComment(id)}>
        <div>
          <TextField
            id="comment"
            label="type your comment here"
            type="comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          id="comment-button"
          type="submit"
        >
          add comment
        </Button>
      </form>
    )
  }

  const BlogView = () => {
    const id = useParams().id
    const blog = blogs.find((n) => n.id === id)

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          {blog.title} {blog.author}
        </Typography>
        <div>
          {' '}
          <a href={blog.url}> {blog.url}</a>{' '}
        </div>
        <div>
          likes {blog.likes}
          <Button
            variant="contained"
            color="primary"
            onClick={() => like(blog)}
          >
            like
          </Button>
        </div>
        <div>added by {blog.user.name}</div>
        {user && blog.user.username === user.username && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => remove(blog)}
          >
            delete
          </Button>
        )}
        <Typography variant="h5" gutterBottom>
          comments
        </Typography>
        <CommentForm id={id} />
        <ul>
          {blog.comments.map((comment) => {
            return <li key={comment.id}>{comment.content}</li>
          })}
        </ul>
      </div>
    )
  }

  const Home = () => {
    return (
      <div>
        <Togglable buttonLabel="new note" ref={blogFormRef}>
          <NewBlog createBlog={createBlog} />
        </Togglable>
        <div>
          <TableContainer>
            <Table>
              <TableBody>
                {blogs.sort(byLikes).map((blog) => (
                  <Blog key={blog.id} blog={blog} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
  }

  const Users = () => {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          Users
        </Typography>
        <div>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Added blogs</TableCell>
                </TableRow>
                {users.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>
                      <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </TableCell>
                    <TableCell>{user.blogs.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
  }

  const User = ({ users }) => {
    const id = useParams().id
    const user = users.find((n) => n.id === id)

    if (!user) {
      return null
    }
    return (
      <div>
        <Typography variant="h3" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="h4" gutterBottom>
          added blogs
        </Typography>
        <ul>
          {user.blogs.map((blog) => {
            return <li key={blog.id}>{blog.title}</li>
          })}
        </ul>
      </div>
    )
  }

  const Header = () => {
    const navigate = useNavigate()
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="medium"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {user.name} logged in
            </Typography>
            <Button color="inherit" onClick={() => navigate('/users')}>
              Users
            </Button>
            <Button color="inherit" onClick={() => navigate('/')}>
              Blogs
            </Button>
            <Button color="inherit" onClick={logout}>
              logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    )
    return (
      <div>
        <div>
          <Link to="/"> blogs </Link>
          <Link to="/users"> users </Link>

          <button onClick={logout}>logout</button>
        </div>
        <Typography variant="h2" gutterBottom>
          blog app
        </Typography>
        <Notification info={info} />
      </div>
    )
  }

  return (
    <Container>
      <div>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User users={users} />} />
            <Route path="/blogs/:id" element={<BlogView />} />
          </Routes>
        </Router>
      </div>
    </Container>
  )
}

export default App
