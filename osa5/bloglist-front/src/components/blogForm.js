import { useState } from 'react'

const BlogForm = ({ createBlog }) => {


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
    </>
  )
}

export default BlogForm