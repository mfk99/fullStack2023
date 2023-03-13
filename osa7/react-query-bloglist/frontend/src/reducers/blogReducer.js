import blogService from '../services/blogs'

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(asObject(content))
    dispatch({
      type: 'ADD_BLOG',
      data: newBlog,
    })
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    console.log('blogs: ', blogs)
    dispatch({
      type: 'INITIALIZE_BLOGS',
      data: blogs,
    })
  }
}

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_BLOG':
      return [...state, action.data]
    case 'INITIALIZE_BLOGS':
      return action.data
    default:
      return state
  }
}

export default blogReducer
