import ProductSelector from './ProductSelector.jsx';
import { getImageUrl, handleImageError } from '../utils/imageUrl.js';

function CartItem({ item, checked, onToggle, onRemove }) {
  return (
    <article className="cart-item">
      <ProductSelector checked={checked} onChange={onToggle} label={`Seleccionar ${item.nombre}`} />
      <img src={getImageUrl(item.imagen)} alt={item.nombre} onError={handleImageError} />
      <div>
        <h3>{item.nombre}</h3>
        <p>{item.categoria}</p>
      </div>
      <button className="secondary-button" type="button" onClick={onRemove}>
        Eliminar
      </button>
    </article>
  );
}

export default CartItem;
