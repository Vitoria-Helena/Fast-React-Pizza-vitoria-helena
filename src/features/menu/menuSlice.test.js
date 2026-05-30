// src/__tests__/menuSlice.test.js

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import menuReducer, {
  setSearchQuery,
  setActiveCategory,
  setSortBy,
  resetFilters,
  selectSearchQuery,
  selectActiveCategory,
  selectSortBy,
  selectFilteredMenu,
} from '../features/menu/menuSlice';

// Lista mock — espelha a estrutura real da API do Jonas
const pizzas = [
  { id: 1, name: 'Margherita',    unitPrice: 20, vegetarian: true,  spicy: false, soldOut: false },
  { id: 2, name: 'Pepperoni',     unitPrice: 30, vegetarian: false, spicy: true,  soldOut: false },
  { id: 3, name: 'Quatro Queijos',unitPrice: 25, vegetarian: true,  spicy: false, soldOut: true  },
  { id: 4, name: 'Frango Picante',unitPrice: 18, vegetarian: false, spicy: true,  soldOut: false },
];

function makeStore(preloaded = {}) {
  return configureStore({
    reducer: { menu: menuReducer },
    preloadedState: preloaded,
  });
}

// ─── Reducers ─────────────────────────────────────────────────────────────────
describe('menuSlice — reducers', () => {
  it('estado inicial correto', () => {
    const store = makeStore();
    expect(store.getState().menu).toEqual({
      searchQuery: '',
      activeCategory: 'all',
      sortBy: 'default',
    });
  });

  it('setSearchQuery atualiza a busca', () => {
    const store = makeStore();
    store.dispatch(setSearchQuery('marg'));
    expect(selectSearchQuery(store.getState())).toBe('marg');
  });

  it('setActiveCategory atualiza a categoria', () => {
    const store = makeStore();
    store.dispatch(setActiveCategory('veggie'));
    expect(selectActiveCategory(store.getState())).toBe('veggie');
  });

  it('setSortBy atualiza a ordenação', () => {
    const store = makeStore();
    store.dispatch(setSortBy('price-asc'));
    expect(selectSortBy(store.getState())).toBe('price-asc');
  });

  it('resetFilters volta ao estado inicial', () => {
    const store = makeStore();
    store.dispatch(setSearchQuery('algo'));
    store.dispatch(setActiveCategory('spicy'));
    store.dispatch(setSortBy('name'));
    store.dispatch(resetFilters());

    const { searchQuery, activeCategory, sortBy } = store.getState().menu;
    expect(searchQuery).toBe('');
    expect(activeCategory).toBe('all');
    expect(sortBy).toBe('default');
  });
});

// ─── selectFilteredMenu ───────────────────────────────────────────────────────
describe('menuSlice — selectFilteredMenu', () => {
  function stateWith(partial) {
    return { menu: { searchQuery: '', activeCategory: 'all', sortBy: 'default', ...partial } };
  }

  it('sem filtros retorna todas as pizzas', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({}));
    expect(result).toHaveLength(4);
  });

  it('busca por nome filtra corretamente (case-insensitive)', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ searchQuery: 'marg' }));
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Margherita');
  });

  it('busca sem resultado retorna array vazio', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ searchQuery: 'abacaxi' }));
    expect(result).toHaveLength(0);
  });

  it('categoria veggie filtra apenas vegetarianas', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ activeCategory: 'veggie' }));
    expect(result.every((p) => p.vegetarian)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('categoria spicy filtra apenas picantes', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ activeCategory: 'spicy' }));
    expect(result.every((p) => p.spicy)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it('categoria soldOut filtra apenas esgotadas', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ activeCategory: 'soldOut' }));
    expect(result.every((p) => p.soldOut)).toBe(true);
    expect(result).toHaveLength(1);
  });

  it('ordenação price-asc ordena do mais barato ao mais caro', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ sortBy: 'price-asc' }));
    expect(result[0].unitPrice).toBe(18);
    expect(result.at(-1).unitPrice).toBe(30);
  });

  it('ordenação price-desc ordena do mais caro ao mais barato', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ sortBy: 'price-desc' }));
    expect(result[0].unitPrice).toBe(30);
    expect(result.at(-1).unitPrice).toBe(18);
  });

  it('ordenação name ordena alfabeticamente', () => {
    const result = selectFilteredMenu(pizzas)(stateWith({ sortBy: 'name' }));
    const names = result.map((p) => p.name);
    expect(names).toEqual([...names].sort());
  });

  it('busca + categoria funcionam juntas', () => {
    // Busca "picante" + filtra spicy
    const result = selectFilteredMenu(pizzas)(
      stateWith({ searchQuery: 'frango', activeCategory: 'spicy' })
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Frango Picante');
  });
});
