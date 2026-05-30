import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout      from './ui/AppLayout';
import Home           from './ui/Home';
import Error          from './ui/Error';
import Menu,          { loader as menuLoader }        from './features/menu/Menu';
import Cart           from './features/cart/Cart';
import CreateOrder,   { action as createOrderAction } from './features/order/CreateOrder';
import Order,         { loader as orderLoader }        from './features/order/Order';

import LoginForm      from './features/auth/LoginForm';
import RegisterForm   from './features/auth/RegisterForm';
import ProtectedRoute from './features/auth/ProtectedRoute';
import OrderHistory   from './features/history/OrderHistory';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [

      // ── Rotas públicas ──
      { path: '/',         element: <Home /> },
      { path: '/login',    element: <LoginForm /> },
      { path: '/register', element: <RegisterForm /> },

      // ── Rotas protegidas ──
      {
        path: '/menu',
        element: <ProtectedRoute><Menu /></ProtectedRoute>,
        loader: menuLoader,
      },
      {
        path: '/cart',
        element: <ProtectedRoute><Cart /></ProtectedRoute>,
      },
      {
        path: '/order/new',
        element: <ProtectedRoute><CreateOrder /></ProtectedRoute>,
        action: createOrderAction,
      },
      {
        path: '/order/:orderId',
        element: <ProtectedRoute><Order /></ProtectedRoute>,
        loader: orderLoader,
      },
      {
        path: '/history',
        element: <ProtectedRoute><OrderHistory /></ProtectedRoute>,
      },

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}