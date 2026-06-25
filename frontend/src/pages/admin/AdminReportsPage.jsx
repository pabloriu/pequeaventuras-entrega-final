import { useEffect, useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { adminReport } from '../../services/api.js';

function AdminReportsPage() {
  const [viewed, setViewed] = useState([]);
  const [added, setAdded] = useState([]);
  const [consulted, setConsulted] = useState([]);

  useEffect(() => {
    Promise.all([
      adminReport('productos-mas-vistos'),
      adminReport('productos-mas-agregados'),
      adminReport('productos-mas-consultados')
    ]).then(([viewedRows, addedRows, consultedRows]) => {
      setViewed(viewedRows);
      setAdded(addedRows);
      setConsulted(consultedRows);
    });
  }, []);

  return (
    <section className="admin-page">
      <AdminPageHeader title="Reportes" description="Métricas de vistas, carrito y consultas por WhatsApp. No son ventas ni pedidos." />
      <h2>Productos más vistos</h2>
      <AdminTable rows={viewed} getId={(row) => row.id_producto} columns={[
        { key: 'imagen', label: 'Imagen', type: 'image' },
        { key: 'producto', label: 'Producto' },
        { key: 'cantidad_vistas', label: 'Vistas' }
      ]} />
      <h2>Más agregados al carrito</h2>
      <AdminTable rows={added} getId={(row) => row.id_producto} columns={[
        { key: 'imagen', label: 'Imagen', type: 'image' },
        { key: 'producto', label: 'Producto' },
        { key: 'cantidad_agregados', label: 'Agregados' }
      ]} />
      <h2>Más consultados por WhatsApp</h2>
      <AdminTable rows={consulted} getId={(row) => row.id_producto} columns={[
        { key: 'imagen', label: 'Imagen', type: 'image' },
        { key: 'producto', label: 'Producto' },
        { key: 'cantidad_consultas', label: 'Consultas' }
      ]} />
    </section>
  );
}

export default AdminReportsPage;
