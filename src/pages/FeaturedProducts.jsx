import { useEffect, useState } from 'react'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import { getFeaturedProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'

export const FeaturedProducts = () => {
  const { addToCart } = useCart()
  const { t } = useI18n()
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
        setError(t('featuredPage.error'))
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [t])

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
        <h1>{t('featuredPage.title')}</h1>
        <p>{t('featuredPage.subtitle')}</p>
      </div>
      {error ? <p className="empty-state">{error}</p> : null}
      {loading ? <p className="empty-state">{t('featuredPage.loading')}</p> : <ProductGrid products={products} onAddToCart={addToCart} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyMessage={t('featuredPage.empty')} />}
    </section>
  )
}
