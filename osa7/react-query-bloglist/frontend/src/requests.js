import axios from 'axios'
import storageService from './services/storage'
const baseUrl = '/api/blogs'

const headers = {
  Authorization: storageService.loadUser()
    ? `Bearer ${storageService.loadUser().token}`
    : null,
}

export const getBlogs = async () => {
  const request = await axios.get(baseUrl)
  return request
}
