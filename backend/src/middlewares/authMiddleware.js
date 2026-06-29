import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/database.js';
import { apperror } from '../utils/apperror.js';
import { asynchandler } from '../utils/asynchandler.js';

export const authenticate = asynchandler(async (req, _res, next) => {
  const authorization = req.headers.authorization ?? '';
  const parts = authorization.split(' ');
  const scheme = parts[0];
  const token = parts[1];

  if (!(scheme === 'Bearer' && token)) {
    throw new apperror('Token de autenticacion requerido', 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new apperror('Token invalido o expirado', 401);
  }

  const query = `
    SELECT id_admin, nombre_completo, correo, usuario, rol, estado
    FROM administradores
    WHERE id_admin = ? AND estado = 1
  `;

  const [rows] = await pool.query(query, [payload.id_admin]);

  if (!rows.length) {
    throw new apperror('Administrador no autorizado', 401);
  }

  req.admin = rows[0];

  return next();
});
