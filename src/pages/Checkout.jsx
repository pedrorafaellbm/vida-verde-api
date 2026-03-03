import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/checkout.css'

const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, calculateTotal, clearCart } = useCart()

  const [form, setForm] = useState({
    fullName: '',
    cep: '',
    city: '',
    address: '',
    payment: 'cartao',
  })

  const subtotal = calculateTotal()
  const shipping = cartItems.length ? 19.9 : 0
  const total = subtotal + shipping

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!cartItems.length) return

    alert('Pedido finalizado com sucesso!')
    clearCart()
    navigate('/home')
  }

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Endereço de entrega</h2>

          <label htmlFor="fullName">Nome completo</label>
          <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />

          <label htmlFor="cep">CEP</label>
          <input id="cep" name="cep" value={form.cep} onChange={handleChange} required />

          <label htmlFor="city">Cidade</label>
          <input id="city" name="city" value={form.city} onChange={handleChange} required />

          <label htmlFor="address">Endereço</label>
          <input id="address" name="address" value={form.address} onChange={handleChange} required />

          <h2>Pagamento</h2>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment"
                value="cartao"
                checked={form.payment === 'cartao'}
                onChange={handleChange}
              />
              Cartão de crédito
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={form.payment === 'pix'}
                onChange={handleChange}
              />
              Pix
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="boleto"
                checked={form.payment === 'boleto'}
                onChange={handleChange}
              />
              Boleto
            </label>
          </div>

          <button type="submit" className="btn" disabled={!cartItems.length}>
            Finalizar pedido
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Resumo do pedido</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>
                {item.name} x{item.quantity}
              </span>
              <strong>{formatPrice(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="summary-item total">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-item total">
            <span>Frete</span>
            <strong>{formatPrice(shipping)}</strong>
          </div>
          <div className="summary-item grand-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}
