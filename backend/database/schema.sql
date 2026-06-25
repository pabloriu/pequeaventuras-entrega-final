CREATE DATABASE IF NOT EXISTS pequeaventuras_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pequeaventuras_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS whatsapp_eventos;
DROP TABLE IF EXISTS carrito_eventos;
DROP TABLE IF EXISTS vistas_producto;
DROP TABLE IF EXISTS promocion_productos;
DROP TABLE IF EXISTS promociones;
DROP TABLE IF EXISTS producto_etiquetas;
DROP TABLE IF EXISTS producto_categoria;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS marcas;
DROP TABLE IF EXISTS configuracion;
DROP TABLE IF EXISTS administradores;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE administradores (
  id_admin INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL,
  usuario VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('PRINCIPAL', 'SECUNDARIO') NOT NULL DEFAULT 'SECUNDARIO',
  estado TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_administradores_correo (correo),
  UNIQUE KEY uq_administradores_usuario (usuario),
  CONSTRAINT chk_administradores_estado CHECK (estado IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE categorias (
  id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  imagen VARCHAR(500) NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categorias_slug (slug),
  CONSTRAINT chk_categorias_estado CHECK (estado IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE marcas (
  id_marca INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_marcas_slug (slug),
  CONSTRAINT chk_marcas_estado CHECK (estado IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE productos (
  id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  descripcion TEXT NULL,
  id_marca INT UNSIGNED NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  imagen_tipo ENUM('ARCHIVO', 'URL') NOT NULL DEFAULT 'URL',
  precio_actual DECIMAL(10,2) NOT NULL,
  precio_anterior DECIMAL(10,2) NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  estado TINYINT(1) NOT NULL DEFAULT 1,
  meta_titulo VARCHAR(180) NULL,
  meta_descripcion VARCHAR(255) NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_productos_slug (slug),
  KEY idx_productos_marca (id_marca),
  KEY idx_productos_publico (estado, stock),
  CONSTRAINT fk_productos_marca FOREIGN KEY (id_marca) REFERENCES marcas(id_marca),
  CONSTRAINT chk_productos_estado CHECK (estado IN (0, 1)),
  CONSTRAINT chk_productos_precio_actual CHECK (precio_actual >= 0),
  CONSTRAINT chk_productos_precio_anterior CHECK (precio_anterior IS NULL OR precio_anterior >= 0)
) ENGINE=InnoDB;

CREATE TABLE producto_categoria (
  id_producto INT UNSIGNED NOT NULL,
  id_categoria INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_producto, id_categoria),
  CONSTRAINT fk_producto_categoria_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
  CONSTRAINT fk_producto_categoria_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
) ENGINE=InnoDB;

CREATE TABLE producto_etiquetas (
  id_etiqueta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_producto INT UNSIGNED NOT NULL,
  etiqueta VARCHAR(80) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_producto_etiqueta (id_producto, etiqueta),
  CONSTRAINT fk_producto_etiquetas_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE promociones (
  id_promocion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  descripcion TEXT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_promociones_estado CHECK (estado IN (0, 1)),
  CONSTRAINT chk_promociones_fechas CHECK (fecha_fin >= fecha_inicio)
) ENGINE=InnoDB;

CREATE TABLE promocion_productos (
  id_promocion INT UNSIGNED NOT NULL,
  id_producto INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_promocion, id_producto),
  CONSTRAINT fk_promocion_productos_promocion FOREIGN KEY (id_promocion) REFERENCES promociones(id_promocion) ON DELETE CASCADE,
  CONSTRAINT fk_promocion_productos_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE banners (
  id_banner INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(160) NOT NULL,
  descripcion_corta VARCHAR(255) NULL,
  imagen VARCHAR(500) NOT NULL,
  orden INT NOT NULL DEFAULT 0,
  estado TINYINT(1) NOT NULL DEFAULT 1,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_banners_estado CHECK (estado IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE vistas_producto (
  id_vista BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_producto INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_vistas_producto (id_producto),
  CONSTRAINT fk_vistas_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carrito_eventos (
  id_evento BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_producto INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_carrito_producto (id_producto),
  CONSTRAINT fk_carrito_eventos_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE whatsapp_eventos (
  id_evento BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_producto INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_whatsapp_producto (id_producto),
  CONSTRAINT fk_whatsapp_eventos_producto FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE configuracion (
  id_configuracion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(120) NOT NULL,
  valor VARCHAR(500) NOT NULL,
  descripcion VARCHAR(255) NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_configuracion_clave (clave)
) ENGINE=InnoDB;
