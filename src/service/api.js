import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const getApiErrorMessage = (error, fallback = 'Operacao nao concluida.') =>
  error?.response?.data?.error || error?.response?.data?.mensagem || fallback

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export const registerRequest = async (payload) => {
  const response = await api.post('/auth/register', payload)
  return response.data
}

export const loginRequest = async (payload) => {
  const response = await api.post('/auth/login', payload)
  return response.data
}

export const getMeRequest = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Nao autenticado')
  }
  const response = await api.get('/auth/me')
  return response.data
}

export const sendContactRequest = async (payload) => {
  const response = await api.post('/contato', payload)
  return response.data
}

export const listFavoritosRequest = async () => {
  const response = await api.get('/favoritos')
  return response.data?.data || []
}

export const addFavoritoRequest = async (produtoId) => {
  const response = await api.post(`/favoritos/${produtoId}`)
  return response.data
}

export const removeFavoritoRequest = async (produtoId) => {
  const response = await api.delete(`/favoritos/${produtoId}`)
  return response.data
}

export const deleteUsuarioRequest = async (id) => {
  const response = await api.delete(`/usuarios/${id}`)
  return response.data
}
