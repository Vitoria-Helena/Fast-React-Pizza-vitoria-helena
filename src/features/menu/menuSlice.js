// src/features/menu/menuSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  activeCategory: 'all',  // 'all' | 'veggie' | 'spicy' | 'soldOut'
  sortBy: 'default',      // 'default' | 'price-asc' | 'price-desc' | 'name'
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.activeCategory = 'all';
      state.sortBy = 'default';
    },
  },
});

export const { setSearchQuery, setActiveCategory, setSortBy, resetFilters } =
  menuSlice.actions;

export default menuSlice.reducer;

// ─── Selectors simples ────────────────────────────────────────────────────────
export const selectSearchQuery    = (state) => state.menu.searchQuery;
export const selectActiveCategory = (state) => state.menu.activeCategory;
export const selectSortBy         = (state) => state.menu.sortBy;

// ─── Selector derivado ────────────────────────────────────────────────────────
// Recebe a lista de pizzas vinda do loader do React Router e aplica
// os filtros e ordenação do estado Redux.
//
// Uso no componente:
//   const pizzas = useLoaderData();  // lista original da API
//   const filtered = useSelector(selectFilteredMenu(pizzas));
//
export function selectFilteredMenu(pizzaList) {
  return function (state) {
    const { searchQuery, activeCategory, sortBy } = state.menu;

    let result = [...pizzaList];

    // 1) Busca por nome (case-insensitive)
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 2) Filtro por categoria
    if (activeCategory === 'veggie')  result = result.filter((p) => p.vegetarian);
    if (activeCategory === 'spicy')   result = result.filter((p) => p.spicy);
    if (activeCategory === 'soldOut') result = result.filter((p) => p.soldOut);

    // 3) Ordenação
    if (sortBy === 'price-asc')  result.sort((a, b) => a.unitPrice - b.unitPrice);
    if (sortBy === 'price-desc') result.sort((a, b) => b.unitPrice - a.unitPrice);
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  };
}
