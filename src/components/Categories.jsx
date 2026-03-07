export const Categories = ({ categories = ['Todas'], selected = 'Todas', onChange }) => {
  return (
    <div className="categories-bar" role="tablist" aria-label="Categorias de produtos">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-chip ${selected === category ? 'active' : ''}`}
          onClick={() => onChange?.(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
