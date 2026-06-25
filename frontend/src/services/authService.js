import { adminLogin, adminMe } from './api.js';

const TOKEN_KEY = 'pequeaventuras_admin_token';
const ADMIN_KEY = 'pequeaventuras_admin_user';

export async function login(credentials) {
  const response = await adminLogin(credentials);
  localStorage.setItem(TOKEN_KEY, response.token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(response.admin));
  return response;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const value = localStorage.getItem(ADMIN_KEY);
  return value ? JSON.parse(value) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export async function refreshCurrentUser() {
  const admin = await adminMe();
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
  return admin;
}
