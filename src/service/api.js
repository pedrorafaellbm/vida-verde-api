import axios from 'axios'

console.log('MODE:', import.meta.env.MODE)
console.log('API:', import.meta.env.VITE_API_BASE_URL)

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})


/* 🔐 Interceptor: adiciona token em TODAS as requisições */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/* 🚫 Interceptor de resposta (token expirado / 401) */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)