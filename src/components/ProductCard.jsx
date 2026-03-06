import { Link } from 'react-router-dom'

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

const careClassByLevel = {
  'Fácil': 'care-easy',
  'Médio': 'care-medium',
  'Difícil': 'care-hard',
}

export const ProductCard = ({ product, onAddToCart, isFavorited, onToggleFavorite }) => {
  const imageSrc = product.imageUrl || product.image

  return (
    <article className="product-card">
      <button
        type="button"
        className={`favorite-btn ${isFavorited ? 'active' : ''}`}
        onClick={() => onToggleFavorite?.(product.id)}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        ❤
      </button>
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={imageSrc} alt={product.name} className="product-image" loading="lazy" />
      </Link>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <span className={`care-pill ${careClassByLevel[product.careLevel]}`}>
          Cuidado: {product.careLevel}
        </span>

        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary">
            Detalhes
          </Link>
          <button type="button" className="btn" onClick={() => onAddToCart(product)}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  )
}
