import { Link } from 'react-router-dom';
import { productCategoryText } from '../utils/formatters.js';
import { getImageUrl, handleImageError } from '../utils/imageUrl.js';

function FeaturedProductCard({ product }) {
  return (
    <Link className="featured-card" to={`/producto/${product.slug}`}>
      <img src={getImageUrl(product.imagen)} alt={product.nombre} onError={handleImageError} />
      <div>
        <h3>{product.nombre}</h3>
        <p>{productCategoryText(product)}</p>
      </div>
    </Link>
  );
}

export default FeaturedProductCard;
