// src/features/cart/cartSlice.js
//
// MODIFICADO: adicionada persistência automática no localStorage.
// Toda ação que altera o carrinho salva o estado atualizado via setItem().
// Ao iniciar a aplicação, o carrinho é restaurado via loadCartFromStorage().

import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem } from '../../services/localStorageService';

function loadCartFromStorage() {
  return getItem('CART') || [];
}

const initialState = {
  cart: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const existing = state.cart.find(
        (item) => item.pizzaId === action.payload.pizzaId,
      );

      if (!existing) {
        state.cart.push(action.payload);
      } else {
        existing.quantity++;
        existing.totalPrice = existing.quantity * existing.unitPrice;
      }

      setItem('CART', state.cart);
    },

    deleteItem(state, action) {
      state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
      setItem('CART', state.cart);
    },

    increaseItemQuantity(state, action) {
      const item = state.cart.find((i) => i.pizzaId === action.payload);
      if (!item) return;

      item.quantity++;
      item.totalPrice = item.quantity * item.unitPrice;
      setItem('CART', state.cart);
    },

    decreaseItemQuantity(state, action) {
      const item = state.cart.find((i) => i.pizzaId === action.payload);
      if (!item) return;

      item.quantity--;
      item.totalPrice = item.quantity * item.unitPrice;

      // Remove automaticamente se chegar a 0
      if (item.quantity === 0) {
        state.cart = state.cart.filter((i) => i.pizzaId !== action.payload);
      }

      setItem('CART', state.cart);
    },

    clearCart(state) {
      state.cart = [];
      setItem('CART', []);
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const getCart = (state) => state.cart.cart;

export const getTotalCartQuantity = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state) =>
  state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById = (id) => (state) =>
  state.cart.cart.find((item) => item.pizzaId === id)?.quantity ?? 0;
