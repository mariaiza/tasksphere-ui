import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export const register = (username, password) =>
  api.post('/api/auth/register/', { username, password })

export const login = (username, password) =>
  api.post('/api/auth/login/', { username, password })

export const getTasks = () =>
  api.get('/api/tasks/')

export const createTask = (title, description) =>
  api.post('/api/task/', { title, description })

export const updateTask = (id, data) =>
  api.patch(`/api/task/${id}/`, data)

export const updateTaskStatus = (id, status) =>
  api.patch(`/api/task/${id}/status/`, { status })

export const deleteTask = (id) =>
  api.delete(`/api/task/${id}/`)

export default api
