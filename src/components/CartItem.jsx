import { useI18n } from '../context/LocaleContext'

const formatPrice = (price) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'BRL' }).format(price)

export const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const { t } = useI18n()
  return (
    <article className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-main"><h3>{item.name}</h3><p>{formatPrice(item.price)}</p></div>
      <div className="cart-item-controls"><button type="button" onClick={() => onDecrease(item.id)}>-</button><span>{item.quantity}</span><button type="button" onClick={() => onIncrease(item.id)}>+</button></div>
      <div className="cart-item-total">{formatPrice(item.price * item.quantity)}</div>
      <button type="button" className="remove-item" onClick={() => onRemove(item.id)}>{t('cart.remove')}</button>
    </article>
  )
}
