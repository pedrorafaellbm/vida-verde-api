import { Link } from 'react-router-dom'
import { CartItem } from '../components/CartItem'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import '../styles/cart.css'

const formatPrice = (price) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(price)

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, calculateTotal } = useCart()
  const { t } = useI18n()
  const subtotal = calculateTotal()
  const shipping = cartItems.length ? 19.9 : 0
  const total = subtotal + shipping

  return (
    <section className="cart-page">
      <div className="section-header">
        <h1>{t('cart.title')}</h1>
        <p>{cartItems.length} {t('cart.items')}</p>
      </div>

      {!cartItems.length ? (
        <div className="empty-state-block">
          <p>{t('cart.empty')}</p>
          <Link to="/products" className="btn">{t('cart.explore')}</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => <CartItem key={item.id} item={item} onIncrease={increaseQuantity} onDecrease={decreaseQuantity} onRemove={removeFromCart} />)}
          </div>
          <aside className="cart-summary">
            <h2>{t('cart.summary')}</h2>
            <div className="summary-row"><span>{t('cart.subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="summary-row"><span>{t('cart.shipping')}</span><strong>{formatPrice(shipping)}</strong></div>
            <div className="summary-row total"><span>{t('cart.total')}</span><strong>{formatPrice(total)}</strong></div>
            <Link to="/endereco" className="btn checkout-link">{t('cart.goToAddress')}</Link>
          </aside>
        </div>
      )}
    </section>
  )
}
