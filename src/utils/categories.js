const CATEGORY_STORAGE_KEY = 'admin_categories'
const PRODUCT_CATEGORY_MAP_KEY = 'product_category_map'

const defaultCategories = [
  { id: 'c1', nome: 'Folhagens', descricao: 'Plantas para ambientes internos' },
  { id: 'c2', nome: 'Flores', descricao: 'Plantas floridas e ornamentais' },
  { id: 'c3', nome: 'Suculentas', descricao: 'Facil cuidado e pouca rega' },
]

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
}

export const getCategories = () => {
  const stored = readJson(CATEGORY_STORAGE_KEY, null)
  if (stored && Array.isArray(stored) && stored.length) {
    return stored
  }

  writeJson(CATEGORY_STORAGE_KEY, defaultCategories)
  return defaultCategories
}

export const saveCategories = (categories) => {
  writeJson(CATEGORY_STORAGE_KEY, categories)
  return categories
}

export const getCategoryNames = () => getCategories().map((category) => category.nome)

export const getCategoryOptions = (includeAll = false) => {
  const names = getCategoryNames()
  return includeAll ? ['Todas', ...names] : names
}

export const getProductCategoryMap = () => readJson(PRODUCT_CATEGORY_MAP_KEY, {})

export const getProductCategory = (productId) => {
  const map = getProductCategoryMap()
  return map[String(productId)] || ''
}

export const setProductCategory = (productId, category) => {
  const map = getProductCategoryMap()
  if (category) {
    map[String(productId)] = category
  } else {
    delete map[String(productId)]
  }
  writeJson(PRODUCT_CATEGORY_MAP_KEY, map)
  return map
}

export const removeProductCategory = (productId) => {
  setProductCategory(productId, '')
}

export const renameCategoryInProducts = (previousName, nextName) => {
  const map = getProductCategoryMap()
  Object.keys(map).forEach((productId) => {
    if (map[productId] === previousName) {
      map[productId] = nextName
    }
  })
  writeJson(PRODUCT_CATEGORY_MAP_KEY, map)
}

export const clearRemovedCategoryFromProducts = (categoryName) => {
  const map = getProductCategoryMap()
  Object.keys(map).forEach((productId) => {
    if (map[productId] === categoryName) {
      delete map[productId]
    }
  })
  writeJson(PRODUCT_CATEGORY_MAP_KEY, map)
}
