import { adminCreate, adminDelete, adminList, adminPatch, adminUpdate } from './api.js';

export const adminService = {
  list: () => adminList('administradores'),
  create: (payload) => adminCreate('administradores', payload),
  update: (id, payload) => adminUpdate('administradores', id, payload),
  remove: (id) => adminDelete('administradores', id),
  toggleStatus: (id, estado) => adminPatch('administradores', id, 'estado', { estado })
};
