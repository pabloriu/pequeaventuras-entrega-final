import { AppError } from '../utils/AppError.js';

export function notFoundHandler(req, _res, next) {
  const message = `Ruta no encontrada: ${req.method} ${req.originalUrl}`;

  return next(new AppError(message, 404));
}

export function errorHandler(error, _req, res, _next) {
  let statusCode = error.statusCode ?? 500;
  let message = error.message;

  switch (true) {
    case error.message === 'Origen no permitido por CORS':
      statusCode = 403;
      message = 'Origen no permitido por CORS';
      break;

    case error.name === 'MulterError':
      statusCode = 400;
      message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'La imagen no debe superar 5MB'
          : 'Error al procesar la imagen';
      break;

    case error.code === 'ER_DUP_ENTRY':
      statusCode = 409;
      message = 'Ya existe un registro con datos unicos repetidos';
      break;

    case error.code === 'ER_ROW_IS_REFERENCED_2':
    case error.code === 'ER_NO_REFERENCED_ROW_2':
      statusCode = 400;
      message = 'La operacion no cumple las relaciones de la base de datos';
      break;

    case error.code === 'ER_CHECK_CONSTRAINT_VIOLATED':
      statusCode = 400;
      message = 'La operacion no cumple las restricciones de la base de datos';
      break;
  }

  const response = {
    ok: false,
    message: statusCode === 500 ? 'Error interno del servidor' : message
  };

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    response.detail = error.message;
  }

  return res.status(statusCode).json(response);
}
