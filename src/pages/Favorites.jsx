import { useEffect, useState } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { getFavoriteProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'

export const Favorites = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getFavoriteProducts()
        setProducts(data)
        setFavoriteIds(new Set(getFavorites()))
      } catch {
        setError('Nao foi possivel carregar seus curtidos.')
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const toggleFavorite = (productId) => {
    if (favoriteIds.has(productId)) {
      const next = removeFavorite(productId)
      setFavoriteIds(new Set(next))
      setProducts((prev) => prev.filter((item) => item.id !== productId))
      return
    }

    const next = addFavorite(productId)
    setFavoriteIds(new Set(next))
  }

  return (
    <section className="products-page">
      <div className="section-header">
        <h1>Curtidos</h1>
        <p>{products.length} produtos salvos</p>
      </div>

      {error ? <p className="empty-state">{error}</p> : null}

      {loading ? (
        <p className="empty-state">Carregando curtidos...</p>
      ) : (
        <ProductGrid
          products={products}
          onAddToCart={addToCart}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          emptyMessage="Voce ainda nao curtiu nenhum produto."
        />
      )}
    </section>
  )
}
