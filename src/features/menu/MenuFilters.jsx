// src/features/menu/MenuFilters.jsx

import { useDispatch, useSelector } from 'react-redux';
import {
  selectSearchQuery,
  selectActiveCategory,
  selectSortBy,
  setSearchQuery,
  setActiveCategory,
  setSortBy,
  resetFilters,
} from './menuSlice';

const CATEGORIES = [
  { id: 'all',     label: 'Todas' },
  { id: 'veggie',  label: '🌿 Veggie' },
  { id: 'spicy',   label: '🌶️ Picantes' },
  { id: 'soldOut', label: '❌ Esgotadas' },
];

export default function MenuFilters() {
  const dispatch       = useDispatch();
  const searchQuery    = useSelector(selectSearchQuery);
  const activeCategory = useSelector(selectActiveCategory);
  const sortBy         = useSelector(selectSortBy);

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between">

      {/* ── Busca ── */}
      <input
        type="text"
        placeholder="Buscar pizza..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="input w-full sm:w-56"
        data-testid="search-input"
      />

      {/* ── Categorias ── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setActiveCategory(cat.id))}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-yellow-400 text-stone-800'
                : 'bg-white text-stone-600 hover:bg-yellow-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Ordenação ── */}
      <select
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
        className="input"
      >
        <option value="default">Ordenar: Padrão</option>
        <option value="price-asc">Preço ↑</option>
        <option value="price-desc">Preço ↓</option>
        <option value="name">Nome A–Z</option>
      </select>

      {/* ── Limpar filtros ── */}
      <button
        onClick={() => dispatch(resetFilters())}
        className="text-sm text-stone-500 underline hover:text-stone-700"
      >
        Limpar
      </button>

    </div>
  );
}
