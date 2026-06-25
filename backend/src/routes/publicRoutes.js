import { Router } from 'express';
import {
  createCarritoEvento,
  createWhatsappEvento,
  getBanners,
  getCategorias,
  getProductoDetalle,
  getProductos,
  getProductosByCategoria,
  getProductosDestacados,
  getProductosPromociones,
  getWhatsappConfig
} from '../controllers/publicController.js';

const router = Router();

router.get('/banners', getBanners);
router.get('/categorias', getCategorias);
router.get('/productos', getProductos);
router.get('/productos/categoria/:slug', getProductosByCategoria);
router.get('/productos/destacados', getProductosDestacados);
router.get('/productos/promociones', getProductosPromociones);
router.get('/productos/:slug', getProductoDetalle);
router.post('/carrito-evento', createCarritoEvento);
router.post('/whatsapp-evento', createWhatsappEvento);
router.get('/configuracion/whatsapp', getWhatsappConfig);

export default router;
