export const FilterSidebar = ({
  minPrice,
  maxPrice,
  careLevel,
  sortBy,
  onMinPriceChange,
  onMaxPriceChange,
  onCareLevelChange,
  onSortByChange,
  highestPrice,
}) => {
  return (
    <aside className="filter-sidebar">
      <h3>Filtros</h3>

      <label htmlFor="min-price">Preço mínimo</label>
      <input
        id="min-price"
        type="number"
        min="0"
        value={minPrice}
        onChange={(event) => onMinPriceChange(Number(event.target.value))}
      />

      <label htmlFor="max-price">Preço máximo</label>
      <input
        id="max-price"
        type="number"
        min="0"
        max={highestPrice}
        value={maxPrice}
        onChange={(event) => onMaxPriceChange(Number(event.target.value))}
      />

      <label htmlFor="care-level">Nível de cuidado</label>
      <select
        id="care-level"
        value={careLevel}
        onChange={(event) => onCareLevelChange(event.target.value)}
      >
        <option value="Todos">Todos</option>
        <option value="Fácil">Fácil</option>
        <option value="Médio">Médio</option>
        <option value="Difícil">Difícil</option>
      </select>

      <label htmlFor="sort-price">Ordenar por preço</label>
      <select id="sort-price" value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
        <option value="asc">Menor para maior</option>
        <option value="desc">Maior para menor</option>
      </select>
    </aside>
  )
}
