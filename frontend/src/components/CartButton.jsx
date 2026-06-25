import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function CartButton() {
  const { count } = useCart();

  return (
    <Link className="cart-button" to="/carrito" aria-label={`Carrito con ${count} productos`}>
      <span className="cart-icon" aria-hidden="true" />
      <span>Carrito</span>
      <strong>{count}</strong>
    </Link>
  );
}

export default CartButton;
