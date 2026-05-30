// src/__tests__/paymentSlice.test.js

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import paymentReducer, {
  setPaymentMethod,
  startProcessing,
  approvePayment,
  declinePayment,
  resetPayment,
  processPayment,
  selectPaymentStatus,
  selectPaymentMethod,
  selectTransactionId,
} from '../features/order/paymentSlice';

function makeStore() {
  return configureStore({ reducer: { payment: paymentReducer } });
}

describe('paymentSlice — reducers', () => {
  it('estado inicial correto', () => {
    const store = makeStore();
    expect(selectPaymentStatus(store.getState())).toBe('idle');
    expect(selectPaymentMethod(store.getState())).toBe('credit');
    expect(selectTransactionId(store.getState())).toBeNull();
  });

  it('setPaymentMethod atualiza o método', () => {
    const store = makeStore();
    store.dispatch(setPaymentMethod('pix'));
    expect(selectPaymentMethod(store.getState())).toBe('pix');
  });

  it('startProcessing muda status para processing', () => {
    const store = makeStore();
    store.dispatch(startProcessing());
    expect(selectPaymentStatus(store.getState())).toBe('processing');
  });

  it('approvePayment muda status para approved e gera transactionId', () => {
    const store = makeStore();
    store.dispatch(approvePayment());
    expect(selectPaymentStatus(store.getState())).toBe('approved');
    expect(selectTransactionId(store.getState())).toMatch(/^TXN-\d+$/);
  });

  it('declinePayment muda status para declined', () => {
    const store = makeStore();
    store.dispatch(declinePayment());
    expect(selectPaymentStatus(store.getState())).toBe('declined');
  });

  it('resetPayment volta ao estado idle e limpa transactionId', () => {
    const store = makeStore();
    store.dispatch(approvePayment());
    store.dispatch(resetPayment());
    expect(selectPaymentStatus(store.getState())).toBe('idle');
    expect(selectTransactionId(store.getState())).toBeNull();
  });
});

describe('paymentSlice — thunk processPayment', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('deve despachar startProcessing e approvePayment quando aprovado', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // 0.5 > 0.1 → aprovado
    vi.useFakeTimers();

    const store = makeStore();
    const promise = store.dispatch(processPayment({ number: '1234' }));

    // Avança o timer de 1500ms
    await vi.runAllTimersAsync();
    await promise;

    expect(selectPaymentStatus(store.getState())).toBe('approved');
    expect(selectTransactionId(store.getState())).toMatch(/^TXN-/);

    vi.useRealTimers();
  });

  it('deve despachar startProcessing e declinePayment quando recusado', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05); // 0.05 < 0.1 → recusado
    vi.useFakeTimers();

    const store = makeStore();
    const promise = store.dispatch(processPayment({ number: '1234' }));

    await vi.runAllTimersAsync();
    await promise;

    expect(selectPaymentStatus(store.getState())).toBe('declined');

    vi.useRealTimers();
  });

  it('deve passar por processing antes de resolver', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.useFakeTimers();

    const store = makeStore();
    store.dispatch(processPayment({ number: '1234' }));

    // Antes de avançar o timer, status deve ser processing
    expect(selectPaymentStatus(store.getState())).toBe('processing');

    await vi.runAllTimersAsync();
    vi.useRealTimers();
  });
});
