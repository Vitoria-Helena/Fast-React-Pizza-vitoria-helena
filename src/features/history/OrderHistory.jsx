// src/features/history/OrderHistory.jsx
//
// NOVO: tela de histórico de pedidos do usuário.
// Exibe todos os pedidos em ordem cronológica inversa (mais recente primeiro).
// Cada pedido mostra: ID, data, itens, total e status.

import { useSelector, useDispatch } from 'react-redux';
import { selectOrderHistory, clearHistory } from './historySlice';
import { formatCurrency } from '../../utils/helpers';

const STATUS_STYLES = {
  delivered: 'bg-green-100 text-green-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  pending:   'bg-stone-100 text-stone-600',
};

const STATUS_LABELS = {
  delivered: '✅ Entregue',
  preparing: '🍕 Em preparo',
  pending:   '⏳ Aguardando',
};

export default function OrderHistory() {
  const dispatch = useDispatch();
  const orders   = useSelector(selectOrderHistory);

  // ── Estado vazio ──
  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-5xl">🍕</p>
        <h2 className="mt-4 text-xl font-bold text-stone-700">
          Nenhum pedido ainda
        </h2>
        <p className="mt-2 text-stone-400">
          Seus pedidos aparecerão aqui após a confirmação.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">

      {/* ── Cabeçalho ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">
            Histórico de Pedidos
          </h2>
          <p className="text-sm text-stone-400">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} no total
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm('Deseja limpar todo o histórico?')) dispatch(clearHistory());
          }}
          className="text-sm text-stone-400 underline hover:text-red-500"
        >
          Limpar histórico
        </button>
      </div>

      {/* ── Lista de pedidos ── */}
      <ul className="space-y-4" data-testid="order-list">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            data-testid="order-item"
          >
            {/* Linha superior: ID + status */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-stone-500">
                #{order.id}
              </span>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                  STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
                }`}
              >
                {STATUS_LABELS[order.status] ?? STATUS_LABELS.pending}
              </span>
            </div>

            {/* Data e método de pagamento */}
            <p className="mt-1 text-xs text-stone-400">
              {new Date(order.createdAt).toLocaleString('pt-BR')}
              {order.paymentMethod && (
                <span className="ml-2 capitalize">· {order.paymentMethod}</span>
              )}
              {order.transactionId && (
                <span className="ml-2 font-mono">· {order.transactionId}</span>
              )}
            </p>

            {/* Itens do pedido */}
            <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3">
              {order.cart.map((item) => (
                <li
                  key={item.pizzaId}
                  className="flex justify-between text-sm text-stone-700"
                >
                  <span>
                    <span className="font-medium">{item.quantity}×</span>{' '}
                    {item.name}
                    {item.isHighPriority && (
                      <span className="ml-1 text-xs text-red-500">🔥 Prioritário</span>
                    )}
                  </span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="mt-3 flex justify-between border-t border-stone-100 pt-3">
              <span className="font-semibold text-stone-700">Total</span>
              <span className="font-bold text-stone-900">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}
