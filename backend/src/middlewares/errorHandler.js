import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, _res, next) {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  if (error.message === 'Origen no permitido por CORS') {
    statusCode = 403;
    message = 'Origen no permitido por CORS';
  }

  if (error.name === 'MulterError') {
    statusCode = 400;
    message = error.code === 'LIMIT_FILE_SIZE' ? 'La imagen no debe superar 5MB' : 'Error al procesar la imagen';
  }

  if (error.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'Ya existe un registro con datos unicos repetidos';
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'La operacion no cumple las relaciones de la base de datos';
  }

  if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
    statusCode = 400;
    message = 'La operacion no cumple las restricciones de la base de datos';
  }

  res.status(statusCode).json({
    ok: false,
    message: statusCode === 500 ? 'Error interno del servidor' : message,
    ...(process.env.NODE_ENV !== 'production' && statusCode === 500 ? { detail: error.message } : {})
  });
}
