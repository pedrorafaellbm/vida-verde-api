import { ProductCard } from './ProductCard'

export const ProductGrid = ({
  products,
  onAddToCart,
  favoriteIds = new Set(),
  onToggleFavorite,
  emptyMessage = 'Nenhum produto encontrado.',
}) => {
  if (!products.length) {
    return <p className="empty-state">{emptyMessage}</p>
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isFavorited={favoriteIds.has(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
