import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addToCart as addToCartStorage,
  clearCart as clearCartStorage,
  getCart,
  removeFromCart as removeFromCartStorage,
  saveCart,
} from '../utils/cartStorage'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getCart())

  useEffect(() => {
    saveCart(cartItems)
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems((prev) => addToCartStorage(prev, product))
  }

  const removeFromCart = (id) => {
    setCartItems((prev) => removeFromCartStorage(prev, id))
  }

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      saveCart(
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    )
  }

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      saveCart(
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
          )
          .filter((item) => item.quantity > 0)
      )
    )
  }

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const clearCart = () => setCartItems(clearCartStorage())

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      calculateTotal,
      clearCart,
    }),
    [cartItems]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }
  return context
}
