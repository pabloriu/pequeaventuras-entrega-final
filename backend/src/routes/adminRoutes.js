import { Router } from 'express';
import {
  createProducto,
  deleteProducto,
  getProducto,
  listProductos,
  updateProducto,
  updateProductoEstado,
  updateProductoStock
} from '../controllers/adminProductController.js';
import {
  createCategoria,
  createMarca,
  deleteCategoria,
  deleteMarca,
  listCategorias,
  listMarcas,
  updateCategoria,
  updateCategoriaEstado,
  updateMarca,
  updateMarcaEstado
} from '../controllers/adminCatalogController.js';
import {
  createPromocion,
  deletePromocion,
  listPromociones,
  updatePromocion,
  updatePromocionEstado
} from '../controllers/adminPromotionController.js';
import {
  createBanner,
  deleteBanner,
  listBanners,
  updateBanner,
  updateBannerEstado
} from '../controllers/adminBannerController.js';
import {
  getDashboard,
  getProductosMasAgregados,
  getProductosMasConsultados,
  getProductosMasVistos
} from '../controllers/adminReportController.js';
import {
  createAdministrador,
  deleteAdministrador,
  listAdministradores,
  updateAdministrador,
  updateAdministradorEstado
} from '../controllers/adminUserController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { optionalImageUpload } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/productos', listProductos);
router.post('/productos', optionalImageUpload('imagen_archivo'), createProducto);
router.get('/productos/:id', getProducto);
router.post('/productos/:id/editar', optionalImageUpload('imagen_archivo'), updateProducto);
router.put('/productos/:id', optionalImageUpload('imagen_archivo'), updateProducto);
router.patch('/productos/:id', optionalImageUpload('imagen_archivo'), updateProducto);
router.delete('/productos/:id', deleteProducto);
router.patch('/productos/:id/estado', updateProductoEstado);
router.patch('/productos/:id/stock', updateProductoStock);

router.get('/categorias', listCategorias);
router.post('/categorias', optionalImageUpload('imagen_archivo'), createCategoria);
router.put('/categorias/:id', optionalImageUpload('imagen_archivo'), updateCategoria);
router.delete('/categorias/:id', deleteCategoria);
router.patch('/categorias/:id/estado', updateCategoriaEstado);

router.get('/marcas', listMarcas);
router.post('/marcas', createMarca);
router.put('/marcas/:id', updateMarca);
router.delete('/marcas/:id', deleteMarca);
router.patch('/marcas/:id/estado', updateMarcaEstado);

router.get('/promociones', listPromociones);
router.post('/promociones', createPromocion);
router.put('/promociones/:id', updatePromocion);
router.delete('/promociones/:id', deletePromocion);
router.patch('/promociones/:id/estado', updatePromocionEstado);

router.get('/banners', listBanners);
router.post('/banners', optionalImageUpload('imagen_archivo'), createBanner);
router.put('/banners/:id', optionalImageUpload('imagen_archivo'), updateBanner);
router.delete('/banners/:id', deleteBanner);
router.patch('/banners/:id/estado', updateBannerEstado);

router.get('/reportes/dashboard', getDashboard);
router.get('/reportes/productos-mas-vistos', getProductosMasVistos);
router.get('/reportes/productos-mas-agregados', getProductosMasAgregados);
router.get('/reportes/productos-mas-consultados', getProductosMasConsultados);

router.get('/administradores', requireRole('PRINCIPAL'), listAdministradores);
router.post('/administradores', requireRole('PRINCIPAL'), createAdministrador);
router.put('/administradores/:id', requireRole('PRINCIPAL'), updateAdministrador);
router.delete('/administradores/:id', requireRole('PRINCIPAL'), deleteAdministrador);
router.patch('/administradores/:id/estado', requireRole('PRINCIPAL'), updateAdministradorEstado);

export default router;
