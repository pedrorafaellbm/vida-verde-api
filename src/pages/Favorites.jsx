import { useEffect, useState } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import { getFavoriteProducts } from '../service/storeApi'
import { addFavoriteRequest, removeFavoriteRequest } from '../service/api'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'

export const Favorites = () => {
  const { addToCart } = useCart()
  const { t } = useI18n()
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
        setError(t('favoritesPage.error'))
      } finally {
        setLoading(false)
      }
    }
    loadFavorites()
  }, [t])

  const toggleFavorite = async (productId) => {
    try {
      if (favoriteIds.has(productId)) {
        await removeFavoriteRequest(productId)
        const next = removeFavorite(productId)
        setFavoriteIds(new Set(next))
        setProducts((prev) => prev.filter((item) => item.id !== productId))
        return
      }

      await addFavoriteRequest(productId)
      const next = addFavorite(productId)
      setFavoriteIds(new Set(next))
    } catch (err) {
      console.error(err)
      setError(t('favoritesPage.error'))
    }
  }

  return (
    <section className="products-page">
      <div className="section-header">
        <h1>{t('favoritesPage.title')}</h1>
        <p>{products.length} {t('favoritesPage.saved')}</p>
      </div>
      {error ? <p className="empty-state">{error}</p> : null}
      {loading ? <p className="empty-state">{t('favoritesPage.loading')}</p> : <ProductGrid products={products} onAddToCart={addToCart} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyMessage={t('favoritesPage.empty')} />}
    </section>
  )
}
