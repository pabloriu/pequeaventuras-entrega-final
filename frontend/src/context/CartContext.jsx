import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadCart, saveCart } from '../services/LocalStorageCartService.js';
import { registerCartEvent } from '../services/api.js';

const CartContext = createContext(null);

function toCartItem(product) {
  return {
    id_producto: product.id_producto,
    nombre: product.nombre,
    slug: product.slug,
    imagen: product.imagen,
    categoria: product.categoria || product.categorias || ''
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  async function addToCart(product) {
    const item = toCartItem(product);

    setItems((current) => {
      if (current.some((existing) => existing.id_producto === item.id_producto)) {
        return current;
      }

      return [...current, item];
    });

    try {
      await registerCartEvent(item.id_producto);
    } catch (_error) {
      // El carrito debe seguir funcionando aunque falle la metrica.
    }
  }

  function removeFromCart(productId) {
    setItems((current) => current.filter((item) => item.id_producto !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addToCart,
      removeFromCart,
      clearCart
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
}
