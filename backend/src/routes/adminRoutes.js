import { Router } from 'express';

import {
  listProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  updateProductoEstado,
  updateProductoStock
} from '../controllers/adminProductController.js';

import {
  listCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  updateCategoriaEstado,
  listMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
  updateMarcaEstado
} from '../controllers/adminCatalogController.js';

import {
  listPromociones,
  createPromocion,
  updatePromocion,
  deletePromocion,
  updatePromocionEstado
} from '../controllers/adminPromotionController.js';

import {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerEstado
} from '../controllers/adminBannerController.js';

import {
  getDashboard,
  getProductosMasVistos,
  getProductosMasAgregados,
  getProductosMasConsultados
} from '../controllers/adminReportController.js';

import {
  listAdministradores,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
  updateAdministradorEstado
} from '../controllers/adminUserController.js';

import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { optionalImageUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(authenticate);

router
  .route('/productos')
  .get(listProductos)
  .post(optionalImageUpload('imagen_archivo'), createProducto);

router.get('/productos/:id', getProducto);

router.post(
  '/productos/:id/editar',
  optionalImageUpload('imagen_archivo'),
  updateProducto
);

router
  .route('/productos/:id')
  .put(optionalImageUpload('imagen_archivo'), updateProducto)
  .patch(optionalImageUpload('imagen_archivo'), updateProducto)
  .delete(deleteProducto);

router.patch('/productos/:id/estado', updateProductoEstado);
router.patch('/productos/:id/stock', updateProductoStock);

router
  .route('/categorias')
  .get(listCategorias)
  .post(optionalImageUpload('imagen_archivo'), createCategoria);

router
  .route('/categorias/:id')
  .put(optionalImageUpload('imagen_archivo'), updateCategoria)
  .delete(deleteCategoria);

router.patch('/categorias/:id/estado', updateCategoriaEstado);

router
  .route('/marcas')
  .get(listMarcas)
  .post(createMarca);

router
  .route('/marcas/:id')
  .put(updateMarca)
  .delete(deleteMarca);

router.patch('/marcas/:id/estado', updateMarcaEstado);

router
  .route('/promociones')
  .get(listPromociones)
  .post(createPromocion);

router
  .route('/promociones/:id')
  .put(updatePromocion)
  .delete(deletePromocion);

router.patch('/promociones/:id/estado', updatePromocionEstado);

router
  .route('/banners')
  .get(listBanners)
  .post(optionalImageUpload('imagen_archivo'), createBanner);

router
  .route('/banners/:id')
  .put(optionalImageUpload('imagen_archivo'), updateBanner)
  .delete(deleteBanner);

router.patch('/banners/:id/estado', updateBannerEstado);

router.get('/reportes/dashboard', getDashboard);
router.get('/reportes/productos-mas-vistos', getProductosMasVistos);
router.get('/reportes/productos-mas-agregados', getProductosMasAgregados);
router.get('/reportes/productos-mas-consultados', getProductosMasConsultados);

router
  .route('/administradores')
  .get(requireRole('PRINCIPAL'), listAdministradores)
  .post(requireRole('PRINCIPAL'), createAdministrador);

router
  .route('/administradores/:id')
  .put(requireRole('PRINCIPAL'), updateAdministrador)
  .delete(requireRole('PRINCIPAL'), deleteAdministrador);

router.patch(
  '/administradores/:id/estado',
  requireRole('PRINCIPAL'),
  updateAdministradorEstado
);

export default router;
