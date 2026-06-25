USE pequeaventuras_db;

INSERT INTO administradores (nombre_completo, correo, usuario, password_hash, rol, estado)
VALUES (
  'Administrador Principal',
  'admin@pequeaventuras.com',
  'admin',
  '$2b$10$HkEtyHdqyN5jgmsXrIboS.MZB93mY/YuKGnbM2s5etG4cAnEq.Zly',
  'PRINCIPAL',
  1
);

INSERT INTO configuracion (clave, valor, descripcion)
VALUES ('whatsapp_numero', '51930700147', 'Numero oficial de WhatsApp para consultas del cliente');

INSERT INTO marcas (nombre, slug, estado) VALUES
  ('BabySoft', 'babysoft', 1),
  ('MiniRuedas', 'miniruedas', 1),
  ('Dulce Hogar Baby', 'dulce-hogar-baby', 1),
  ('PlayKids', 'playkids', 1);

INSERT INTO categorias (nombre, slug, imagen, estado) VALUES
  ('Coches', 'coches', 'https://placehold.co/600x450/d8f3f0/12333d?text=Coches', 1),
  ('Cunas', 'cunas', 'https://placehold.co/600x450/f7efe6/12333d?text=Cunas', 1),
  ('Corrales', 'corrales', 'https://placehold.co/600x450/e8f4df/12333d?text=Corrales', 1),
  ('Triciclos', 'triciclos', 'https://placehold.co/600x450/e9f3e4/12333d?text=Triciclos', 1),
  ('Patines', 'patines', 'https://placehold.co/600x450/f1e4f6/12333d?text=Patines', 1),
  ('Juguetes', 'juguetes', 'https://placehold.co/600x450/fff0dc/12333d?text=Juguetes', 1),
  ('Comedores para bebe', 'comedores-para-bebe', 'https://placehold.co/600x450/f6eee7/12333d?text=Comedores', 1);

INSERT INTO productos (
  nombre, slug, descripcion, id_marca, imagen, imagen_tipo,
  precio_actual, precio_anterior, stock, estado, meta_titulo, meta_descripcion
) VALUES
  ('Coche plegable turquesa', 'coche-plegable-turquesa', 'Coche practico y liviano para paseos diarios.', 2, 'https://placehold.co/900x900/d8f3f0/12333d?text=Coche+Plegable', 'URL', 349.90, 399.90, 8, 1, 'Coche plegable turquesa', 'Coche para bebe liviano y practico'),
  ('Cuna blanca clasica', 'cuna-blanca-clasica', 'Cuna resistente para habitacion de bebe.', 3, 'https://placehold.co/900x900/f7efe6/12333d?text=Cuna+Blanca', 'URL', 599.90, NULL, 5, 1, 'Cuna blanca clasica', 'Cuna segura para bebe'),
  ('Corral portatil gris', 'corral-portatil-gris', 'Corral amplio para juego y descanso.', 1, 'https://placehold.co/900x900/e8f4df/12333d?text=Corral+Portatil', 'URL', 279.90, 329.90, 7, 1, 'Corral portatil gris', 'Corral para bebe practico'),
  ('Triciclo infantil verde', 'triciclo-infantil-verde', 'Triciclo estable para primeras aventuras.', 2, 'https://placehold.co/900x900/e9f3e4/12333d?text=Triciclo', 'URL', 189.90, NULL, 6, 1, 'Triciclo infantil verde', 'Triciclo para ninos'),
  ('Set de juguetes didacticos', 'set-juguetes-didacticos', 'Juguetes para estimular aprendizaje y juego.', 4, 'https://placehold.co/900x900/fff0dc/12333d?text=Juguetes', 'URL', 89.90, 119.90, 12, 1, 'Set de juguetes didacticos', 'Juguetes didacticos para ninos'),
  ('Silla comedor para bebe', 'silla-comedor-para-bebe', 'Silla comedor comoda y facil de limpiar.', 1, 'https://placehold.co/900x900/f6eee7/12333d?text=Comedor', 'URL', 229.90, NULL, 4, 1, 'Silla comedor para bebe', 'Comedor para bebe'),
  ('Patines infantiles rosados', 'patines-infantiles-rosados', 'Patines ajustables para ninos.', 4, 'https://placehold.co/900x900/f1e4f6/12333d?text=Patines', 'URL', 159.90, 199.90, 3, 1, 'Patines infantiles rosados', 'Patines para ninos');

INSERT INTO producto_categoria (id_producto, id_categoria) VALUES
  (1, 1), (2, 2), (3, 3), (4, 4), (5, 6), (6, 7), (7, 5);

INSERT INTO producto_etiquetas (id_producto, etiqueta) VALUES
  (1, 'coche bebe'), (1, 'paseo'), (2, 'cuna bebe'), (3, 'corral bebe'),
  (4, 'triciclo'), (5, 'juguetes didacticos'), (6, 'comedor bebe'), (7, 'patines infantiles');

INSERT INTO promociones (nombre, descripcion, fecha_inicio, fecha_fin, estado)
VALUES ('Promociones de temporada', 'Productos seleccionados con precio especial.', '2026-01-01', '2026-12-31', 1);

INSERT INTO promocion_productos (id_promocion, id_producto) VALUES
  (1, 1), (1, 3), (1, 5), (1, 7);

INSERT INTO banners (titulo, descripcion_corta, imagen, orden, estado) VALUES
  ('Promociones de temporada', 'Descubre productos adorables, seguros y practicos para bebes y ninos.', 'https://placehold.co/1600x620/d8f3f0/12333d?text=PequeAventuras', 1, 1),
  ('Todo para tu bebe', 'Coches, cunas, corrales y mas en un solo lugar.', 'https://placehold.co/1600x620/fff0dc/12333d?text=Todo+para+tu+bebe', 2, 1);

INSERT INTO vistas_producto (id_producto) VALUES
  (1), (1), (1), (3), (3), (5);

INSERT INTO carrito_eventos (id_producto) VALUES
  (1), (3), (5);

INSERT INTO whatsapp_eventos (id_producto) VALUES
  (1), (5);
