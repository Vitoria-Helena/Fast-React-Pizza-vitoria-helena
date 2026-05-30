import { createSlice } from '@reduxjs/toolkit';
import { getItem, setItem, removeItem } from '../../services/localStorageService';
import { updateName } from '../user/userSlice';

const initialState = {
  currentUser: getItem('CURRENT_USER') || null,
  isAuthenticated: !!getItem('CURRENT_USER'),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    _setUser(state, action) {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    _setError(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      removeItem('CURRENT_USER');
    },
    clearError(state) {
      state.error = null;
    },
  },
});

const { _setUser, _setError } = authSlice.actions;
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

export function register({ name, email, password }) {
  return function (dispatch) {
    const users = getItem('USERS') || [];

    if (users.find((u) => u.email === email)) {
      dispatch(_setError('E-mail já cadastrado.'));
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      name, email, password,
      createdAt: new Date().toISOString(),
    };

    setItem('USERS', [...users, newUser]);

    const { password: _, ...safeUser } = newUser;
    setItem('CURRENT_USER', safeUser);
    dispatch(_setUser(safeUser));
    dispatch(updateName(safeUser.name));
  };
}

export function login({ email, password }) {
  return function (dispatch) {
    const users = getItem('USERS') || [];
    const user  = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      dispatch(_setError('E-mail ou senha inválidos.'));
      return;
    }

    const { password: _, ...safeUser } = user;
    setItem('CURRENT_USER', safeUser);
    dispatch(_setUser(safeUser));
    dispatch(updateName(safeUser.name));
  };
}

export const selectCurrentUser     = (state) => state.auth.currentUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError       = (state) => state.auth.error;