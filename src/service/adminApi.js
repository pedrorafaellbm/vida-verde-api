import { api } from './api'

const getErrorMessage = (error, fallback) => {
  return error?.response?.data?.error || error?.response?.data?.mensagem || fallback
}

export const listProducts = async () => {
  const response = await api.get('/products')
  return response.data?.data || []
}

export const createProduct = async (payload) => {
  const formData = new FormData()
  formData.append('nome', payload.nome)
  formData.append('descricao', payload.descricao || '')
  formData.append('preco', String(payload.preco))
  formData.append('estoque', String(payload.estoque))
  if (payload.categoria) {
    formData.append('categoria', payload.categoria)
  }
  if (payload.imageFile) {
    formData.append('image', payload.imageFile)
  }

  const response = await api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data?.data
}

export const updateProduct = async (id, payload) => {
  const formData = new FormData()
  if (payload.nome !== undefined) formData.append('nome', payload.nome)
  if (payload.descricao !== undefined) formData.append('descricao', payload.descricao)
  if (payload.preco !== undefined) formData.append('preco', String(payload.preco))
  if (payload.estoque !== undefined) formData.append('estoque', String(payload.estoque))
  if (payload.categoria !== undefined) formData.append('categoria', payload.categoria)
  if (payload.imageFile) {
    formData.append('image', payload.imageFile)
  }

  const response = await api.patch(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data?.data
}

export const deleteProduct = async (id) => {
  await api.delete(`/admin/products/${id}`)
}

export const listCategories = async () => {
  const response = await api.get('/categories')
  return response.data?.data || []
}

export const createCategory = async (payload) => {
  const response = await api.post('/categories', payload)
  return response.data?.data
}

export const updateCategory = async (id, payload) => {
  const response = await api.put(`/categories/${id}`, payload)
  return response.data?.data
}

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`)
}

export const listAdminUsers = async () => {
  const response = await api.get('/admin/users')
  return response.data?.data || []
}

export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role })
  return response.data?.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/usuarios/${id}`)
  return response.data
}

export { getErrorMessage }
