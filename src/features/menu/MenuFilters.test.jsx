// src/__tests__/MenuFilters.test.jsx

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../features/menu/menuSlice';
import MenuFilters from '../features/menu/MenuFilters';

function renderFilters() {
  const store = configureStore({ reducer: { menu: menuReducer } });
  render(
    <Provider store={store}>
      <MenuFilters />
    </Provider>
  );
  return store;
}

describe('MenuFilters', () => {
  beforeEach(() => {
    // nada a limpar — sem localStorage nesta feature
  });

  it('deve renderizar o campo de busca', () => {
    renderFilters();
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('deve renderizar todos os botões de categoria', () => {
    renderFilters();
    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('🌿 Veggie')).toBeInTheDocument();
    expect(screen.getByText('🌶️ Picantes')).toBeInTheDocument();
    expect(screen.getByText('❌ Esgotadas')).toBeInTheDocument();
  });

  it('deve renderizar o select de ordenação', () => {
    renderFilters();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('deve atualizar searchQuery ao digitar', () => {
    const store = renderFilters();
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Margherita' },
    });
    expect(store.getState().menu.searchQuery).toBe('Margherita');
  });

  it('deve atualizar activeCategory ao clicar em Veggie', () => {
    const store = renderFilters();
    fireEvent.click(screen.getByText('🌿 Veggie'));
    expect(store.getState().menu.activeCategory).toBe('veggie');
  });

  it('deve atualizar activeCategory ao clicar em Picantes', () => {
    const store = renderFilters();
    fireEvent.click(screen.getByText('🌶️ Picantes'));
    expect(store.getState().menu.activeCategory).toBe('spicy');
  });

  it('deve atualizar sortBy ao mudar o select', () => {
    const store = renderFilters();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'price-asc' },
    });
    expect(store.getState().menu.sortBy).toBe('price-asc');
  });

  it('deve resetar todos os filtros ao clicar em Limpar', () => {
    const store = renderFilters();

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'algo' } });
    fireEvent.click(screen.getByText('🌿 Veggie'));
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'name' } });

    fireEvent.click(screen.getByText('Limpar'));

    const { searchQuery, activeCategory, sortBy } = store.getState().menu;
    expect(searchQuery).toBe('');
    expect(activeCategory).toBe('all');
    expect(sortBy).toBe('default');
  });
});
