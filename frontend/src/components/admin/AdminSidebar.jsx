import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

const baseItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/marcas', label: 'Marcas' },
  { to: '/admin/inventario', label: 'Inventario' },
  { to: '/admin/promociones', label: 'Promociones' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/reportes', label: 'Reportes' }
];

function AdminSidebar() {
  const { isPrincipal, logout } = useAdminAuth();
  const items = isPrincipal ? [...baseItems, { to: '/admin/administradores', label: 'Administradores' }] : baseItems;

  return (
    <aside className="admin-sidebar">
      <NavLink className="admin-logo" to="/admin/dashboard">PequeAventuras</NavLink>
      <nav>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
        ))}
      </nav>
      <button type="button" onClick={logout}>Cerrar sesión</button>
    </aside>
  );
}

export default AdminSidebar;
