import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
            title:
          <input
            id='title'
            type="title"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
            author:
          <input
            id='author'
            type="author"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
            url:
          <input
            id='url'
            type="url "
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button id='create-button' type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm