import { useEffect, useState } from 'react';
import FeaturedProductCard from '../../components/FeaturedProductCard.jsx';
import SectionHeader from '../../components/SectionHeader.jsx';
import { getFeaturedProducts } from '../../services/api.js';

function FeaturedPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadFeatured() {
      try {
        const data = await getFeaturedProducts();
        if (active) setProducts(data);
      } catch (_error) {
        if (active) setError('No se pudieron cargar los destacados.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFeatured();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <main className="page"><p className="status-text">Cargando destacados...</p></main>;

  return (
    <main className="page">
      <SectionHeader title="Productos destacados" eyebrow="Más vistos" />
      {error ? <p className="status-text">{error}</p> : null}
      <div className="featured-grid">
        {products.map((product) => (
          <FeaturedProductCard key={product.id_producto} product={product} />
        ))}
      </div>
      {products.length === 0 && !error && <p className="status-text">Aún no hay productos destacados.</p>}
    </main>
  );
}

export default FeaturedPage;
