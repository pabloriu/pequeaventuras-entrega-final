import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeStatus, parseArray, requireFields, toInt } from '../utils/validators.js';

export const listPromociones = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT
       pr.*,
       (
         SELECT GROUP_CONCAT(CONCAT(p.id_producto, ':', p.nombre) ORDER BY p.nombre SEPARATOR '|')
         FROM promocion_productos pp
         JOIN productos p ON p.id_producto = pp.id_producto
         WHERE pp.id_promocion = pr.id_promocion
       ) AS productos
     FROM promociones pr
     ORDER BY pr.creado_en DESC`
  );

  res.json({ ok: true, data: rows });
});

async function savePromotionProducts(idPromocion, productos, connection) {
  await connection.query('DELETE FROM promocion_productos WHERE id_promocion = ?', [idPromocion]);

  for (const idProducto of productos) {
    await connection.query(
      'INSERT INTO promocion_productos (id_promocion, id_producto) VALUES (?, ?)',
      [idPromocion, idProducto]
    );
  }
}

export const createPromocion = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre', 'fecha_inicio', 'fecha_fin']);

  const productos = parseArray(req.body.productos ?? req.body.productIds).map((id) => toInt(id, 'id_producto'));
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `INSERT INTO promociones (nombre, descripcion, fecha_inicio, fecha_fin, estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.body.nombre,
        req.body.descripcion || null,
        req.body.fecha_inicio,
        req.body.fecha_fin,
        normalizeStatus(req.body.estado ?? 1)
      ]
    );

    await savePromotionProducts(result.insertId, productos, connection);
    await connection.commit();
    res.status(201).json({ ok: true, message: 'Promocion creada', id_promocion: result.insertId });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

export const updatePromocion = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre', 'fecha_inicio', 'fecha_fin']);

  const productos = parseArray(req.body.productos ?? req.body.productIds).map((id) => toInt(id, 'id_producto'));
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.query(
      `UPDATE promociones
       SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?
       WHERE id_promocion = ?`,
      [
        req.body.nombre,
        req.body.descripcion || null,
        req.body.fecha_inicio,
        req.body.fecha_fin,
        normalizeStatus(req.body.estado ?? 1),
        req.params.id
      ]
    );

    if (result.affectedRows === 0) throw new AppError('Promocion no encontrada', 404);

    if (req.body.productos !== undefined || req.body.productIds !== undefined) {
      await savePromotionProducts(req.params.id, productos, connection);
    }

    await connection.commit();
    res.json({ ok: true, message: 'Promocion actualizada' });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

export const deletePromocion = asyncHandler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM promociones WHERE id_promocion = ?', [req.params.id]);
  if (result.affectedRows === 0) throw new AppError('Promocion no encontrada', 404);

  res.json({ ok: true, message: 'Promocion eliminada' });
});

export const updatePromocionEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);

  const [result] = await pool.query(
    'UPDATE promociones SET estado = ? WHERE id_promocion = ?',
    [normalizeStatus(req.body.estado), req.params.id]
  );

  if (result.affectedRows === 0) throw new AppError('Promocion no encontrada', 404);
  res.json({ ok: true, message: 'Estado de promocion actualizado' });
});
