import { Link } from 'react-router-dom'
import { CartItem } from '../components/CartItem'
import { useCart } from '../context/CartContext'
import '../styles/cart.css'

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, calculateTotal } = useCart()

  const subtotal = calculateTotal()
  const shipping = cartItems.length ? 19.9 : 0
  const total = subtotal + shipping

  return (
    <section className="cart-page">
      <div className="section-header">
        <h1>Seu Carrinho</h1>
        <p>{cartItems.length} itens</p>
      </div>

      {!cartItems.length ? (
        <div className="empty-state-block">
          <p>Seu carrinho está vazio.</p>
          <Link to="/products" className="btn">
            Explorar produtos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Resumo</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Frete</span>
              <strong>{formatPrice(shipping)}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <Link to="/endereco" className="btn checkout-link">
              Ir para Endereco
            </Link>
          </aside>
        </div>
      )}
    </section>
  )
}
