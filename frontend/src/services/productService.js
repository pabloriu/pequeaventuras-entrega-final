import { adminCreate, adminDelete, adminGet, adminList, adminPatch, api } from './api.js';

export const productService = {
  list: () => adminList('productos'),
  get: (id) => adminGet('productos', id),
  create: (payload) => adminCreate('productos', payload, true),
  update: async (id, payload) => {
    const { data } = await api.post(`/admin/productos/${id}/editar`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  remove: (id) => adminDelete('productos', id),
  toggleStatus: (id, estado) => adminPatch('productos', id, 'estado', { estado }),
  updateStock: (id, stock) => adminPatch('productos', id, 'stock', { stock })
};
