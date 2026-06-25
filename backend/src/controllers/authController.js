import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireFields } from '../utils/validators.js';

function sanitizeAdmin(admin) {
  return {
    id_admin: admin.id_admin,
    nombre_completo: admin.nombre_completo,
    correo: admin.correo,
    usuario: admin.usuario,
    rol: admin.rol,
    estado: admin.estado
  };
}

export const login = asyncHandler(async (req, res) => {
  requireFields(req.body, ['usuario', 'password']);

  const [rows] = await pool.query(
    `SELECT id_admin, nombre_completo, correo, usuario, password_hash, rol, estado
     FROM administradores
     WHERE usuario = ? OR correo = ?
     LIMIT 1`,
    [req.body.usuario, req.body.usuario]
  );

  if (rows.length === 0 || rows[0].estado !== 1) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const admin = rows[0];
  const isValid = await bcrypt.compare(req.body.password, admin.password_hash);

  if (!isValid) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const token = jwt.sign(
    { id_admin: admin.id_admin, rol: admin.rol },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  res.json({
    ok: true,
    token,
    admin: sanitizeAdmin(admin)
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ ok: true, admin: req.admin });
});
