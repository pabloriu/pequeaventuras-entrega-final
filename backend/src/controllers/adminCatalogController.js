import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateSlug } from '../utils/slug.js';
import { normalizeStatus, requireFields } from '../utils/validators.js';

function uploadedImagePath(req) {
  return req.file ? `/uploads/${req.file.filename}` : null;
}

export const listCategorias = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nombre ASC');
  res.json({ ok: true, data: rows });
});

export const createCategoria = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre']);

  const [result] = await pool.query(
    'INSERT INTO categorias (nombre, slug, imagen, estado) VALUES (?, ?, ?, ?)',
    [
      req.body.nombre,
      req.body.slug || generateSlug(req.body.nombre),
      uploadedImagePath(req) || req.body.imagen || null,
      normalizeStatus(req.body.estado ?? 1)
    ]
  );

  res.status(201).json({ ok: true, message: 'Categoria creada', id_categoria: result.insertId });
});

export const updateCategoria = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre']);

  const [result] = await pool.query(
    'UPDATE categorias SET nombre = ?, slug = ?, imagen = ?, estado = ? WHERE id_categoria = ?',
    [
      req.body.nombre,
      req.body.slug || generateSlug(req.body.nombre),
      uploadedImagePath(req) || req.body.imagen || null,
      normalizeStatus(req.body.estado ?? 1),
      req.params.id
    ]
  );

  if (result.affectedRows === 0) throw new AppError('Categoria no encontrada', 404);
  res.json({ ok: true, message: 'Categoria actualizada' });
});

export const deleteCategoria = asyncHandler(async (req, res) => {
  const [used] = await pool.query('SELECT 1 FROM producto_categoria WHERE id_categoria = ? LIMIT 1', [req.params.id]);
  if (used.length > 0) throw new AppError('No se puede eliminar una categoria con productos asociados', 400);

  const [result] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [req.params.id]);
  if (result.affectedRows === 0) throw new AppError('Categoria no encontrada', 404);

  res.json({ ok: true, message: 'Categoria eliminada' });
});

export const updateCategoriaEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);

  const [result] = await pool.query(
    'UPDATE categorias SET estado = ? WHERE id_categoria = ?',
    [normalizeStatus(req.body.estado), req.params.id]
  );

  if (result.affectedRows === 0) throw new AppError('Categoria no encontrada', 404);
  res.json({ ok: true, message: 'Estado de categoria actualizado' });
});

export const listMarcas = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM marcas ORDER BY nombre ASC');
  res.json({ ok: true, data: rows });
});

export const createMarca = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre']);

  const [result] = await pool.query(
    'INSERT INTO marcas (nombre, slug, estado) VALUES (?, ?, ?)',
    [req.body.nombre, req.body.slug || generateSlug(req.body.nombre), normalizeStatus(req.body.estado ?? 1)]
  );

  res.status(201).json({ ok: true, message: 'Marca creada', id_marca: result.insertId });
});

export const updateMarca = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre']);

  const [result] = await pool.query(
    'UPDATE marcas SET nombre = ?, slug = ?, estado = ? WHERE id_marca = ?',
    [req.body.nombre, req.body.slug || generateSlug(req.body.nombre), normalizeStatus(req.body.estado ?? 1), req.params.id]
  );

  if (result.affectedRows === 0) throw new AppError('Marca no encontrada', 404);
  res.json({ ok: true, message: 'Marca actualizada' });
});

export const deleteMarca = asyncHandler(async (req, res) => {
  const [used] = await pool.query('SELECT 1 FROM productos WHERE id_marca = ? LIMIT 1', [req.params.id]);
  if (used.length > 0) throw new AppError('No se puede eliminar una marca con productos asociados', 400);

  const [result] = await pool.query('DELETE FROM marcas WHERE id_marca = ?', [req.params.id]);
  if (result.affectedRows === 0) throw new AppError('Marca no encontrada', 404);

  res.json({ ok: true, message: 'Marca eliminada' });
});

export const updateMarcaEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);

  const [result] = await pool.query(
    'UPDATE marcas SET estado = ? WHERE id_marca = ?',
    [normalizeStatus(req.body.estado), req.params.id]
  );

  if (result.affectedRows === 0) throw new AppError('Marca no encontrada', 404);
  res.json({ ok: true, message: 'Estado de marca actualizado' });
});
