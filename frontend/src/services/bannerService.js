import { adminCreate, adminDelete, adminList, adminPatch, adminUpdate } from './api.js';

export const bannerService = {
  list: () => adminList('banners'),
  create: (payload) => adminCreate('banners', payload, true),
  update: (id, payload) => adminUpdate('banners', id, payload, true),
  remove: (id) => adminDelete('banners', id),
  toggleStatus: (id, estado) => adminPatch('banners', id, 'estado', { estado })
};
