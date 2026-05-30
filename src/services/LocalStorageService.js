const KEYS = {
  USERS:         'frp_users',
  CURRENT_USER:  'frp_current_user',
  CART:          'frp_cart',
  ORDER_HISTORY: 'frp_order_history',
};

export function getItem(key) {
  try {
    const raw = localStorage.getItem(KEYS[key] ?? key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(KEYS[key] ?? key, JSON.stringify(value));
  } catch (err) {
    console.error('localStorage error:', err);
  }
}

export function removeItem(key) {
  localStorage.removeItem(KEYS[key] ?? key);
}

export { KEYS };