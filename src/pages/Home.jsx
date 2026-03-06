import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Banner } from '../components/Banner'
import { Categories } from '../components/Categories'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { getStoreProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'
import '../styles/home.css'

export const Home = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getStoreProducts()
        setProducts(data)
      } catch {
        setError('Nao foi possivel carregar os produtos.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    setFavoriteIds(new Set(getFavorites()))
  }, [])

  const toggleFavorite = async (productId) => {
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
    if (selectedCategory === 'Todas') return products
    return products.filter((item) => item.category === selectedCategory)
  }, [products, selectedCategory])

  const featuredProducts = useMemo(() => filteredProducts.slice(0, 4), [filteredProducts])

  return (
    <section className="home-page">
      <Banner />

      <section className="home-categories">
        <div className="section-header">
          <h2>Categorias</h2>
          <p>Filtre os produtos com um clique</p>
        </div>
        <Categories selected={selectedCategory} onChange={setSelectedCategory} />
      </section>

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
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            emptyMessage="Nenhum produto cadastrado pelo admin ainda."
          />
        )}
      </div>

      <section className="home-highlight">
        <div className="section-header">
          <h2>Todos os produtos</h2>
          <Link to="/products" className="see-all-link">
            Ir para pagina de produtos
          </Link>
        </div>

        {loading ? (
          <p className="empty-state">Carregando produtos...</p>
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            emptyMessage="Nenhum produto nessa categoria."
          />
        )}
      </section>

      <section className="about-store">
        <h2>Sobre a Loja</h2>
        <p>
          Somos uma loja dedicada ao cultivo e venda de plantas de qualidade, com foco em
          praticidade para quem quer deixar a casa mais viva.
        </p>
        <div className="about-grid">
          <article>
            <h3>Missao</h3>
            <p>Conectar pessoas a natureza com produtos selecionados e suporte simples.</p>
          </article>
          <article>
            <h3>Qualidade</h3>
            <p>Cada item e escolhido para garantir boa adaptacao e otimo acabamento.</p>
          </article>
          <article>
            <h3>Entrega</h3>
            <p>Despacho rapido e embalagens seguras para seu pedido chegar em perfeitas condicoes.</p>
          </article>
        </div>
      </section>
    </section>
  )
}
