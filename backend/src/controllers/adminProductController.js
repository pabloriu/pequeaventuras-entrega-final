import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateSlug } from '../utils/slug.js';
import { ensureNonNegative, normalizeStatus, parseArray, requireFields, toInt, toNumber } from '../utils/validators.js';
import {
  productAdminSelect,
  replaceProductCategories,
  replaceProductTags
} from '../services/productService.js';

function uploadedImagePath(req) {
  return req.file ? `/uploads/${req.file.filename}` : null;
}

function imageInput(req) {
  const filePath = uploadedImagePath(req);
  const imageUrl = req.body.imagen_url || req.body.imagen || null;

  if (filePath && imageUrl) {
    throw new AppError('Usa imagen por archivo o por URL, no ambas al mismo tiempo', 400);
  }

  if (filePath) return { imagen: filePath, imagen_tipo: 'ARCHIVO', provided: true };
  if (imageUrl) return { imagen: imageUrl, imagen_tipo: 'URL', provided: true };

  return { provided: false };
}

function normalizeProductPayload(req, isCreate = true) {
  const body = req.body;
  const image = imageInput(req);

  if (isCreate) {
    requireFields(body, ['nombre', 'id_marca', 'precio_actual', 'stock']);

    if (!image.provided) {
      throw new AppError('Debes enviar una imagen por archivo o por URL', 400);
    }
  }

  const categoryIds = parseArray(body.categorias ?? body.categoriaIds ?? body.id_categorias).map((id) =>
    toInt(id, 'id_categoria')
  );
  const tags = parseArray(body.etiquetas ?? body.tags).map((tag) => String(tag).trim()).filter(Boolean);

  if (isCreate && categoryIds.length === 0) {
    throw new AppError('Debes asignar al menos una categoria', 400);
  }

  const precioAnteriorProvided = body.precio_anterior !== undefined;

  const payload = {
    nombre: body.nombre !== undefined ? body.nombre : undefined,
    slug: body.slug !== undefined ? body.slug : body.nombre !== undefined ? generateSlug(body.nombre) : undefined,
    descripcion: body.descripcion !== undefined ? body.descripcion || null : undefined,
    id_marca: body.id_marca !== undefined ? toInt(body.id_marca, 'id_marca') : undefined,
    precio_actual:
      body.precio_actual !== undefined ? toNumber(body.precio_actual, 'precio_actual') : undefined,
    precio_anterior:
      precioAnteriorProvided && body.precio_anterior !== ''
        ? toNumber(body.precio_anterior, 'precio_anterior')
        : precioAnteriorProvided || isCreate
          ? null
          : undefined,
    stock: body.stock !== undefined ? toInt(body.stock, 'stock') : undefined,
    estado: body.estado !== undefined ? normalizeStatus(body.estado) : isCreate ? 1 : undefined,
    meta_titulo: body.meta_titulo !== undefined ? body.meta_titulo || null : undefined,
    meta_descripcion: body.meta_descripcion !== undefined ? body.meta_descripcion || null : undefined,
    image,
    categoryIds,
    tags
  };

  if (payload.precio_actual !== undefined) ensureNonNegative(payload.precio_actual, 'precio_actual');
  if (payload.precio_anterior !== null && payload.precio_anterior !== undefined) {
    ensureNonNegative(payload.precio_anterior, 'precio_anterior');
  }
  if (payload.stock !== undefined) ensureNonNegative(payload.stock, 'stock');

  return payload;
}

export const listProductos = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(`${productAdminSelect()} ORDER BY p.creado_en DESC`);
  res.json({ ok: true, data: rows });
});

export const getProducto = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${productAdminSelect('p.id_producto = ?')} LIMIT 1`, [req.params.id]);

  if (rows.length === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({ ok: true, data: rows[0] });
});

export const createProducto = asyncHandler(async (req, res) => {
  const payload = normalizeProductPayload(req, true);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO productos (
         nombre, slug, descripcion, id_marca, imagen, imagen_tipo,
         precio_actual, precio_anterior, stock, estado, meta_titulo, meta_descripcion
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.nombre,
        payload.slug,
        payload.descripcion,
        payload.id_marca,
        payload.image.imagen,
        payload.image.imagen_tipo,
        payload.precio_actual,
        payload.precio_anterior,
        payload.stock,
        payload.estado,
        payload.meta_titulo,
        payload.meta_descripcion
      ]
    );

    await replaceProductCategories(result.insertId, payload.categoryIds, connection);
    await replaceProductTags(result.insertId, payload.tags, connection);
    await connection.commit();

    res.status(201).json({ ok: true, message: 'Producto creado', id_producto: result.insertId });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

export const updateProducto = asyncHandler(async (req, res) => {
  const idProducto = toInt(req.params.id, 'id_producto');
  const body = req.body;
  const image = imageInput(req);
  const categoryIds = parseArray(body.categorias ?? body.categoriaIds ?? body.id_categorias).map((id) => toInt(id, 'id_categoria'));
  const tags = parseArray(body.etiquetas ?? body.tags).map((tag) => String(tag).trim()).filter(Boolean);

  requireFields(body, ['nombre', 'id_marca', 'precio_actual', 'stock']);
  if (categoryIds.length === 0) throw new AppError('Debes asignar al menos una categoria', 400);

  const precioActual = toNumber(body.precio_actual, 'precio_actual');
  const precioAnterior = body.precio_anterior === '' || body.precio_anterior === undefined ? null : toNumber(body.precio_anterior, 'precio_anterior');
  const stock = toInt(body.stock, 'stock');
  ensureNonNegative(precioActual, 'precio_actual');
  if (precioAnterior !== null) ensureNonNegative(precioAnterior, 'precio_anterior');
  ensureNonNegative(stock, 'stock');

  const [result] = await pool.query(
    `UPDATE productos
     SET nombre = ?, slug = ?, descripcion = ?, id_marca = ?, precio_actual = ?,
         precio_anterior = ?, stock = ?, estado = ?, meta_titulo = ?, meta_descripcion = ?
     WHERE id_producto = ?`,
    [
      body.nombre,
      body.slug || generateSlug(body.nombre),
      body.descripcion || null,
      toInt(body.id_marca, 'id_marca'),
      precioActual,
      precioAnterior,
      stock,
      normalizeStatus(body.estado ?? 1),
      body.meta_titulo || null,
      body.meta_descripcion || null,
      idProducto
    ]
  );

  if (result.affectedRows === 0) throw new AppError('Producto no encontrado', 404);

  if (image.provided) {
    await pool.query('UPDATE productos SET imagen = ?, imagen_tipo = ? WHERE id_producto = ?', [
      image.imagen,
      image.imagen_tipo,
      idProducto
    ]);
  }

  await pool.query('DELETE FROM producto_categoria WHERE id_producto = ?', [idProducto]);
  for (const idCategoria of categoryIds) {
    await pool.query('INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (?, ?)', [idProducto, idCategoria]);
  }

  await pool.query('DELETE FROM producto_etiquetas WHERE id_producto = ?', [idProducto]);
  for (const tag of tags) {
    await pool.query('INSERT INTO producto_etiquetas (id_producto, etiqueta) VALUES (?, ?)', [idProducto, tag]);
  }

  res.json({ ok: true, message: 'Producto actualizado' });
});

export const deleteProducto = asyncHandler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM productos WHERE id_producto = ?', [req.params.id]);

  if (result.affectedRows === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({ ok: true, message: 'Producto eliminado' });
});

export const updateProductoEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);
  const estado = normalizeStatus(req.body.estado);

  const [result] = await pool.query('UPDATE productos SET estado = ? WHERE id_producto = ?', [estado, req.params.id]);

  if (result.affectedRows === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({ ok: true, message: 'Estado de producto actualizado' });
});

export const updateProductoStock = asyncHandler(async (req, res) => {
  requireFields(req.body, ['stock']);
  const stock = toInt(req.body.stock, 'stock');
  ensureNonNegative(stock, 'stock');

  const [result] = await pool.query('UPDATE productos SET stock = ? WHERE id_producto = ?', [stock, req.params.id]);

  if (result.affectedRows === 0) {
    throw new AppError('Producto no encontrado', 404);
  }

  res.json({ ok: true, message: 'Stock actualizado' });
});
