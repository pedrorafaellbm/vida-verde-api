import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { getStoreProducts } from '../service/storeApi'
import '../styles/home.css'

export const Home = () => {
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const products = await getStoreProducts()
        setFeaturedProducts(products.slice(0, 4))
      } catch {
        setError('Nao foi possivel carregar os produtos.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">E-commerce de plantas</span>
          <h1>Transforme qualquer ambiente com natureza</h1>
          <p>
            Descubra plantas selecionadas para interiores, com entrega rapida e cuidados
            explicados para cada especie.
          </p>
          <Link to="/products" className="btn hero-btn">
            Ver Produtos
          </Link>
        </div>
      </div>

      <div className="home-highlight">
        <div className="section-header">
          <h2>Produtos em destaque</h2>
          <Link to="/products" className="see-all-link">
            Ver catalogo completo
          </Link>
        </div>

        {error && <p className="empty-state">{error}</p>}
        {loading ? (
          <p className="empty-state">Carregando produtos...</p>
        ) : (
          <ProductGrid
            products={featuredProducts}
            onAddToCart={addToCart}
            emptyMessage="Nenhum produto cadastrado pelo admin ainda."
          />
        )}
      </div>
    </section>
  )
}
