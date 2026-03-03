import { useEffect, useMemo, useState } from 'react'
import { FilterSidebar } from '../components/FilterSidebar'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { getStoreProducts } from '../service/storeApi'
import '../styles/products.css'

export const Products = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const highestPrice = useMemo(() => {
    if (!products.length) return 0
    return Math.ceil(Math.max(...products.map((plant) => plant.price)))
  }, [products])

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)
  const [careLevel, setCareLevel] = useState('Todos')
  const [sortBy, setSortBy] = useState('asc')

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getStoreProducts()
        setProducts(data)
        const max = data.length ? Math.ceil(Math.max(...data.map((item) => item.price))) : 0
        setMaxPrice(max)
      } catch {
        setError('Nao foi possivel carregar o catalogo.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const safeMin = Number.isNaN(minPrice) ? 0 : minPrice
    const safeMax = Number.isNaN(maxPrice) ? highestPrice : maxPrice

    return [...products]
      .filter((plant) => plant.price >= safeMin && plant.price <= safeMax)
      .filter((plant) => careLevel === 'Todos' || plant.careLevel === careLevel)
      .sort((a, b) => (sortBy === 'asc' ? a.price - b.price : b.price - a.price))
  }, [careLevel, highestPrice, maxPrice, minPrice, products, sortBy])

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
          careLevel={careLevel}
          sortBy={sortBy}
          highestPrice={highestPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onCareLevelChange={setCareLevel}
          onSortByChange={setSortBy}
        />

        {loading ? (
          <p className="empty-state">Carregando produtos...</p>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
            emptyMessage="Nenhum produto cadastrado pelo admin ainda."
          />
        )}
      </div>
    </section>
  )
}
