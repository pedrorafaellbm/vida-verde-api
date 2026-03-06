import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getStoreProductById } from '../service/storeApi'
import { addFavorite, isFavorite, removeFavorite } from '../utils/favorites'
import '../styles/products.css'

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
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
        setError('Produto nao encontrado.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <section className="product-details-page">
        <p className="empty-state">Carregando produto...</p>
      </section>
    )
  }

  const handleToggleFavorite = () => {
    if (!product) return
    if (favorited) {
      removeFavorite(product.id)
      setFavorited(false)
    } else {
      addFavorite(product.id)
      setFavorited(true)
    }
  }

  if (!product) {
    return (
      <section className="product-details-page">
        <h1>{error || 'Produto nao encontrado'}</h1>
        <Link to="/products" className="btn">
          Voltar para produtos
        </Link>
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
              <button
                key={image}
                type="button"
                className={`thumb-button ${selectedImage === image ? 'active' : ''}`}
                onClick={() => setSelectedImage(image)}
              >
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
            <li>
              <strong>Categoria:</strong> {product.category}
            </li>
            <li>
              <strong>Estoque:</strong> {product.stock}
            </li>
            <li>
              <strong>Nivel de cuidado:</strong> {product.careLevel}
            </li>
          </ul>

          <button type="button" className="btn" onClick={() => addToCart(product)}>
            Adicionar ao carrinho
          </button>
          <button
            type="button"
            className={`btn btn-secondary details-favorite ${favorited ? 'active' : ''}`}
            onClick={handleToggleFavorite}
          >
            {favorited ? '❤ Curtido' : '♡ Curtir'}
          </button>
        </div>
      </div>
    </section>
  )
}
