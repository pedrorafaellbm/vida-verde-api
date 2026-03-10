import { useI18n } from '../context/LocaleContext'

export const FilterSidebar = ({ minPrice, maxPrice, selectedCategory, sortBy, onMinPriceChange, onMaxPriceChange, onCategoryChange, onSortByChange, highestPrice, categories = [] }) => {
  const { t } = useI18n()

  return (
    <aside className="filter-sidebar">
      <h3>{t('filters.title')}</h3>
      <label htmlFor="min-price">{t('filters.minPrice')}</label>
      <input id="min-price" type="number" min="0" value={minPrice} onChange={(event) => onMinPriceChange(Number(event.target.value))} />
      <label htmlFor="max-price">{t('filters.maxPrice')}</label>
      <input id="max-price" type="number" min="0" max={highestPrice} value={maxPrice} onChange={(event) => onMaxPriceChange(Number(event.target.value))} />
      <label htmlFor="category">{t('filters.category')}</label>
      <select id="category" value={selectedCategory} onChange={(event) => onCategoryChange(event.target.value)}>
        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <label htmlFor="sort-price">{t('filters.sortPrice')}</label>
      <select id="sort-price" value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
        <option value="asc">{t('filters.asc')}</option>
        <option value="desc">{t('filters.desc')}</option>
      </select>
    </aside>
  )
}
