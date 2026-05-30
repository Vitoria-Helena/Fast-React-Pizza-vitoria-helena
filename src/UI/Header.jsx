import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';
import SearchOrder from '../features/order/SearchOrder';

export default function Header() {
  const dispatch        = useDispatch();
  const navigate        = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser     = useSelector(selectCurrentUser);

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-yellow-400 px-4 py-3 sm:px-6 uppercase">

      <Link to="/"
        className="text-sm font-semibold tracking-widest text-stone-700 transition hover:text-stone-900">
        🍕 Fast React Pizza Co.
      </Link>

      <SearchOrder />

      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/history"
              className="text-sm font-medium text-stone-700 transition hover:text-stone-900">
              Meus Pedidos
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-stone-600 sm:block">
                Olá, {currentUser?.name?.split(' ')[0]}!
              </span>
              <button onClick={handleLogout}
                className="rounded-full bg-stone-700 px-3 py-1 text-xs font-semibold text-white transition hover:bg-stone-900">
                Sair
              </button>
            </div>
          </>
        ) : (
          <Link to="/login"
            className="text-sm font-medium text-stone-700 transition hover:text-stone-900">
            Entrar
          </Link>
        )}
      </nav>

    </header>
  );
}
