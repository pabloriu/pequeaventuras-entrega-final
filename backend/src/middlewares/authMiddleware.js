import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Token de autenticacion requerido', 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new AppError('Token invalido o expirado', 401);
  }

  const [rows] = await pool.query(
    `SELECT id_admin, nombre_completo, correo, usuario, rol, estado
     FROM administradores
     WHERE id_admin = ? AND estado = 1`,
    [payload.id_admin]
  );

  if (rows.length === 0) {
    throw new AppError('Administrador no autorizado', 401);
  }

  req.admin = rows[0];
  next();
});
