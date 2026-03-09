import { api } from './api'

const bannersStorageKey = 'admin_banners'
const storeInfoStorageKey = 'store_info_content'

const defaultStoreInfo = {
  title: 'Sobre a Loja',
  description:
    'Somos uma loja dedicada ao cultivo e venda de plantas de qualidade, com foco em praticidade, curadoria e atendimento humano.',
  mission:
    'Conectar pessoas a natureza com produtos selecionados, informacao clara e uma compra simples.',
  quality:
    'Cada item e escolhido para garantir boa adaptacao, visual bonito e excelente apresentacao.',
  delivery:
    'Despacho rapido, embalagens seguras e acompanhamento atencioso para cada pedido.',
}

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.error || error?.response?.data?.mensagem || fallback

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
  if (payload.categoria) formData.append('categoria', payload.categoria)
  if (payload.imageFile) formData.append('image', payload.imageFile)

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
  if (payload.imageFile) formData.append('image', payload.imageFile)

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
  const response = await api.delete(`/admin/users/${id}`)
  return response.data
}

export const listBanners = async () => {
  try {
    const response = await api.get('/banners')
    const data = response.data?.data || []
    writeJson(bannersStorageKey, data)
    return data
  } catch {
    return readJson(bannersStorageKey, [])
  }
}

export const createBanner = async (payload) => {
  try {
    const formData = new FormData()
    formData.append('title', payload.title)
    formData.append('description', payload.description || '')
    formData.append('link', payload.link || '')
    formData.append('button_text', payload.button_text || '')
    if (payload.imageFile) {
      formData.append('image', payload.imageFile)
    } else if (payload.image_url) {
      formData.append('image_url', payload.image_url)
    }

    const response = await api.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data?.data
  } catch {
    const current = readJson(bannersStorageKey, [])
    const next = {
      id: `local-${Date.now()}`,
      ...payload,
    }
    writeJson(bannersStorageKey, [next, ...current])
    return next
  }
}

export const updateBanner = async (id, payload) => {
  try {
    const formData = new FormData()
    if (payload.title !== undefined) formData.append('title', payload.title)
    if (payload.description !== undefined) formData.append('description', payload.description)
    if (payload.link !== undefined) formData.append('link', payload.link)
    if (payload.button_text !== undefined) formData.append('button_text', payload.button_text)
    if (payload.imageFile) {
      formData.append('image', payload.imageFile)
    } else if (payload.image_url !== undefined) {
      formData.append('image_url', payload.image_url)
    }

    const response = await api.put(`/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data?.data
  } catch {
    const current = readJson(bannersStorageKey, [])
    const updated = current.map((item) => (item.id === id ? { ...item, ...payload } : item))
    writeJson(bannersStorageKey, updated)
    return updated.find((item) => item.id === id)
  }
}

export const deleteBanner = async (id) => {
  try {
    await api.delete(`/banners/${id}`)
  } catch {
    const current = readJson(bannersStorageKey, [])
    writeJson(
      bannersStorageKey,
      current.filter((item) => String(item.id) !== String(id))
    )
  }
}

export const getStoreInfo = async () => {
  try {
    const response = await api.get('/store-info')
    const data = response.data?.data || response.data
    writeJson(storeInfoStorageKey, data)
    return data
  } catch {
    return readJson(storeInfoStorageKey, defaultStoreInfo)
  }
}

export const updateStoreInfo = async (payload) => {
  try {
    const response = await api.put('/store-info', payload)
    return response.data?.data || response.data
  } catch {
    return writeJson(storeInfoStorageKey, payload)
  }
}

export { getErrorMessage }
