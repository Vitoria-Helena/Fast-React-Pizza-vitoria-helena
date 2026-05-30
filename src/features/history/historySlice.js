// src/features/history/historySlice.js
//
// NOVO: gerencia o histórico de pedidos do usuário.
// Persiste automaticamente no localStorage via setItem().
// Ao iniciar a aplicação, restaura o histórico salvo.

import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem } from '../../services/localStorageService';

const initialState = {
  orders: getItem('ORDER_HISTORY') || [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addOrderToHistory(state, action) {
      // Insere o pedido mais recente no início da lista
      state.orders.unshift(action.payload);
      setItem('ORDER_HISTORY', state.orders);
    },
    clearHistory(state) {
      state.orders = [];
      setItem('ORDER_HISTORY', []);
    },
  },
});

export const { addOrderToHistory, clearHistory } = historySlice.actions;
export default historySlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectOrderHistory = (state) => state.history.orders;
export const selectOrderById    = (id) => (state) =>
  state.history.orders.find((o) => o.id === id) ?? null;
export const selectTotalOrders  = (state) => state.history.orders.length;
