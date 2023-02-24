import { useState } from 'react'

const Blog = ({ blog }) => {

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
    <div style={blogStyle}>
      {blog.title} {blog.author} 
      <button onClick={toggleVisibility}> hide </button>
      <div>
        {blog.url}<br/>
        likes {blog.likes} <button> like </button><br/>
        {blog.user.name}
        </div>
    </div>
  )} else {
    return(
      <div style={blogStyle}>
        {blog.title} {blog.author} 
      <button onClick={toggleVisibility}> view </button>
      </div>
    )
  }
}

export default Blog