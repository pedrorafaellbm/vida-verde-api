import { api, getApiErrorMessage, listBannersRequest, listFavoritesRequest, listFeaturedProductsRequest, listStoreInfoRequest } from './api'
import { getFavorites } from '../utils/favorites'

const fallbackImage = 'https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=900&q=80'
const localBannerKey = 'admin_banners'
const localStoreInfoKey = 'store_info_content'
const isEnglish = typeof navigator !== 'undefined' && (navigator.language || '').toLowerCase().startsWith('en')

const defaultBanners = [
  { id: 'fallback-1', title: isEnglish ? 'Transform your home with plants' : 'Transforme sua casa com plantas', description: isEnglish ? 'Special selection with fast delivery and polished presentation.' : 'Selecao especial com entrega rapida e visual impecavel.', image_url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1600&q=80', link: '/products', button_text: isEnglish ? 'Explore catalog' : 'Explorar catalogo' },
  { id: 'fallback-2', title: isEnglish ? 'Curated products with quality' : 'Cultivo com qualidade e curadoria', description: isEnglish ? 'Selected products to decorate, gift and refresh spaces.' : 'Produtos selecionados para decorar, presentear e renovar ambientes.', image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80', link: '/destaques', button_text: isEnglish ? 'See featured' : 'Ver destaques' },
  { id: 'fallback-3', title: isEnglish ? 'Fast delivery to your home' : 'Entrega agil para todo o Brasil', description: isEnglish ? 'Shop with convenience and get support at every step.' : 'Compre com praticidade e receba com suporte em cada etapa.', image_url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80', link: '/contato', button_text: isEnglish ? 'Contact us' : 'Fale conosco' },
]

const defaultStoreInfo = {
  title: isEnglish ? 'About the Store' : 'Sobre a Loja',
  description: isEnglish ? 'We are a store dedicated to high-quality plants, with a focus on practicality, curation and human support.' : 'Somos uma loja dedicada ao cultivo e venda de plantas de qualidade, com foco em praticidade, curadoria e atendimento humano.',
  mission: isEnglish ? 'Connect people to nature through selected products, clear information and a simple purchase.' : 'Conectar pessoas a natureza com produtos selecionados, informacao clara e uma compra simples.',
  quality: isEnglish ? 'Each item is chosen to ensure good adaptation, strong presentation and visual quality.' : 'Cada item e escolhido para garantir boa adaptacao, visual bonito e excelente apresentacao.',
  delivery: isEnglish ? 'Fast dispatch, secure packaging and attentive follow-up for every order.' : 'Despacho rapido, embalagens seguras e acompanhamento atencioso para cada pedido.',
}

const readJson = (key, fallback) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch { return fallback } }
const moneyToNumber = (value) => { if (typeof value === 'number') return value; const parsed = Number(value); return Number.isNaN(parsed) ? 0 : parsed }
const inferCategory = (item) => item?.category?.name || item?.categoria || 'Sem categoria'

export const normalizeProduct = (item) => ({ id: item.id, name: item.nome || item.name || 'Produto sem nome', description: item.descricao || item.description || 'Sem descricao cadastrada.', price: moneyToNumber(item.preco ?? item.price), stock: Number(item.estoque ?? item.stock ?? 0), image: item.imageUrl || item.image_url || item.image || fallbackImage, imageUrl: item.imageUrl || item.image_url || item.image || fallbackImage, images: [item.imageUrl || item.image_url || item.image || fallbackImage], careLevel: item.careLevel || 'Facil', category: inferCategory(item), light: item.light || 'Conforme orientacao do produtor', watering: item.watering || 'Conforme necessidade da especie', featured: Boolean(item.featured || item.destaque || item.is_featured) })
const filterBySearch = (items, search) => { const normalized = search.trim().toLowerCase(); if (!normalized) return items; return items.filter((item) => item.name.toLowerCase().includes(normalized)) }

export const getStoreProducts = async (search = '') => {
  try { const response = await api.get('/products', { params: search ? { search } : undefined }); return filterBySearch((response.data?.data || []).map(normalizeProduct), search) } catch { const response = await api.get('/products'); return filterBySearch((response.data?.data || []).map(normalizeProduct), search) }
}
export const getStoreProductById = async (id) => normalizeProduct((await api.get(`/products/${id}`)).data)
export const getFeaturedProducts = async () => { try { return (await listFeaturedProductsRequest()).map(normalizeProduct) } catch { return (await getStoreProducts()).slice(0, 6) } }
export const getStoreBanners = async () => { try { const data = await listBannersRequest(); return data.length ? data : readJson(localBannerKey, defaultBanners) } catch { return readJson(localBannerKey, defaultBanners) } }
export const getStoreInfo = async () => { try { return (await listStoreInfoRequest()) || readJson(localStoreInfoKey, defaultStoreInfo) } catch { return readJson(localStoreInfoKey, defaultStoreInfo) } }
export const getFavoriteProducts = async () => { try { return (await listFavoritesRequest()).map((item) => item.product || item.produto).filter(Boolean).map(normalizeProduct) } catch { const products = await getStoreProducts(); const ids = new Set(getFavorites()); return products.filter((item) => ids.has(item.id)) } }
export { getApiErrorMessage }
