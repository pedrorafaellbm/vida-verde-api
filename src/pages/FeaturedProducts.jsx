import { useEffect, useState } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { getFeaturedProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'

export const FeaturedProducts = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadFeatured = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getFeaturedProducts()
        setProducts(data)
        setFavoriteIds(new Set(getFavorites()))
      } catch {
        setError('Nao foi possivel carregar os destaques.')
      } finally {
        setLoading(false)
      }
    }

    loadFeatured()
  }, [])

  const toggleFavorite = (productId) => {
    if (favoriteIds.has(productId)) {
      const next = removeFavorite(productId)
      setFavoriteIds(new Set(next))
      return
    }

    const next = addFavorite(productId)
    setFavoriteIds(new Set(next))
  }

  return (
    <section className="products-page">
      <div className="section-header">
        <h1>Produtos em Destaque</h1>
        <p>Selecao especial do marketplace</p>
      </div>

      {error ? <p className="empty-state">{error}</p> : null}

      {loading ? (
        <p className="empty-state">Carregando destaques...</p>
      ) : (
        <ProductGrid
          products={products}
          onAddToCart={addToCart}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          emptyMessage="Nenhum produto em destaque no momento."
        />
      )}
    </section>
  )
}
