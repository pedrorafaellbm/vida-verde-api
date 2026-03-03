import { api } from './api'

const fallbackImage =
  'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=900&q=80'

const moneyToNumber = (value) => {
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export const normalizeProduct = (item) => ({
  id: item.id,
  name: item.nome || 'Produto sem nome',
  description: item.descricao || 'Sem descricao cadastrada.',
  price: moneyToNumber(item.preco),
  stock: Number(item.estoque ?? 0),
  image: item.imageUrl || fallbackImage,
  imageUrl: item.imageUrl || fallbackImage,
  images: [item.imageUrl || fallbackImage],
  careLevel: 'Facil',
  light: 'Conforme orientacao do produtor',
  watering: 'Conforme necessidade da especie',
})

export const getStoreProducts = async () => {
  const response = await api.get('/products')
  const data = response.data?.data || []
  return data.map(normalizeProduct)
}

export const getStoreProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return normalizeProduct(response.data)
}
