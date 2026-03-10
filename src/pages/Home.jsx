import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BannerCarousel } from '../components/BannerCarousel'
import { Categories } from '../components/Categories'
import { ProductGrid } from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import { listCategories } from '../service/adminApi'
import { getFeaturedProducts, getStoreBanners, getStoreInfo, getStoreProducts } from '../service/storeApi'
import { addFavorite, getFavorites, removeFavorite } from '../utils/favorites'
import '../styles/home.css'

export const Home = () => {
  const { addToCart } = useCart()
  const { t } = useI18n()
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([t('home.allCategory')])
  const [selectedCategory, setSelectedCategory] = useState(t('home.allCategory'))
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [banners, setBanners] = useState([])
  const [storeInfo, setStoreInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const allLabel = t('home.allCategory')
    const loadHomeData = async () => {
      setLoading(true)
      setError('')
      try {
        const [productsData, featuredData, categoriesData, bannersData, storeInfoData] = await Promise.all([
          getStoreProducts(), getFeaturedProducts(), listCategories(), getStoreBanners(), getStoreInfo(),
        ])
        setProducts(productsData)
        setFeaturedProducts(featuredData)
        setCategories([allLabel, ...categoriesData.map((item) => item.name)])
        setSelectedCategory((current) => (current ? current : allLabel))
        setBanners(bannersData)
        setStoreInfo(storeInfoData)
      } catch {
        setError(t('home.pageError'))
      } finally {
        setFavoriteIds(new Set(getFavorites()))
        setLoading(false)
      }
    }

    loadHomeData()
  }, [t])

  const toggleFavorite = (productId) => {
    if (favoriteIds.has(productId)) {
      setFavoriteIds(new Set(removeFavorite(productId)))
      return
    }
    setFavoriteIds(new Set(addFavorite(productId)))
  }

  const allLabel = t('home.allCategory')
  const allProducts = selectedCategory === allLabel ? products : products.filter((product) => product.category === selectedCategory)

  return (
    <section className="home-page">
      <BannerCarousel banners={banners} />

      <section className="home-categories">
        <div className="section-header">
          <h2>{t('home.categoriesTitle')}</h2>
          <p>{t('home.categoriesSubtitle')}</p>
        </div>
        <Categories categories={categories} selected={selectedCategory} onChange={setSelectedCategory} />
      </section>

      <section className="home-highlight">
        <div className="section-header">
          <div>
            <h2>{t('home.featuredTitle')}</h2>
            <p>{t('home.featuredSubtitle')}</p>
          </div>
          <Link to="/destaques" className="see-all-link">{t('home.featuredLink')}</Link>
        </div>
        {error ? <p className="empty-state">{error}</p> : null}
        {loading ? <p className="empty-state">{t('home.featuredLoading')}</p> : <ProductGrid products={featuredProducts} onAddToCart={addToCart} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyMessage={t('home.featuredEmpty')} />}
      </section>

      <section className="home-highlight">
        <div className="section-header">
          <div>
            <h2>{t('home.allProductsTitle')}</h2>
            <p>{t('home.allProductsSubtitle')}</p>
          </div>
          <Link to="/products" className="see-all-link">{t('home.allProductsLink')}</Link>
        </div>
        {loading ? <p className="empty-state">{t('home.productsLoading')}</p> : <ProductGrid products={allProducts} onAddToCart={addToCart} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} emptyMessage={t('home.categoryEmpty')} />}
      </section>

      <section className="about-store">
        <div className="section-header">
          <div>
            <h2>{storeInfo?.title || t('home.aboutTitle')}</h2>
            <p>{storeInfo?.description || t('home.aboutFallback')}</p>
          </div>
        </div>
        <div className="about-grid">
          <article><h3>{t('home.mission')}</h3><p>{storeInfo?.mission || t('home.missionFallback')}</p></article>
          <article><h3>{t('home.quality')}</h3><p>{storeInfo?.quality || t('home.qualityFallback')}</p></article>
          <article><h3>{t('home.delivery')}</h3><p>{storeInfo?.delivery || t('home.deliveryFallback')}</p></article>
        </div>
      </section>
    </section>
  )
}
