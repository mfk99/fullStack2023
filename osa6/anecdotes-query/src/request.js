import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
  axios.get(baseUrl).then(res => res.data)

export const createAnecdote  = async newAnecdote =>{
  console.log(newAnecdote);
  return await axios.post(baseUrl, newAnecdote).then(response => response.data)}

export const updateAnecdote = updatedAnecdote =>{
  axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(response => response.data)}