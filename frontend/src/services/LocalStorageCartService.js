const CART_KEY = 'pequeaventuras_cart';

export function loadCart() {
  try {
    const value = localStorage.getItem(CART_KEY);
    return value ? JSON.parse(value) : [];
  } catch (_error) {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
