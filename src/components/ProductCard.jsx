import { Link } from 'react-router-dom'
import { useI18n } from '../context/LocaleContext'

const formatPrice = (price) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(price)
const careClassByLevel = { 'Fácil': 'care-easy', 'Médio': 'care-medium', 'Difícil': 'care-hard' }

export const ProductCard = ({ product, onAddToCart, isFavorited, onToggleFavorite }) => {
  const imageSrc = product.imageUrl || product.image
  const { t } = useI18n()

  return (
    <article className="product-card">
      <button type="button" className={`favorite-btn ${isFavorited ? 'active' : ''}`} onClick={() => onToggleFavorite?.(product.id)} aria-label={isFavorited ? t('product.removeFromFavorites') : t('product.addToFavorites')}>
        ?
      </button>
      <Link to={`/products/${product.id}`} className="product-image-wrap"><img src={imageSrc} alt={product.name} className="product-image" loading="lazy" /></Link>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <span className={`care-pill ${careClassByLevel[product.careLevel]}`}>{t('product.care')}: {product.careLevel}</span>
        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary">{t('common.details')}</Link>
          <button type="button" className="btn" onClick={() => onAddToCart(product)}>{t('common.add')}</button>
        </div>
      </div>
    </article>
  )
}
