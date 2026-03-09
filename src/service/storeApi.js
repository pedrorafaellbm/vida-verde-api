import {
  api,
  getApiErrorMessage,
  listBannersRequest,
  listFavoritesRequest,
  listFeaturedProductsRequest,
  listStoreInfoRequest,
} from './api'
import { getFavorites } from '../utils/favorites'

const fallbackImage =
  'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=900&q=80'

const localBannerKey = 'admin_banners'
const localStoreInfoKey = 'store_info_content'

const defaultBanners = [
  {
    id: 'fallback-1',
    title: 'Transforme sua casa com plantas',
    description: 'Selecao especial com entrega rapida e visual impecavel.',
    image_url:
      'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1600&q=80',
    link: '/products',
    button_text: 'Explorar catalogo',
  },
  {
    id: 'fallback-2',
    title: 'Cultivo com qualidade e curadoria',
    description: 'Produtos selecionados para decorar, presentear e renovar ambientes.',
    image_url:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80',
    link: '/destaques',
    button_text: 'Ver destaques',
  },
  {
    id: 'fallback-3',
    title: 'Entrega agil para todo o Brasil',
    description: 'Compre com praticidade e receba com suporte em cada etapa.',
    image_url:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80',
    link: '/contato',
    button_text: 'Fale conosco',
  },
]

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

const moneyToNumber = (value) => {
  if (typeof value === 'number') return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const inferCategory = (item) => {
  if (item?.category?.name) return item.category.name
  if (item?.categoria) return item.categoria
  return 'Sem categoria'
}

export const normalizeProduct = (item) => ({
  id: item.id,
  name: item.nome || item.name || 'Produto sem nome',
  description: item.descricao || item.description || 'Sem descricao cadastrada.',
  price: moneyToNumber(item.preco ?? item.price),
  stock: Number(item.estoque ?? item.stock ?? 0),
  image: item.imageUrl || item.image_url || item.image || fallbackImage,
  imageUrl: item.imageUrl || item.image_url || item.image || fallbackImage,
  images: [item.imageUrl || item.image_url || item.image || fallbackImage],
  careLevel: item.careLevel || 'Facil',
  category: inferCategory(item),
  light: item.light || 'Conforme orientacao do produtor',
  watering: item.watering || 'Conforme necessidade da especie',
  featured: Boolean(item.featured || item.destaque || item.is_featured),
})

const filterBySearch = (items, search) => {
  const normalized = search.trim().toLowerCase()
  if (!normalized) return items
  return items.filter((item) => item.name.toLowerCase().includes(normalized))
}

export const getStoreProducts = async (search = '') => {
  try {
    const response = await api.get('/products', {
      params: search ? { search } : undefined,
    })
    const data = response.data?.data || []
    return filterBySearch(data.map(normalizeProduct), search)
  } catch {
    const response = await api.get('/products')
    const data = response.data?.data || []
    return filterBySearch(data.map(normalizeProduct), search)
  }
}

export const getStoreProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return normalizeProduct(response.data)
}

export const getFeaturedProducts = async () => {
  try {
    const data = await listFeaturedProductsRequest()
    return data.map(normalizeProduct)
  } catch {
    const products = await getStoreProducts()
    return products.slice(0, 6)
  }
}

export const getStoreBanners = async () => {
  try {
    const data = await listBannersRequest()
    return data.length ? data : readJson(localBannerKey, defaultBanners)
  } catch {
    return readJson(localBannerKey, defaultBanners)
  }
}

export const getStoreInfo = async () => {
  try {
    const data = await listStoreInfoRequest()
    return data || readJson(localStoreInfoKey, defaultStoreInfo)
  } catch {
    return readJson(localStoreInfoKey, defaultStoreInfo)
  }
}

export const getFavoriteProducts = async () => {
  try {
    const favorites = await listFavoritesRequest()
    return favorites
      .map((item) => item.product || item.produto)
      .filter(Boolean)
      .map(normalizeProduct)
  } catch (error) {
    const products = await getStoreProducts()
    const ids = new Set(getFavorites())
    return products.filter((item) => ids.has(item.id))
  }
}

export { getApiErrorMessage }
