import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

function AdminProtectedRoute({ principalOnly = false }) {
  const { checking, isAuthenticated, isPrincipal } = useAdminAuth();

  if (checking) {
    return <main className="admin-loading">Validando sesión...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (principalOnly && !isPrincipal) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;
