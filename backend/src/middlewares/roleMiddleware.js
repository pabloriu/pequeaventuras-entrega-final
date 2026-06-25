import { AppError } from '../utils/AppError.js';

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.rol)) {
      next(new AppError('No tienes permisos para acceder a este recurso', 403));
      return;
    }

    next();
  };
}
