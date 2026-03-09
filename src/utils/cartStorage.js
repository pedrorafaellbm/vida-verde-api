const CART_STORAGE_KEY = 'cart_items'

const normalizeCart = (items) =>
  Array.isArray(items)
    ? items
        .filter((item) => item && item.id)
        .map((item) => ({
          ...item,
          quantity: Math.max(1, Number(item.quantity) || 1),
        }))
    : []

export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return normalizeCart(raw ? JSON.parse(raw) : [])
  } catch {
    return []
  }
}

export const saveCart = (items) => {
  const normalized = normalizeCart(items)
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized))
  return normalized
}

export const addToCart = (items, product) => {
  const current = normalizeCart(items)
  const existing = current.find((item) => item.id === product.id)

  if (existing) {
    return saveCart(
      current.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  return saveCart([...current, { ...product, quantity: 1 }])
}

export const removeFromCart = (items, productId) =>
  saveCart(normalizeCart(items).filter((item) => item.id !== productId))

export const clearCart = () => saveCart([])
