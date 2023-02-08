import axios from 'axios'

const baseURL = 'http://localhost:3001/api/persons'

const getAll = () => {
  return axios.get(baseURL)
}

const create = newObject => {
  axios.post(baseURL, newObject)
  return axios.get(baseURL)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseURL}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  axios.delete(`${baseURL}/${id}`)
  return axios.get(baseURL)
}

export default {
  getAll,
  create,
  update,
  remove
}