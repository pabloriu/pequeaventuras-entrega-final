import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { getImageUrl, handleImageError } from '../../utils/imageUrl.js';
import { getProductDetail } from '../../services/api.js';

function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoading(true);
      setError('');

      try {
        const data = await getProductDetail(slug);
        if (active) setProduct(data);
      } catch (_error) {
        if (active) setError('No se pudo cargar el producto.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <main className="page"><p className="status-text">Cargando producto...</p></main>;
  if (error || !product) return <main className="page"><p className="status-text">{error || 'Producto no encontrado.'}</p></main>;

  const hasOffer = product.precio_anterior && Number(product.precio_anterior) > Number(product.precio_actual);

  return (
    <main className="page product-detail">
      <div className="detail-media">
        <img src={getImageUrl(product.imagen)} alt={product.nombre} onError={handleImageError} />
        {hasOffer && <span className="offer-badge">OFERTA</span>}
      </div>
      <section className="detail-copy">
        <p className="product-brand">{product.marca}</p>
        <h1>{product.nombre}</h1>
        <p className="detail-categories">{product.categorias}</p>
        <p>{product.descripcion}</p>
        <div className="price-row detail-price">
          {hasOffer && <span className="old-price">{formatCurrency(product.precio_anterior)}</span>}
          <strong>{formatCurrency(product.precio_actual)}</strong>
        </div>
        <button className="primary-button" type="button" onClick={() => addToCart(product)}>
          Agregar al carrito
        </button>
        <Link className="text-link" to="/carrito">
          Ver carrito
        </Link>
      </section>
    </main>
  );
}

export default ProductDetailPage;
