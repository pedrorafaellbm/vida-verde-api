import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import { getStoreProductById } from '../service/storeApi'
import { addFavoriteRequest, removeFavoriteRequest } from '../service/api'
import { addFavorite, isFavorite, removeFavorite } from '../utils/favorites'
import '../styles/products.css'

const formatPrice = (price) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(price)

export const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { t } = useI18n()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getStoreProductById(id)
        setProduct(data)
        setSelectedImage(data.images[0] || '')
        setFavorited(isFavorite(data.id))
      } catch {
        setProduct(null)
        setError(t('product.notFound'))
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id, t])

  if (loading) {
    return <section className="product-details-page"><p className="empty-state">{t('product.loading')}</p></section>
  }

  const handleToggleFavorite = async () => {
    if (!product) return
    try {
      if (favorited) {
        await removeFavoriteRequest(product.id)
        removeFavorite(product.id)
        setFavorited(false)
        return
      }
      await addFavoriteRequest(product.id)
      addFavorite(product.id)
      setFavorited(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (!product) {
    return (
      <section className="product-details-page">
        <h1>{error || t('product.notFound')}</h1>
        <Link to="/products" className="btn">{t('product.backToProducts')}</Link>
      </section>
    )
  }

  return (
    <section className="product-details-page">
      <div className="product-details-layout">
        <div className="gallery-panel">
          <img src={selectedImage} alt={product.name} className="main-image" />
          <div className="thumb-list">
            {product.images.map((image) => (
              <button key={image} type="button" className={`thumb-button ${selectedImage === image ? 'active' : ''}`} onClick={() => setSelectedImage(image)}>
                <img src={image} alt={product.name} />
              </button>
            ))}
          </div>
        </div>
        <div className="details-panel">
          <h1>{product.name}</h1>
          <p className="details-price">{formatPrice(product.price)}</p>
          <p className="details-description">{product.description}</p>
          <ul className="details-info">
            <li><strong>{t('product.category')}:</strong> {product.category}</li>
            <li><strong>{t('product.stock')}:</strong> {product.stock}</li>
            <li><strong>{t('product.careLevel')}:</strong> {product.careLevel}</li>
          </ul>
          <div className="details-action-row">
            <button type="button" className="btn" onClick={() => addToCart(product)}>{t('product.addToCart')}</button>
            <button type="button" className={`btn btn-secondary details-favorite ${favorited ? 'active' : ''}`} onClick={handleToggleFavorite}>{favorited ? t('product.liked') : t('product.like')}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
