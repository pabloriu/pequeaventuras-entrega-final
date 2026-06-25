import { useEffect, useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import { adminReport } from '../../services/api.js';

function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminReport('dashboard').then(setData).catch(() => setError('No se pudo cargar el dashboard.'));
  }, []);

  return (
    <section className="admin-page">
      <AdminPageHeader title="Dashboard" description="Resumen general del comportamiento de la tienda." />
      {error && <p className="admin-error">{error}</p>}
      <div className="admin-card-grid">
        <article><span>Total productos</span><strong>{data?.total_productos ?? '-'}</strong></article>
        <article><span>Productos sin stock</span><strong>{data?.productos_sin_stock ?? '-'}</strong></article>
        <article><span>Más vistos</span><strong>{data?.productos_mas_vistos?.[0]?.nombre || '-'}</strong></article>
        <article><span>Más consultado</span><strong>{data?.productos_mas_consultados_por_whatsapp?.[0]?.nombre || '-'}</strong></article>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
