import { useEffect, useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { adminList, adminPatch } from '../../services/api.js';

function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [onlyEmpty, setOnlyEmpty] = useState(false);

  async function load() {
    setProducts(await adminList('productos'));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStock(product) {
    const value = prompt('Nuevo stock', product.stock);
    if (value === null) return;
    await adminPatch('productos', product.id_producto, 'stock', { stock: Number(value) });
    await load();
  }

  const rows = onlyEmpty ? products.filter((product) => Number(product.stock) === 0) : products;

  return (
    <section className="admin-page">
      <AdminPageHeader title="Inventario" description="El stock solo se muestra en el panel administrativo." />
      <label className="admin-inline-check">
        <input type="checkbox" checked={onlyEmpty} onChange={(event) => setOnlyEmpty(event.target.checked)} />
        Ver solo productos agotados
      </label>
      <AdminTable
        rows={rows}
        getId={(row) => row.id_producto}
        onEdit={updateStock}
        columns={[
          { key: 'imagen', label: 'Imagen', type: 'image' },
          { key: 'nombre', label: 'Producto' },
          { key: 'marca', label: 'Marca' },
          { key: 'stock', label: 'Stock' },
          { key: 'estado', label: 'Estado', render: (row) => Number(row.estado) === 1 ? 'Activo' : 'Inactivo' }
        ]}
      />
    </section>
  );
}

export default AdminInventoryPage;
