import { useState } from 'react'
import PropTypes from 'prop-types'
import RemoveButton from './RemoveButton'

const Blog = ({ blog, handleLike, removeBlog }) => {

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    handleLike: PropTypes.func.isRequired
  }

  const [infoVisible, setInfoVisible] = useState(false)

  const toggleVisibility = () => {
    setInfoVisible(!infoVisible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (infoVisible) {
    return (
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}> hide </button>
        <div>
          {blog.url}<br/>
        likes {blog.likes}
          <button onClick ={() => {handleLike(blog)}
          }>
          like
          </button> <br/>
          {blog.user.name} <br/>
          <RemoveButton
            blog = {blog}
            removeBlog={removeBlog}
          />
        </div>
      </div>
    )} else {
    return(
      <div style={blogStyle} className='blog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}> view </button>
      </div>
    )
  }
}

export default Blog