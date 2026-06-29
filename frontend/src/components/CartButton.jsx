import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function CartButton() {
  const cart = useCart();
  const count = cart.count;

  const label = `Carrito con ${count} productos`;

  return (
    <Link
      to="/carrito"
      className="cart-button"
      aria-label={label}
    >
      <span
        className="cart-icon"
        aria-hidden="true"
      ></span>

      <span>Carrito</span>

      <strong>
        {count}
      </strong>
    </Link>
  );
}

export default CartButton;
