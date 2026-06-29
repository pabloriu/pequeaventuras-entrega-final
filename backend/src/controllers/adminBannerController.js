import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeStatus, requireFields, toInt } from '../utils/validators.js';

function uploadedImagePath(req) {
  if (req.file) {
    return `/uploads/${req.file.filename}`;
  }

  return null;
}

export const listBanners = asyncHandler(async (req, res) => {
  const sql = 'SELECT * FROM banners ORDER BY orden ASC, id_banner ASC';
  const [rows] = await pool.query(sql);

  res.json({
    ok: true,
    data: rows
  });
});

export const createBanner = asyncHandler(async (req, res) => {
  requireFields(req.body, ['titulo']);

  let imagen = uploadedImagePath(req);

  if (!imagen) {
    imagen = req.body.imagen;
  }

  if (!imagen) {
    throw new AppError('La imagen del banner es obligatoria', 400);
  }

  const sql = `
    INSERT INTO banners
    (titulo, descripcion_corta, imagen, orden, estado)
    VALUES (?, ?, ?, ?, ?)
  `;

  const datos = [
    req.body.titulo,
    req.body.descripcion_corta || null,
    imagen,
    req.body.orden !== undefined ? toInt(req.body.orden, 'orden') : 0,
    normalizeStatus(req.body.estado ?? 1)
  ];

  const [result] = await pool.query(sql, datos);

  res.status(201).json({
    ok: true,
    message: 'Banner creado',
    id_banner: result.insertId
  });
});

export const updateBanner = asyncHandler(async (req, res) => {
  requireFields(req.body, ['titulo']);

  let imagen = uploadedImagePath(req);

  if (!imagen) {
    imagen = req.body.imagen;
  }

  let sql = `
    UPDATE banners
    SET titulo = ?,
        descripcion_corta = ?,
        orden = ?,
        estado = ?
  `;

  const datos = [
    req.body.titulo,
    req.body.descripcion_corta || null,
    req.body.orden !== undefined ? toInt(req.body.orden, 'orden') : 0,
    normalizeStatus(req.body.estado ?? 1)
  ];

  if (imagen) {
    sql += ', imagen = ?';
    datos.push(imagen);
  }

  sql += ' WHERE id_banner = ?';

  datos.push(req.params.id);

  const [result] = await pool.query(sql, datos);

  if (result.affectedRows === 0) {
    throw new AppError('Banner no encontrado', 404);
  }

  res.json({
    ok: true,
    message: 'Banner actualizado'
  });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const sql = 'DELETE FROM banners WHERE id_banner = ?';

  const [result] = await pool.query(sql, [req.params.id]);

  if (result.affectedRows === 0) {
    throw new AppError('Banner no encontrado', 404);
  }

  res.json({
    ok: true,
    message: 'Banner eliminado'
  });
});

export const updateBannerEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);

  const sql = 'UPDATE banners SET estado = ? WHERE id_banner = ?';

  const [result] = await pool.query(sql, [
    normalizeStatus(req.body.estado),
    req.params.id
  ]);

  if (result.affectedRows === 0) {
    throw new AppError('Banner no encontrado', 404);
  }

  res.json({
    ok: true,
    message: 'Estado de banner actualizado'
  });
});
