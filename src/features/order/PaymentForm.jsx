// src/features/order/PaymentForm.jsx
//
// NOVO: formulário de pagamento simulado com 3 métodos:
//   Crédito, Débito → formulário de cartão
//   PIX             → QR code simulado
//
// Após aprovação, chama a prop onSuccess(transactionId)
// para que o componente pai salve o pedido no histórico.

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  processPayment,
  resetPayment,
  setPaymentMethod,
  selectPaymentStatus,
  selectPaymentMethod,
  selectTransactionId,
} from './paymentSlice';

export default function PaymentForm({ totalPrice, onSuccess }) {
  const dispatch       = useDispatch();
  const status         = useSelector(selectPaymentStatus);
  const method         = useSelector(selectPaymentMethod);
  const transactionId  = useSelector(selectTransactionId);

  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  function handleCardChange(e) {
    setCard((c) => ({ ...c, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await dispatch(processPayment(card));
  }

  // Chama onSuccess quando o status mudar para approved
  // (useEffect garante que só dispara uma vez)
  // Feito via prop para manter o slice desacoplado do historySlice
  if (status === 'approved' && transactionId) {
    return (
      <div
        data-testid="payment-approved"
        className="rounded-xl bg-green-50 p-8 text-center"
      >
        <p className="text-5xl">✅</p>
        <h3 className="mt-3 text-xl font-bold text-green-700">
          Pagamento Aprovado!
        </h3>
        <p className="mt-1 font-mono text-sm text-stone-400">
          ID: {transactionId}
        </p>
        <button
          onClick={() => onSuccess?.(transactionId)}
          className="btn mt-6 w-full"
        >
          Confirmar Pedido →
        </button>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div
        data-testid="payment-declined"
        className="rounded-xl bg-red-50 p-8 text-center"
      >
        <p className="text-5xl">❌</p>
        <h3 className="mt-3 text-xl font-bold text-red-700">
          Pagamento Recusado
        </h3>
        <p className="mt-1 text-sm text-stone-500">
          Verifique os dados e tente novamente.
        </p>
        <button
          onClick={() => dispatch(resetPayment())}
          className="btn mt-6 w-full"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-1 text-lg font-bold">Pagamento</h3>
      {totalPrice && (
        <p className="mb-4 text-sm text-stone-500">
          Total:{' '}
          <span className="font-semibold text-stone-800">
            R$ {totalPrice.toFixed(2)}
          </span>
        </p>
      )}

      {/* ── Seleção de método ── */}
      <div className="mb-5 flex gap-2">
        {[
          { id: 'credit', label: '💳 Crédito' },
          { id: 'debit',  label: '🏦 Débito'  },
          { id: 'pix',    label: '📱 PIX'     },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => dispatch(setPaymentMethod(m.id))}
            className={`flex-1 rounded-lg border py-2 text-sm font-medium transition ${
              method === m.id
                ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                : 'border-stone-200 text-stone-500 hover:border-yellow-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Formulário de cartão ── */}
      {method !== 'pix' ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="number"
            placeholder="Número do cartão"
            value={card.number}
            onChange={handleCardChange}
            maxLength={19}
            required
            className="input w-full"
            data-testid="card-number"
          />
          <input
            name="name"
            placeholder="Nome impresso no cartão"
            value={card.name}
            onChange={handleCardChange}
            required
            className="input w-full"
            data-testid="card-name"
          />
          <div className="flex gap-3">
            <input
              name="expiry"
              placeholder="MM/AA"
              value={card.expiry}
              onChange={handleCardChange}
              maxLength={5}
              required
              className="input w-1/2"
              data-testid="card-expiry"
            />
            <input
              name="cvv"
              placeholder="CVV"
              value={card.cvv}
              onChange={handleCardChange}
              maxLength={3}
              required
              className="input w-1/2"
              data-testid="card-cvv"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'processing'}
            className="btn w-full disabled:opacity-70"
            data-testid="pay-button"
          >
            {status === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-800 border-t-transparent" />
                Processando...
              </span>
            ) : (
              'Pagar agora'
            )}
          </button>
        </form>
      ) : (
        /* ── PIX ── */
        <div className="rounded-lg bg-stone-50 p-5 text-center">
          {/* QR Code simulado com SVG */}
          <div className="mx-auto mb-3 flex h-32 w-32 items-center justify-center rounded-lg bg-white shadow-inner">
            <svg viewBox="0 0 100 100" className="h-24 w-24">
              {/* Padrão visual simples representando um QR code */}
              {[0,1,2,3,4,5,6].map((row) =>
                [0,1,2,3,4,5,6].map((col) => (
                  (row < 3 || row > 4 || col < 3 || col > 4) && Math.random() > 0.4 ? (
                    <rect
                      key={`${row}-${col}`}
                      x={col * 14 + 1}
                      y={row * 14 + 1}
                      width={12}
                      height={12}
                      fill="#1c1917"
                    />
                  ) : null
                ))
              )}
            </svg>
          </div>
          <p className="font-mono text-xs text-stone-500">
            00020126580014br.gov.bcb.pix0136
          </p>
          <p className="mt-2 text-sm text-stone-400">
            QR Code simulado — clique em Confirmar para prosseguir
          </p>
          <button
            onClick={handleSubmit}
            disabled={status === 'processing'}
            className="btn mt-4 w-full"
            data-testid="pay-button"
          >
            {status === 'processing' ? 'Processando...' : 'Confirmar PIX'}
          </button>
        </div>
      )}
    </div>
  );
}
