import axios from 'axios'
import API_BASE_URL from '../config'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercept 401 errors to redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login' // force redirect
    }
    return Promise.reject(error)
  }
)

export default api
