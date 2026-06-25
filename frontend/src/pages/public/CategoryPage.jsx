import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard.jsx';
import SectionHeader from '../../components/SectionHeader.jsx';
import { getProductsByCategory } from '../../services/api.js';

function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCategory() {
      setLoading(true);
      setError('');

      try {
        const response = await getProductsByCategory(slug);
        if (active) {
          setCategory(response.categoria);
          setProducts(response.data);
        }
      } catch (_error) {
        if (active) setError('No se pudo cargar la categoría.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCategory();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <main className="page"><p className="status-text">Cargando categoría...</p></main>;
  if (error) return <main className="page"><p className="status-text">{error}</p></main>;

  return (
    <main className="page">
      <SectionHeader title={category?.nombre || 'Categoría'} eyebrow="Categoría" />
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id_producto} product={product} />
        ))}
      </div>
      {products.length === 0 && <p className="status-text">No hay productos disponibles en esta categoría.</p>}
    </main>
  );
}

export default CategoryPage;
