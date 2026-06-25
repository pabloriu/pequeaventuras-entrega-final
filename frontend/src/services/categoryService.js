import { adminCreate, adminDelete, adminList, adminPatch, adminUpdate } from './api.js';

export const categoryService = {
  list: () => adminList('categorias'),
  create: (payload) => adminCreate('categorias', payload, true),
  update: (id, payload) => adminUpdate('categorias', id, payload, true),
  remove: (id) => adminDelete('categorias', id),
  toggleStatus: (id, estado) => adminPatch('categorias', id, 'estado', { estado })
};
