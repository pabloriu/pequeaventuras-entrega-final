import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeStatus, requireFields, toInt } from '../utils/validators.js';

function uploadedImagePath(req) {
  return req.file ? `/uploads/${req.file.filename}` : null;
}

export const listBanners = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM banners ORDER BY orden ASC, id_banner ASC');
  res.json({ ok: true, data: rows });
});

export const createBanner = asyncHandler(async (req, res) => {
  requireFields(req.body, ['titulo']);
  const imagen = uploadedImagePath(req) || req.body.imagen;

  if (!imagen) throw new AppError('La imagen del banner es obligatoria', 400);

  const [result] = await pool.query(
    `INSERT INTO banners (titulo, descripcion_corta, imagen, orden, estado)
     VALUES (?, ?, ?, ?, ?)`,
    [
      req.body.titulo,
      req.body.descripcion_corta || null,
      imagen,
      req.body.orden !== undefined ? toInt(req.body.orden, 'orden') : 0,
      normalizeStatus(req.body.estado ?? 1)
    ]
  );

  res.status(201).json({ ok: true, message: 'Banner creado', id_banner: result.insertId });
});

export const updateBanner = asyncHandler(async (req, res) => {
  requireFields(req.body, ['titulo']);

  const fields = [
    'titulo = ?',
    'descripcion_corta = ?',
    'orden = ?',
    'estado = ?'
  ];
  const values = [
    req.body.titulo,
    req.body.descripcion_corta || null,
    req.body.orden !== undefined ? toInt(req.body.orden, 'orden') : 0,
    normalizeStatus(req.body.estado ?? 1)
  ];

  const imagen = uploadedImagePath(req) || req.body.imagen;
  if (imagen) {
    fields.push('imagen = ?');
    values.push(imagen);
  }

  values.push(req.params.id);
  const [result] = await pool.query(`UPDATE banners SET ${fields.join(', ')} WHERE id_banner = ?`, values);

  if (result.affectedRows === 0) throw new AppError('Banner no encontrado', 404);
  res.json({ ok: true, message: 'Banner actualizado' });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM banners WHERE id_banner = ?', [req.params.id]);
  if (result.affectedRows === 0) throw new AppError('Banner no encontrado', 404);

  res.json({ ok: true, message: 'Banner eliminado' });
});

export const updateBannerEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);

  const [result] = await pool.query(
    'UPDATE banners SET estado = ? WHERE id_banner = ?',
    [normalizeStatus(req.body.estado), req.params.id]
  );

  if (result.affectedRows === 0) throw new AppError('Banner no encontrado', 404);
  res.json({ ok: true, message: 'Estado de banner actualizado' });
});
