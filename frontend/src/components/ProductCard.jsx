import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { getImageUrl, handleImageError } from '../utils/imageUrl.js';

function ProductCard({ product, showOffer = true }) {
  const { addToCart } = useCart();
  const hasOffer = showOffer && product.precio_anterior && Number(product.precio_anterior) > Number(product.precio_actual);

  return (
    <article className="product-card">
      <Link to={`/producto/${product.slug}`} className="product-image-link">
        <img src={getImageUrl(product.imagen)} alt={product.nombre} onError={handleImageError} />
        {hasOffer && <span className="offer-badge">OFERTA</span>}
      </Link>
      <div className="product-card-body">
        <p className="product-brand">{product.marca}</p>
        <h3>
          <Link to={`/producto/${product.slug}`}>{product.nombre}</Link>
        </h3>
        <p className="product-categories">{product.categorias}</p>
        <div className="price-row">
          {hasOffer && <span className="old-price">{formatCurrency(product.precio_anterior)}</span>}
          <strong>{formatCurrency(product.precio_actual)}</strong>
        </div>
        <button className="primary-button" type="button" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
