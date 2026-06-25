import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(form);
      navigate('/admin/dashboard', { replace: true });
    } catch (_error) {
      setError('Usuario o contraseña inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>PequeAventuras</h1>
        <p>Panel administrativo</p>
        <label>
          Usuario o correo
          <input value={form.usuario} onChange={(event) => setForm({ ...form, usuario: event.target.value })} required />
        </label>
        <label>
          Contraseña
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </label>
        {error && <span className="admin-error">{error}</span>}
        <button className="admin-primary" type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}

export default AdminLoginPage;
