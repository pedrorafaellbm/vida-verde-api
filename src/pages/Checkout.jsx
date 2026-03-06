import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/checkout.css'

const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)

export const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, calculateTotal } = useCart()

  const [form, setForm] = useState({
    nome: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    complemento: '',
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
    localStorage.setItem('shippingAddress', JSON.stringify(form))
    alert('Endereco salvo com sucesso!')
    navigate('/cart')
  }

  return (
    <section className="checkout-page">
      <h1>Endereço</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Dados de entrega</h2>

          <label htmlFor="nome">Nome</label>
          <input id="nome" name="nome" value={form.nome} onChange={handleChange} required />

          <div className="address-row">
            <div>
              <label htmlFor="cep">CEP</label>
              <input id="cep" name="cep" value={form.cep} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="estado">Estado</label>
              <input id="estado" name="estado" value={form.estado} onChange={handleChange} required />
            </div>
          </div>

          <div className="address-row">
            <div>
              <label htmlFor="cidade">Cidade</label>
              <input id="cidade" name="cidade" value={form.cidade} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="bairro">Bairro</label>
              <input id="bairro" name="bairro" value={form.bairro} onChange={handleChange} required />
            </div>
          </div>

          <label htmlFor="rua">Rua</label>
          <input id="rua" name="rua" value={form.rua} onChange={handleChange} required />

          <div className="address-row">
            <div>
              <label htmlFor="numero">Numero</label>
              <input id="numero" name="numero" value={form.numero} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="complemento">Complemento</label>
              <input
                id="complemento"
                name="complemento"
                value={form.complemento}
                onChange={handleChange}
                placeholder="Apto, bloco, referencia"
              />
            </div>
          </div>

          <button type="submit" className="btn">
            Salvar endereço
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
