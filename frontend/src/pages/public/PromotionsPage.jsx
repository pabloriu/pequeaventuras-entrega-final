import { useEffect, useState } from 'react';
import PromotionCard from '../../components/PromotionCard.jsx';
import SectionHeader from '../../components/SectionHeader.jsx';
import { getPromotionProducts } from '../../services/api.js';

function PromotionsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPromotions() {
      try {
        const data = await getPromotionProducts();
        if (active) setProducts(data);
      } catch (_error) {
        if (active) setError('No se pudieron cargar las promociones.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPromotions();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <main className="page"><p className="status-text">Cargando promociones...</p></main>;

  return (
    <main className="page">
      <SectionHeader title="Promociones" eyebrow="Ofertas activas" />
      {error ? <p className="status-text">{error}</p> : null}
      <div className="product-grid">
        {products.map((product) => (
          <PromotionCard key={`${product.id_promocion}-${product.id_producto}`} product={product} />
        ))}
      </div>
      {products.length === 0 && !error && <p className="status-text">No hay promociones activas por ahora.</p>}
    </main>
  );
}

export default PromotionsPage;
