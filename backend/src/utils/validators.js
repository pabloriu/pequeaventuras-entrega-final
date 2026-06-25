import { AppError } from './AppError.js';

export function requireFields(data, fields) {
  const missing = fields.filter((field) => data[field] === undefined || data[field] === null || data[field] === '');

  if (missing.length > 0) {
    throw new AppError(`Campos obligatorios faltantes: ${missing.join(', ')}`, 400);
  }
}

export function toInt(value, fieldName) {
  const number = Number(value);

  if (!Number.isInteger(number)) {
    throw new AppError(`${fieldName} debe ser un numero entero`, 400);
  }

  return number;
}

export function toNumber(value, fieldName) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    throw new AppError(`${fieldName} debe ser numerico`, 400);
  }

  return number;
}

export function parseArray(value) {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch (_error) {
        throw new AppError('Formato de arreglo invalido', 400);
      }
    }

    return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [value];
}

export function ensureNonNegative(value, fieldName) {
  if (Number(value) < 0) {
    throw new AppError(`${fieldName} debe ser mayor o igual a 0`, 400);
  }
}

export function normalizeStatus(value = 1) {
  const status = Number(value);

  if (![0, 1].includes(status)) {
    throw new AppError('estado debe ser 0 o 1', 400);
  }

  return status;
}
