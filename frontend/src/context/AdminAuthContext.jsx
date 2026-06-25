import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  getToken,
  login as authLogin,
  logout as authLogout,
  refreshCurrentUser
} from '../services/authService.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());
  const [admin, setAdmin] = useState(() => getCurrentUser());
  const [checking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const currentAdmin = await refreshCurrentUser();
        if (active) setAdmin(currentAdmin);
      } catch (_error) {
        if (active) logout();
      } finally {
        if (active) setChecking(false);
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [token]);

  async function login(credentials) {
    const response = await authLogin(credentials);
    setToken(response.token);
    setAdmin(response.admin);
    return response.admin;
  }

  function logout() {
    authLogout();
    setToken(null);
    setAdmin(null);
  }

  const value = useMemo(() => ({
    admin,
    token,
    checking,
    isAuthenticated: Boolean(token && admin),
    isPrincipal: admin?.rol === 'PRINCIPAL',
    login,
    logout
  }), [admin, token, checking]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider');
  }

  return context;
}
