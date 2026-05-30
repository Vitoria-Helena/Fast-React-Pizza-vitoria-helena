// src/features/auth/ProtectedRoute.jsx

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from './authSlice';

/**
 * Envolve qualquer rota que exija autenticação.
 * Se o usuário não estiver logado, redireciona para /login.
 *
 * Uso no App.jsx:
 *   <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
