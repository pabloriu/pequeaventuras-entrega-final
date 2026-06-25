import { pool } from '../config/database.js';

export async function getProductCategories(idProducto, connection = pool) {
  const [rows] = await connection.query(
    `SELECT c.id_categoria, c.nombre, c.slug
     FROM producto_categoria pc
     JOIN categorias c ON c.id_categoria = pc.id_categoria
     WHERE pc.id_producto = ?
     ORDER BY c.nombre`,
    [idProducto]
  );

  return rows;
}

export async function getProductTags(idProducto, connection = pool) {
  const [rows] = await connection.query(
    `SELECT id_etiqueta, etiqueta
     FROM producto_etiquetas
     WHERE id_producto = ?
     ORDER BY etiqueta`,
    [idProducto]
  );

  return rows;
}

export async function replaceProductCategories(idProducto, categoryIds, connection) {
  await connection.query('DELETE FROM producto_categoria WHERE id_producto = ?', [idProducto]);

  for (const idCategoria of categoryIds) {
    await connection.query(
      'INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (?, ?)',
      [idProducto, idCategoria]
    );
  }
}

export async function replaceProductTags(idProducto, tags, connection) {
  await connection.query('DELETE FROM producto_etiquetas WHERE id_producto = ?', [idProducto]);

  for (const tag of tags) {
    await connection.query(
      'INSERT INTO producto_etiquetas (id_producto, etiqueta) VALUES (?, ?)',
      [idProducto, tag]
    );
  }
}

export function productAdminSelect(whereClause = '1 = 1') {
  return `
    SELECT
      p.*,
      m.nombre AS marca,
      (
        SELECT GROUP_CONCAT(CONCAT(c.id_categoria, ':', c.nombre, ':', c.slug) ORDER BY c.nombre SEPARATOR '|')
        FROM producto_categoria pc
        JOIN categorias c ON c.id_categoria = pc.id_categoria
        WHERE pc.id_producto = p.id_producto
      ) AS categorias,
      (
        SELECT GROUP_CONCAT(pe.etiqueta ORDER BY pe.etiqueta SEPARATOR '|')
        FROM producto_etiquetas pe
        WHERE pe.id_producto = p.id_producto
      ) AS etiquetas
    FROM productos p
    JOIN marcas m ON m.id_marca = p.id_marca
    WHERE ${whereClause}
  `;
}
