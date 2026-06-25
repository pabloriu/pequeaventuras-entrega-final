import { adminCreate, adminDelete, adminList, adminPatch, adminUpdate } from './api.js';

export const brandService = {
  list: () => adminList('marcas'),
  create: (payload) => adminCreate('marcas', payload),
  update: (id, payload) => adminUpdate('marcas', id, payload),
  remove: (id) => adminDelete('marcas', id),
  toggleStatus: (id, estado) => adminPatch('marcas', id, 'estado', { estado })
};
