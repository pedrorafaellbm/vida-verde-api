const FAVORITES_KEY = 'favorites'

const normalize = (list) =>
  Array.from(new Set((Array.isArray(list) ? list : []).map((id) => Number(id)).filter(Boolean)))

export const getFavorites = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return normalize(raw ? JSON.parse(raw) : [])
  } catch {
    return []
  }
}

const saveFavorites = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(normalize(favorites)))
}

export const addFavorite = (productId) => {
  const current = getFavorites()
  if (!current.includes(Number(productId))) {
    saveFavorites([...current, Number(productId)])
  }
  return getFavorites()
}

export const removeFavorite = (productId) => {
  const current = getFavorites()
  saveFavorites(current.filter((id) => id !== Number(productId)))
  return getFavorites()
}

export const isFavorite = (productId) => getFavorites().includes(Number(productId))
