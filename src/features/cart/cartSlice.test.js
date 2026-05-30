// src/__tests__/cartSlice.test.js

import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  getCart,
  getTotalCartQuantity,
  getTotalCartPrice,
  getCurrentQuantityById,
} from '../features/cart/cartSlice';

const pizza1 = {
  pizzaId: 1,
  name: 'Margherita',
  quantity: 1,
  unitPrice: 20,
  totalPrice: 20,
};

const pizza2 = {
  pizzaId: 2,
  name: 'Pepperoni',
  quantity: 2,
  unitPrice: 30,
  totalPrice: 60,
};

function makeStore(cartItems = []) {
  return configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { cart: cartItems } },
  });
}

describe('cartSlice', () => {
  beforeEach(() => localStorage.clear());

  // ─── addItem ──────────────────────────────────────────────────
  describe('addItem', () => {
    it('deve adicionar um item novo ao carrinho', () => {
      const store = makeStore();
      store.dispatch(addItem(pizza1));
      expect(getCart(store.getState())).toHaveLength(1);
      expect(getCart(store.getState())[0].name).toBe('Margherita');
    });

    it('deve incrementar a quantidade se o item já existir', () => {
      const store = makeStore([{ ...pizza1 }]);
      store.dispatch(addItem(pizza1));
      const item = getCart(store.getState())[0];
      expect(item.quantity).toBe(2);
      expect(item.totalPrice).toBe(40);
    });

    it('deve persistir o carrinho no localStorage', () => {
      const store = makeStore();
      store.dispatch(addItem(pizza1));
      const saved = JSON.parse(localStorage.getItem('frp_cart'));
      expect(saved).toHaveLength(1);
      expect(saved[0].name).toBe('Margherita');
    });
  });

  // ─── deleteItem ───────────────────────────────────────────────
  describe('deleteItem', () => {
    it('deve remover o item correto do carrinho', () => {
      const store = makeStore([{ ...pizza1 }, { ...pizza2 }]);
      store.dispatch(deleteItem(1));
      expect(getCart(store.getState())).toHaveLength(1);
      expect(getCart(store.getState())[0].pizzaId).toBe(2);
    });

    it('deve atualizar o localStorage após remoção', () => {
      const store = makeStore([{ ...pizza1 }]);
      store.dispatch(deleteItem(1));
      const saved = JSON.parse(localStorage.getItem('frp_cart'));
      expect(saved).toHaveLength(0);
    });
  });

  // ─── increaseItemQuantity ─────────────────────────────────────
  describe('increaseItemQuantity', () => {
    it('deve incrementar a quantidade e recalcular o totalPrice', () => {
      const store = makeStore([{ ...pizza1 }]);
      store.dispatch(increaseItemQuantity(1));
      const item = getCart(store.getState())[0];
      expect(item.quantity).toBe(2);
      expect(item.totalPrice).toBe(40);
    });

    it('não deve alterar nada para pizzaId inexistente', () => {
      const store = makeStore([{ ...pizza1 }]);
      store.dispatch(increaseItemQuantity(999));
      expect(getCart(store.getState())[0].quantity).toBe(1);
    });
  });

  // ─── decreaseItemQuantity ─────────────────────────────────────
  describe('decreaseItemQuantity', () => {
    it('deve decrementar a quantidade e recalcular o totalPrice', () => {
      const store = makeStore([{ ...pizza2 }]); // quantity: 2
      store.dispatch(decreaseItemQuantity(2));
      const item = getCart(store.getState())[0];
      expect(item.quantity).toBe(1);
      expect(item.totalPrice).toBe(30);
    });

    it('deve remover o item quando a quantidade chegar a 0', () => {
      const store = makeStore([{ ...pizza1 }]); // quantity: 1
      store.dispatch(decreaseItemQuantity(1));
      expect(getCart(store.getState())).toHaveLength(0);
    });
  });

  // ─── clearCart ────────────────────────────────────────────────
  describe('clearCart', () => {
    it('deve esvaziar o carrinho', () => {
      const store = makeStore([{ ...pizza1 }, { ...pizza2 }]);
      store.dispatch(clearCart());
      expect(getCart(store.getState())).toHaveLength(0);
    });

    it('deve limpar o localStorage ao esvaziar', () => {
      const store = makeStore([{ ...pizza1 }]);
      store.dispatch(clearCart());
      const saved = JSON.parse(localStorage.getItem('frp_cart'));
      expect(saved).toHaveLength(0);
    });
  });

  // ─── Selectors ────────────────────────────────────────────────
  describe('selectors', () => {
    it('getTotalCartQuantity soma todas as quantidades', () => {
      const store = makeStore([{ ...pizza1 }, { ...pizza2 }]);
      expect(getTotalCartQuantity(store.getState())).toBe(3); // 1 + 2
    });

    it('getTotalCartPrice soma todos os totalPrice', () => {
      const store = makeStore([{ ...pizza1 }, { ...pizza2 }]);
      expect(getTotalCartPrice(store.getState())).toBe(80); // 20 + 60
    });

    it('getCurrentQuantityById retorna a quantidade do item correto', () => {
      const store = makeStore([{ ...pizza2 }]);
      expect(getCurrentQuantityById(2)(store.getState())).toBe(2);
    });

    it('getCurrentQuantityById retorna 0 para item não encontrado', () => {
      const store = makeStore([]);
      expect(getCurrentQuantityById(99)(store.getState())).toBe(0);
    });

    it('carrinho vazio retorna quantidade e preço 0', () => {
      const store = makeStore();
      expect(getTotalCartQuantity(store.getState())).toBe(0);
      expect(getTotalCartPrice(store.getState())).toBe(0);
    });
  });

  // ─── Persistência ─────────────────────────────────────────────
  describe('persistência no localStorage', () => {
    it('deve restaurar o carrinho do localStorage ao iniciar', () => {
      // Simula carrinho salvo de uma sessão anterior
      localStorage.setItem('frp_cart', JSON.stringify([pizza1]));

      const store = configureStore({ reducer: { cart: cartReducer } });
      expect(getCart(store.getState())).toHaveLength(1);
      expect(getCart(store.getState())[0].name).toBe('Margherita');
    });
  });
});
