import { adminReport } from './api.js';

export const reportService = {
  dashboard: () => adminReport('dashboard'),
  mostViewed: () => adminReport('productos-mas-vistos'),
  mostAdded: () => adminReport('productos-mas-agregados'),
  mostConsulted: () => adminReport('productos-mas-consultados')
};
