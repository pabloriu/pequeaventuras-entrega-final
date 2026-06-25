import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pequeaventuras_admin_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pequeaventuras_admin_token');
      localStorage.removeItem('pequeaventuras_admin_user');
    }

    return Promise.reject(error);
  }
);

export async function getBanners() {
  const { data } = await api.get('/public/banners');
  return data.data;
}

export async function getCategories() {
  const { data } = await api.get('/public/categorias');
  return data.data;
}

export async function getProducts() {
  const { data } = await api.get('/public/productos');
  return data.data;
}

export async function getProductsByCategory(slug) {
  const { data } = await api.get(`/public/productos/categoria/${slug}`);
  return data;
}

export async function getFeaturedProducts() {
  const { data } = await api.get('/public/productos/destacados');
  return data.data;
}

export async function getPromotionProducts() {
  const { data } = await api.get('/public/productos/promociones');
  return data.data;
}

export async function getProductDetail(slug) {
  const { data } = await api.get(`/public/productos/${slug}`);
  return data.data;
}

export async function registerCartEvent(productId) {
  await api.post('/public/carrito-evento', { id_producto: productId });
}

export async function registerWhatsappEvent(productIds) {
  await api.post('/public/whatsapp-evento', { productos: productIds });
}

export async function getWhatsappNumber() {
  const { data } = await api.get('/public/configuracion/whatsapp');
  return data.data?.whatsapp_numero || '51930700147';
}

export async function adminLogin(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

export async function adminMe() {
  const { data } = await api.get('/auth/me');
  return data.admin;
}

export async function adminList(resource) {
  const { data } = await api.get(`/admin/${resource}`);
  return data.data;
}

export async function adminGet(resource, id) {
  const { data } = await api.get(`/admin/${resource}/${id}`);
  return data.data;
}

export async function adminCreate(resource, payload, isFormData = false) {
  const { data } = await api.post(`/admin/${resource}`, payload, isFormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : undefined);
  return data;
}

export async function adminUpdate(resource, id, payload, isFormData = false) {
  const { data } = await api.put(`/admin/${resource}/${id}`, payload, isFormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : undefined);
  return data;
}

export async function adminDelete(resource, id) {
  const { data } = await api.delete(`/admin/${resource}/${id}`);
  return data;
}

export async function adminPatch(resource, id, action, payload) {
  const { data } = await api.patch(`/admin/${resource}/${id}/${action}`, payload);
  return data;
}

export async function adminReport(path) {
  const { data } = await api.get(`/admin/reportes/${path}`);
  return data.data;
}
