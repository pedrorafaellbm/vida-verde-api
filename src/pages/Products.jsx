import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { listCategories } from '../service/adminApi'
import { getStoreProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'
import '../styles/products.css'

export const Products = () => {
  const { addToCart } = useCart()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoryOptions, setCategoryOptions] = useState(['Todas'])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [sortBy, setSortBy] = useState('asc')

  const search = searchParams.get('search') || ''

  const highestPrice = useMemo(() => {
    if (!products.length) return 0
    return Math.ceil(Math.max(...products.map((product) => product.price)))
  }, [products])

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsData, categoriesData] = await Promise.all([
          getStoreProducts(search),
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
        setFavoriteIds(new Set(getFavorites()))
        setLoading(false)
      }
    }

    loadProducts()
  }, [search])

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
      .filter((product) => selectedCategory === 'Todas' || product.category === selectedCategory)
      .sort((a, b) => (sortBy === 'asc' ? a.price - b.price : b.price - a.price))
  }, [highestPrice, maxPrice, minPrice, products, selectedCategory, sortBy])

  return (
    <section className="products-page">
      <div className="section-header">
        <div>
          <h1>Catalogo de Produtos</h1>
          <p>
            {search ? `Resultados para "${search}"` : 'Explore o marketplace completo.'}
          </p>
        </div>
        <p>{filteredProducts.length} produtos encontrados</p>
      </div>

      {error ? <p className="empty-state">{error}</p> : null}

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
            emptyMessage="Nenhum produto encontrado com os filtros atuais."
          />
        )}
      </div>
    </section>
  )
}
