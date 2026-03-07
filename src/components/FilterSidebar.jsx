export const FilterSidebar = ({
  minPrice,
  maxPrice,
  selectedCategory,
  sortBy,
  onMinPriceChange,
  onMaxPriceChange,
  onCategoryChange,
  onSortByChange,
  highestPrice,
  categories = [],
}) => {
  return (
    <aside className="filter-sidebar">
      <h3>Filtros</h3>

      <label htmlFor="min-price">Preco minimo</label>
      <input
        id="min-price"
        type="number"
        min="0"
        value={minPrice}
        onChange={(event) => onMinPriceChange(Number(event.target.value))}
      />

      <label htmlFor="max-price">Preco maximo</label>
      <input
        id="max-price"
        type="number"
        min="0"
        max={highestPrice}
        value={maxPrice}
        onChange={(event) => onMaxPriceChange(Number(event.target.value))}
      />

      <label htmlFor="category">Categoria</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <label htmlFor="sort-price">Ordenar por preco</label>
      <select id="sort-price" value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
        <option value="asc">Menor para maior</option>
        <option value="desc">Maior para menor</option>
      </select>
    </aside>
  )
}
