import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BannerCarousel } from '../components/BannerCarousel'
import { Categories } from '../components/Categories'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { listCategories } from '../service/adminApi'
import {
  getFeaturedProducts,
  getStoreBanners,
  getStoreInfo,
  getStoreProducts,
} from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'
import '../styles/home.css'

export const Home = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState(['Todas'])
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [banners, setBanners] = useState([])
  const [storeInfo, setStoreInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsData, featuredData, categoriesData, bannersData, storeInfoData] =
          await Promise.all([
            getStoreProducts(),
            getFeaturedProducts(),
            listCategories(),
            getStoreBanners(),
            getStoreInfo(),
          ])

        setProducts(productsData)
        setFeaturedProducts(featuredData)
        setCategories(['Todas', ...categoriesData.map((item) => item.name)])
        setBanners(bannersData)
        setStoreInfo(storeInfoData)
      } catch {
        setError('Nao foi possivel carregar a pagina inicial.')
      } finally {
        setFavoriteIds(new Set(getFavorites()))
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const toggleFavorite = (productId) => {
    if (favoriteIds.has(productId)) {
      setFavoriteIds(new Set(removeFavorite(productId)))
      return
    }

    setFavoriteIds(new Set(addFavorite(productId)))
  }

  const allProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <section className="home-page">
      <BannerCarousel banners={banners} />

      <section className="home-categories">
        <div className="section-header">
          <h2>Categorias</h2>
          <p>Navegue pelos tipos de produto com um clique.</p>
        </div>
        <Categories categories={categories} selected={selectedCategory} onChange={setSelectedCategory} />
      </section>

      <section className="home-highlight">
        <div className="section-header">
          <div>
            <h2>Produtos em Destaque</h2>
            <p>Selecao especial para decorar, presentear e renovar ambientes.</p>
          </div>
          <Link to="/destaques" className="see-all-link">
            Ver todos os destaques
          </Link>
        </div>

        {error ? <p className="empty-state">{error}</p> : null}

        {loading ? (
          <p className="empty-state">Carregando destaques...</p>
        ) : (
          <ProductGrid
            products={featuredProducts}
            onAddToCart={addToCart}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            emptyMessage="Nenhum produto em destaque no momento."
          />
        )}
      </section>

      <section className="home-highlight">
        <div className="section-header">
          <div>
            <h2>Todos os Produtos</h2>
            <p>Catalogo completo com curadoria e visual consistente.</p>
          </div>
          <Link to="/products" className="see-all-link">
            Abrir catalogo
          </Link>
        </div>

        {loading ? (
          <p className="empty-state">Carregando produtos...</p>
        ) : (
          <ProductGrid
            products={allProducts}
            onAddToCart={addToCart}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            emptyMessage="Nenhum produto nessa categoria."
          />
        )}
      </section>

      <section className="about-store">
        <div className="section-header">
          <div>
            <h2>{storeInfo?.title || 'Sobre a Loja'}</h2>
            <p>{storeInfo?.description || 'Conheca mais sobre nossa curadoria e atendimento.'}</p>
          </div>
        </div>

        <div className="about-grid">
          <article>
            <h3>Missao</h3>
            <p>{storeInfo?.mission || 'Conectar pessoas a natureza com uma compra simples e segura.'}</p>
          </article>
          <article>
            <h3>Qualidade</h3>
            <p>{storeInfo?.quality || 'Produtos escolhidos com foco em saude, beleza e boa apresentacao.'}</p>
          </article>
          <article>
            <h3>Entrega</h3>
            <p>{storeInfo?.delivery || 'Despacho rapido e embalagens seguras para todo o Brasil.'}</p>
          </article>
        </div>
      </section>
    </section>
  )
}
