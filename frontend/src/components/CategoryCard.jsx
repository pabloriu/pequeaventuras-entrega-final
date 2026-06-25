import { Link } from 'react-router-dom';
import { getImageUrl, handleImageError } from '../utils/imageUrl.js';

function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/categoria/${category.slug}`}>
      <div className="category-image-wrap">
        <img src={getImageUrl(category.imagen)} alt={category.nombre} onError={handleImageError} />
      </div>
      <span>{category.nombre}</span>
      <i aria-hidden="true" />
    </Link>
  );
}

export default CategoryCard;
