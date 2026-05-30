import { configureStore } from '@reduxjs/toolkit';

import authReducer    from './features/auth/authSlice';
import cartReducer    from './features/cart/cartSlice';
import menuReducer    from './features/menu/menuSlice';
import paymentReducer from './features/order/paymentSlice';
import historyReducer from './features/history/historySlice';
import userReducer    from './features/user/userSlice';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    cart:    cartReducer,
    menu:    menuReducer,
    payment: paymentReducer,
    history: historyReducer,
    user:    userReducer,
  },
});

export default store;