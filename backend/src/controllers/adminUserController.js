import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizeStatus, requireFields } from '../utils/validators.js';

function validateRole(rol) {
  if (!['PRINCIPAL', 'SECUNDARIO'].includes(rol)) {
    throw new AppError('rol debe ser PRINCIPAL o SECUNDARIO', 400);
  }

  return rol;
}

async function ensureNotLastActivePrincipal(idAdmin) {
  const [rows] = await pool.query(
    `SELECT id_admin
     FROM administradores
     WHERE rol = 'PRINCIPAL' AND estado = 1`
  );

  const activePrincipalIds = rows.map((row) => Number(row.id_admin));

  if (activePrincipalIds.length === 1 && activePrincipalIds[0] === Number(idAdmin)) {
    throw new AppError('No se puede eliminar o desactivar al ultimo administrador principal activo', 400);
  }
}

export const listAdministradores = asyncHandler(async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT id_admin, nombre_completo, correo, usuario, rol, estado, creado_en, actualizado_en
     FROM administradores
     ORDER BY creado_en DESC`
  );

  res.json({ ok: true, data: rows });
});

export const createAdministrador = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre_completo', 'correo', 'usuario', 'password', 'rol']);

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const [result] = await pool.query(
    `INSERT INTO administradores (nombre_completo, correo, usuario, password_hash, rol, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      req.body.nombre_completo,
      req.body.correo,
      req.body.usuario,
      passwordHash,
      validateRole(req.body.rol),
      normalizeStatus(req.body.estado ?? 1)
    ]
  );

  res.status(201).json({ ok: true, message: 'Administrador creado', id_admin: result.insertId });
});

export const updateAdministrador = asyncHandler(async (req, res) => {
  requireFields(req.body, ['nombre_completo', 'correo', 'usuario', 'rol']);

  const [currentRows] = await pool.query('SELECT rol, estado FROM administradores WHERE id_admin = ?', [req.params.id]);
  if (currentRows.length === 0) throw new AppError('Administrador no encontrado', 404);

  const nextStatus = normalizeStatus(req.body.estado ?? currentRows[0].estado);
  const nextRole = validateRole(req.body.rol);

  if (currentRows[0].rol === 'PRINCIPAL' && currentRows[0].estado === 1 && (nextStatus === 0 || nextRole !== 'PRINCIPAL')) {
    await ensureNotLastActivePrincipal(req.params.id);
  }

  const fields = ['nombre_completo = ?', 'correo = ?', 'usuario = ?', 'rol = ?', 'estado = ?'];
  const values = [req.body.nombre_completo, req.body.correo, req.body.usuario, nextRole, nextStatus];

  if (req.body.password) {
    fields.push('password_hash = ?');
    values.push(await bcrypt.hash(req.body.password, 10));
  }

  values.push(req.params.id);
  await pool.query(`UPDATE administradores SET ${fields.join(', ')} WHERE id_admin = ?`, values);

  res.json({ ok: true, message: 'Administrador actualizado' });
});

export const deleteAdministrador = asyncHandler(async (req, res) => {
  const [currentRows] = await pool.query('SELECT rol, estado FROM administradores WHERE id_admin = ?', [req.params.id]);
  if (currentRows.length === 0) throw new AppError('Administrador no encontrado', 404);

  if (currentRows[0].rol === 'PRINCIPAL' && currentRows[0].estado === 1) {
    await ensureNotLastActivePrincipal(req.params.id);
  }

  await pool.query('DELETE FROM administradores WHERE id_admin = ?', [req.params.id]);
  res.json({ ok: true, message: 'Administrador eliminado' });
});

export const updateAdministradorEstado = asyncHandler(async (req, res) => {
  requireFields(req.body, ['estado']);

  const [currentRows] = await pool.query('SELECT rol, estado FROM administradores WHERE id_admin = ?', [req.params.id]);
  if (currentRows.length === 0) throw new AppError('Administrador no encontrado', 404);

  const estado = normalizeStatus(req.body.estado);
  if (currentRows[0].rol === 'PRINCIPAL' && currentRows[0].estado === 1 && estado === 0) {
    await ensureNotLastActivePrincipal(req.params.id);
  }

  await pool.query('UPDATE administradores SET estado = ? WHERE id_admin = ?', [estado, req.params.id]);
  res.json({ ok: true, message: 'Estado de administrador actualizado' });
});
