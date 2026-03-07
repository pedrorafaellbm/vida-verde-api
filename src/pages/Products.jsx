import { useEffect, useMemo, useState } from 'react'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { listCategories } from '../service/adminApi'
import { getStoreProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'
import '../styles/products.css'

export const Products = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryOptions, setCategoryOptions] = useState(['Todas'])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [sortBy, setSortBy] = useState('asc')

  const highestPrice = useMemo(() => {
    if (!products.length) return 0
    return Math.ceil(Math.max(...products.map((plant) => plant.price)))
  }, [products])

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsData, categoriesData] = await Promise.all([
          getStoreProducts(),
          listCategories(),
        ])
        setProducts(productsData)
        setCategoryOptions(['Todas', ...categoriesData.map((item) => item.name)])
        const max = productsData.length
          ? Math.ceil(Math.max(...productsData.map((item) => item.price)))
          : 0
        setMaxPrice(max)
      } catch {
        setError('Nao foi possivel carregar o catalogo.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    setFavoriteIds(new Set(getFavorites()))
  }, [])

  const toggleFavorite = (productId) => {
    const isActive = favoriteIds.has(productId)
    if (isActive) {
      const next = removeFavorite(productId)
      setFavoriteIds(new Set(next))
    } else {
      const next = addFavorite(productId)
      setFavoriteIds(new Set(next))
    }
  }

  const filteredProducts = useMemo(() => {
    const safeMin = Number.isNaN(minPrice) ? 0 : minPrice
    const safeMax = Number.isNaN(maxPrice) ? highestPrice : maxPrice

    return [...products]
      .filter((product) => product.price >= safeMin && product.price <= safeMax)
      .filter((product) => selectedCategory === 'Todas' || product.category === selectedCategory)
      .sort((a, b) => (sortBy === 'asc' ? a.price - b.price : b.price - a.price))
  }, [highestPrice, maxPrice, minPrice, products, selectedCategory, sortBy])

  return (
    <section className="products-page">
      <div className="section-header">
        <h1>Catalogo de Plantas</h1>
        <p>{filteredProducts.length} produtos encontrados</p>
      </div>

      {error && <p className="empty-state">{error}</p>}

      <div className="products-layout">
        <FilterSidebar
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          highestPrice={highestPrice}
          categories={categoryOptions}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onCategoryChange={setSelectedCategory}
          onSortByChange={setSortBy}
        />

        {loading ? (
          <p className="empty-state">Carregando produtos...</p>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            emptyMessage="Nenhum produto cadastrado pelo admin ainda."
          />
        )}
      </div>
    </section>
  )
}
