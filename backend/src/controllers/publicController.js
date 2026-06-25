import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseArray, toInt } from '../utils/validators.js';

const publicProductFields = `
  p.id_producto,
  p.nombre,
  p.slug,
  p.descripcion,
  p.imagen,
  p.imagen_tipo,
  p.precio_actual,
  p.precio_anterior,
  p.meta_titulo,
  p.meta_descripcion,
  m.nombre AS marca,
  (
    SELECT GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', ')
    FROM producto_categoria pc
    JOIN categorias c ON c.id_categoria = pc.id_categoria
    WHERE pc.id_producto = p.id_producto
  ) AS categorias
`;

export const getBanners = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id_banner, titulo, descripcion_corta, imagen, orden
     FROM banners
     WHERE estado = 1
     ORDER BY orden ASC, id_banner ASC`
  );

  res.json({ ok: true, data: rows });
});

export const getCategorias = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id_categoria, nombre, slug, imagen
     FROM categorias
     WHERE estado = 1
     ORDER BY nombre ASC`
  );

  res.json({ ok: true, data: rows });
});

export const getProductos = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT ${publicProductFields}
     FROM productos p
     JOIN marcas m ON m.id_marca = p.id_marca
     WHERE p.estado = 1 AND p.stock > 0
     ORDER BY p.creado_en DESC`
  );

  res.json({ ok: true, data: rows });
});

export const getProductosByCategoria = asyncHandler(async (req, res) => {
  const [categoryRows] = await pool.query(
    `SELECT id_categoria, nombre, slug, imagen
     FROM categorias
     WHERE slug = ? AND estado = 1`,
    [req.params.slug]
  );

  if (categoryRows.length === 0) {
    throw new AppError('Categoria no encontrada', 404);
  }

  const [products] = await pool.query(
    `SELECT ${publicProductFields}
     FROM productos p
     JOIN marcas m ON m.id_marca = p.id_marca
     JOIN producto_categoria pc ON pc.id_producto = p.id_producto
     WHERE p.estado = 1 AND p.stock > 0 AND pc.id_categoria = ?
     ORDER BY p.creado_en DESC`,
    [categoryRows[0].id_categoria]
  );

  res.json({ ok: true, categoria: categoryRows[0], data: products });
});

export const getProductosDestacados = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT
       p.id_producto,
       p.nombre,
       p.slug,
       p.imagen,
       (
         SELECT c.nombre
         FROM producto_categoria pc
         JOIN categorias c ON c.id_categoria = pc.id_categoria
         WHERE pc.id_producto = p.id_producto
         ORDER BY c.nombre
         LIMIT 1
       ) AS categoria,
       COUNT(v.id_vista) AS vistas
     FROM productos p
     LEFT JOIN vistas_producto v ON v.id_producto = p.id_producto
     WHERE p.estado = 1 AND p.stock > 0
     GROUP BY p.id_producto, p.nombre, p.slug, p.imagen, p.creado_en
     ORDER BY vistas DESC, p.creado_en DESC
     LIMIT 6`
  );

  res.json({
    ok: true,
    data: rows.map(({ vistas: _vistas, ...product }) => product)
  });
});

export const getProductosPromociones = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT DISTINCT
       ${publicProductFields},
       pr.id_promocion,
       pr.nombre AS promocion_nombre,
       pr.fecha_inicio,
       pr.fecha_fin
     FROM promociones pr
     JOIN promocion_productos pp ON pp.id_promocion = pr.id_promocion
     JOIN productos p ON p.id_producto = pp.id_producto
     JOIN marcas m ON m.id_marca = p.id_marca
     WHERE pr.estado = 1
       AND CURDATE() BETWEEN pr.fecha_inicio AND pr.fecha_fin
       AND p.estado = 1
       AND p.stock > 0
     ORDER BY pr.fecha_fin ASC, p.nombre ASC`
  );

  res.json({ ok: true, data: rows });
});

export const getProductoDetalle = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ${publicProductFields}
     FROM productos p
     JOIN marcas m ON m.id_marca = p.id_marca
     WHERE p.slug = ? AND p.estado = 1 AND p.stock > 0
     LIMIT 1`,
    [req.params.slug]
  );

  if (rows.length === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  await pool.query('INSERT INTO vistas_producto (id_producto) VALUES (?)', [rows[0].id_producto]);

  res.json({ ok: true, data: rows[0] });
});

export const createCarritoEvento = asyncHandler(async (req, res) => {
  const idProducto = toInt(req.body.id_producto ?? req.body.productId, 'id_producto');

  await pool.query('INSERT INTO carrito_eventos (id_producto) VALUES (?)', [idProducto]);
  res.status(201).json({ ok: true, message: 'Evento de carrito registrado' });
});

export const createWhatsappEvento = asyncHandler(async (req, res) => {
  const ids = parseArray(req.body.productos ?? req.body.productIds ?? req.body.id_producto).map((id) =>
    toInt(id, 'id_producto')
  );

  if (ids.length === 0) {
    throw new AppError('Debes enviar al menos un producto', 400);
  }

  for (const idProducto of ids) {
    await pool.query('INSERT INTO whatsapp_eventos (id_producto) VALUES (?)', [idProducto]);
  }

  res.status(201).json({ ok: true, message: 'Eventos de WhatsApp registrados' });
});

export const getWhatsappConfig = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT valor AS whatsapp_numero
     FROM configuracion
     WHERE clave = 'whatsapp_numero'
     LIMIT 1`
  );

  res.json({ ok: true, data: { whatsapp_numero: rows[0]?.whatsapp_numero || null } });
});
