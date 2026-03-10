import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import { listCategories } from '../service/adminApi'
import { getStoreProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'
import '../styles/products.css'

export const Products = () => {
  const { addToCart } = useCart()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryOptions, setCategoryOptions] = useState([t('home.allCategory')])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState(t('home.allCategory'))
  const [sortBy, setSortBy] = useState('asc')
  const search = searchParams.get('search') || ''

  const highestPrice = useMemo(() => (!products.length ? 0 : Math.ceil(Math.max(...products.map((product) => product.price)))), [products])

  useEffect(() => {
    const allLabel = t('home.allCategory')
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsData, categoriesData] = await Promise.all([getStoreProducts(search), listCategories()])
        setProducts(productsData)
        setCategoryOptions([allLabel, ...categoriesData.map((item) => item.name)])
        const max = productsData.length ? Math.ceil(Math.max(...productsData.map((item) => item.price))) : 0
        setMaxPrice(max)
      } catch {
        setError(t('productsPage.error'))
      } finally {
        setFavoriteIds(new Set(getFavorites()))
        setLoading(false)
      }
    }
    loadProducts()
  }, [search, t])

  const toggleFavorite = (productId) => {
    if (favoriteIds.has(productId)) {
      setFavoriteIds(new Set(removeFavorite(productId)))
      return
    }
    setFavoriteIds(new Set(addFavorite(productId)))
  }

  const filteredProducts = useMemo(() => {
    const safeMin = Number.isNaN(minPrice) ? 0 : minPrice
    const safeMax = Number.isNaN(maxPrice) ? highestPrice : maxPrice
    return [...products]
      .filter((product) => product.price >= safeMin && product.price <= safeMax)
      .filter((product) => selectedCategory === t('home.allCategory') || product.category === selectedCategory)
      .sort((a, b) => (sortBy === 'asc' ? a.price - b.price : b.price - a.price))
  }, [highestPrice, maxPrice, minPrice, products, selectedCategory, sortBy, t])

  return (
    <section className="products-page">
      <div className="section-header">
        <div>
          <h1>{t('productsPage.title')}</h1>
          <p>{search ? `${t('productsPage.resultsFor')} "${search}"` : t('productsPage.subtitle')}</p>
        </div>
        <p>{filteredProducts.length} {t('productsPage.found')}</p>
      </div>
      {error ? <p className="empty-state">{error}</p> : null}
      <div className="products-layout">
        <FilterSidebar minPrice={minPrice} maxPrice={maxPrice} selectedCategory={selectedCategory} sortBy={sortBy} highestPrice={highestPrice} categories={categoryOptions} onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice} onCategoryChange={setSelectedCategory} onSortByChange={setSortBy} />
        {loading ? <p className="empty-state">{t('productsPage.loading')}</p> : <ProductGrid products={filteredProducts} onAddToCart={addToCart} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyMessage={t('productsPage.empty')} />}
      </div>
    </section>
  )
}
