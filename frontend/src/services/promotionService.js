import { adminCreate, adminDelete, adminList, adminPatch, adminUpdate } from './api.js';

export const promotionService = {
  list: () => adminList('promociones'),
  create: (payload) => adminCreate('promociones', payload),
  update: (id, payload) => adminUpdate('promociones', id, payload),
  remove: (id) => adminDelete('promociones', id),
  toggleStatus: (id, estado) => adminPatch('promociones', id, 'estado', { estado })
};
