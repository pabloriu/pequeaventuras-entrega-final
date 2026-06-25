import { useMemo, useState } from 'react';
import CartItem from '../../components/CartItem.jsx';
import SectionHeader from '../../components/SectionHeader.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { getWhatsappNumber, registerWhatsappEvent } from '../../services/api.js';
import { buildWhatsappUrl } from '../../utils/whatsapp.js';

function CartPage() {
  const { items, removeFromCart } = useCart();
  const [selectedIds, setSelectedIds] = useState(() => items.map((item) => item.id_producto));
  const [error, setError] = useState('');

  const selectedProducts = useMemo(
    () => items.filter((item) => selectedIds.includes(item.id_producto)),
    [items, selectedIds]
  );

  function toggleProduct(productId) {
    setSelectedIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  }

  async function contactSeller() {
    setError('');

    if (selectedProducts.length === 0) {
      setError('Selecciona al menos un producto para consultar.');
      return;
    }

    try {
      await registerWhatsappEvent(selectedProducts.map((product) => product.id_producto));
    } catch (_error) {
      // La consulta por WhatsApp no debe bloquearse si falla la metrica.
    }

    const whatsappNumber = await getWhatsappNumber().catch(() => '51930700147');
    window.open(buildWhatsappUrl(whatsappNumber, selectedProducts), '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="page cart-page">
      <SectionHeader title="Carrito" eyebrow="Productos seleccionados">
        Elige qué productos quieres consultar por WhatsApp.
      </SectionHeader>

      {items.length === 0 ? (
        <p className="status-text">Tu carrito está vacío.</p>
      ) : (
        <div className="cart-list">
          {items.map((item) => (
            <CartItem
              key={item.id_producto}
              item={item}
              checked={selectedIds.includes(item.id_producto)}
              onToggle={() => toggleProduct(item.id_producto)}
              onRemove={() => removeFromCart(item.id_producto)}
            />
          ))}
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      <button className="whatsapp-button cart-contact" type="button" onClick={contactSeller} disabled={items.length === 0}>
        Contactarse con el vendedor
      </button>
    </main>
  );
}

export default CartPage;
