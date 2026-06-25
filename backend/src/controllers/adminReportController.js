import { pool } from '../config/database.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const [[products]] = await pool.query('SELECT COUNT(*) AS total_productos FROM productos');
  const [[withoutStock]] = await pool.query('SELECT COUNT(*) AS productos_sin_stock FROM productos WHERE stock = 0');
  const [mostViewed] = await pool.query(
    `SELECT p.id_producto, p.nombre, p.imagen, COUNT(v.id_vista) AS total
     FROM productos p
     LEFT JOIN vistas_producto v ON v.id_producto = p.id_producto
     GROUP BY p.id_producto, p.nombre, p.imagen
     ORDER BY total DESC
     LIMIT 5`
  );
  const [mostAdded] = await pool.query(
    `SELECT p.id_producto, p.nombre, p.imagen, COUNT(e.id_evento) AS total
     FROM productos p
     LEFT JOIN carrito_eventos e ON e.id_producto = p.id_producto
     GROUP BY p.id_producto, p.nombre, p.imagen
     ORDER BY total DESC
     LIMIT 5`
  );
  const [mostConsulted] = await pool.query(
    `SELECT p.id_producto, p.nombre, p.imagen, COUNT(e.id_evento) AS total
     FROM productos p
     LEFT JOIN whatsapp_eventos e ON e.id_producto = p.id_producto
     GROUP BY p.id_producto, p.nombre, p.imagen
     ORDER BY total DESC
     LIMIT 5`
  );

  res.json({
    ok: true,
    data: {
      total_productos: products.total_productos,
      productos_sin_stock: withoutStock.productos_sin_stock,
      productos_mas_vistos: mostViewed,
      productos_mas_agregados_al_carrito: mostAdded,
      productos_mas_consultados_por_whatsapp: mostConsulted
    }
  });
});

export const getProductosMasVistos = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id_producto, p.nombre AS producto, p.imagen, COUNT(v.id_vista) AS cantidad_vistas
     FROM productos p
     LEFT JOIN vistas_producto v ON v.id_producto = p.id_producto
     GROUP BY p.id_producto, p.nombre, p.imagen
     ORDER BY cantidad_vistas DESC`
  );

  res.json({ ok: true, data: rows });
});

export const getProductosMasAgregados = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id_producto, p.nombre AS producto, p.imagen, COUNT(e.id_evento) AS cantidad_agregados
     FROM productos p
     LEFT JOIN carrito_eventos e ON e.id_producto = p.id_producto
     GROUP BY p.id_producto, p.nombre, p.imagen
     ORDER BY cantidad_agregados DESC`
  );

  res.json({ ok: true, data: rows });
});

export const getProductosMasConsultados = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id_producto, p.nombre AS producto, p.imagen, COUNT(e.id_evento) AS cantidad_consultas
     FROM productos p
     LEFT JOIN whatsapp_eventos e ON e.id_producto = p.id_producto
     GROUP BY p.id_producto, p.nombre, p.imagen
     ORDER BY cantidad_consultas DESC`
  );

  res.json({ ok: true, data: rows });
});
