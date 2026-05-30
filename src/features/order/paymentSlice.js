// src/features/order/paymentSlice.js
//
// NOVO: gerencia o fluxo de pagamento simulado.
// O thunk processPayment() simula um gateway com delay de rede
// e aprova 90% das transações (10% recusadas aleatoriamente).

import { createSlice } from '@reduxjs/toolkit';

// Status possíveis do pagamento
// 'idle'       → aguardando ação do usuário
// 'processing' → aguardando resposta do "gateway"
// 'approved'   → pagamento aprovado
// 'declined'   → pagamento recusado

const initialState = {
  status: 'idle',
  method: 'credit',       // 'credit' | 'debit' | 'pix'
  lastTransactionId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethod(state, action) {
      state.method = action.payload;
    },
    startProcessing(state) {
      state.status = 'processing';
    },
    approvePayment(state) {
      state.status = 'approved';
      state.lastTransactionId = `TXN-${Date.now()}`;
    },
    declinePayment(state) {
      state.status = 'declined';
    },
    resetPayment(state) {
      state.status = 'idle';
      state.lastTransactionId = null;
    },
  },
});

export const {
  setPaymentMethod,
  startProcessing,
  approvePayment,
  declinePayment,
  resetPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectPaymentStatus  = (state) => state.payment.status;
export const selectPaymentMethod  = (state) => state.payment.method;
export const selectTransactionId  = (state) => state.payment.lastTransactionId;

// ─── Thunk ────────────────────────────────────────────────────────────────────
// Simula chamada a um gateway de pagamento:
//   1. Despacha startProcessing (exibe spinner)
//   2. Aguarda 1.5s (simula latência de rede)
//   3. Aprova (90%) ou recusa (10%) aleatoriamente
//
// Uso no componente:
//   dispatch(processPayment(cardData))
//     .then(() => { if (status === 'approved') salvaHistorico() })
//
export function processPayment(cardData) {
  return async function (dispatch) {
    dispatch(startProcessing());

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const approved = Math.random() > 0.1; // 90% de aprovação

    if (approved) {
      dispatch(approvePayment());
    } else {
      dispatch(declinePayment());
    }
  };
}
