import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

function AdminTopbar() {
  const { admin } = useAdminAuth();

  return (
    <header className="admin-topbar">
      <div>
        <strong>{admin?.nombre_completo}</strong>
        <span>{admin?.rol}</span>
      </div>
      <a href="/" target="_blank" rel="noreferrer">Ver tienda</a>
    </header>
  );
}

export default AdminTopbar;
