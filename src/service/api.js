import axios from 'axios'

console.log('API base URL:', import.meta.env.MODE)
console.log('API', import.meta.env.VITE_API_BASE_URL)

export const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
  headers: {
    'Content-Type': 'application/json',
  },
})