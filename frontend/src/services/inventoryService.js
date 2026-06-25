import { adminList, adminPatch } from './api.js';

export const inventoryService = {
  list: () => adminList('productos'),
  updateStock: (id, stock) => adminPatch('productos', id, 'stock', { stock })
};
