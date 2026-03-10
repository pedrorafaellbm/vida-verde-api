import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useI18n } from '../context/LocaleContext'
import '../styles/checkout.css'

const formatPrice = (price) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(price)

export const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, calculateTotal } = useCart()
  const { t } = useI18n()
  const [form, setForm] = useState({ nome: '', cep: '', estado: '', cidade: '', bairro: '', rua: '', numero: '', complemento: '' })
  const subtotal = calculateTotal()
  const shipping = cartItems.length ? 19.9 : 0
  const total = subtotal + shipping

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.setItem('shippingAddress', JSON.stringify(form))
    alert(t('checkout.addressSaved'))
    navigate('/carrinho')
  }

  return (
    <section className="checkout-page">
      <h1>{t('checkout.title')}</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>{t('checkout.deliveryData')}</h2>
          <label htmlFor="nome">{t('checkout.name')}</label>
          <input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
          <div className="address-row">
            <div><label htmlFor="cep">{t('checkout.cep')}</label><input id="cep" name="cep" value={form.cep} onChange={handleChange} required /></div>
            <div><label htmlFor="estado">{t('checkout.state')}</label><input id="estado" name="estado" value={form.estado} onChange={handleChange} required /></div>
          </div>
          <div className="address-row">
            <div><label htmlFor="cidade">{t('checkout.city')}</label><input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} required /></div>
            <div><label htmlFor="bairro">{t('checkout.district')}</label><input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} required /></div>
          </div>
          <label htmlFor="rua">{t('checkout.street')}</label>
          <input id="rua" name="rua" value={form.rua} onChange={handleChange} required />
          <div className="address-row">
            <div><label htmlFor="numero">{t('checkout.number')}</label><input id="numero" name="numero" value={form.numero} onChange={handleChange} required /></div>
            <div><label htmlFor="complemento">{t('checkout.complement')}</label><input id="complemento" name="complemento" value={form.complemento} onChange={handleChange} placeholder={t('checkout.complementPlaceholder')} /></div>
          </div>
          <button type="submit" className="btn">{t('checkout.saveAddress')}</button>
        </form>

        <aside className="checkout-summary">
          <h2>{t('checkout.orderSummary')}</h2>
          {cartItems.map((item) => <div key={item.id} className="summary-item"><span>{item.name} x{item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}
          <div className="summary-item total"><span>{t('cart.subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-item total"><span>{t('cart.shipping')}</span><strong>{formatPrice(shipping)}</strong></div>
          <div className="summary-item grand-total"><span>{t('cart.total')}</span><strong>{formatPrice(total)}</strong></div>
        </aside>
      </div>
    </section>
  )
}
