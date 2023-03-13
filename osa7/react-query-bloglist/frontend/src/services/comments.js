import axios from 'axios'
const baseUrl = '/api/blogs'

const create = async (id, object) => {
  const request = await axios.post(`${baseUrl}/${id}/comments`, object)
  return request.data
}

export default { create }
