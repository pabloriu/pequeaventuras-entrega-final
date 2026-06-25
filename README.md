# PequeAventuras

Tienda web para productos de bebes y ninos con catalogo publico, carrito persistente, contacto por WhatsApp y panel administrativo.

El sistema no incluye pagos en linea, login de clientes, pedidos ni ventas registradas.

## Requisitos Previos

- Node.js 18 o superior.
- MySQL 8 o superior.
- npm.

## Estructura

```text
pequeaventuras/
  backend/
    database/
      schema.sql
      seed.sql
    src/
      config/
      controllers/
      middlewares/
      routes/
      services/
      uploads/
      utils/
      server.js
  frontend/
    public/
    src/
      components/
      context/
      pages/
      routes/
      services/
      utils/
```

## Base De Datos

Importar primero el esquema y luego los datos iniciales:

```bash
mysql -u root < backend/database/schema.sql
mysql -u root pequeaventuras_db < backend/database/seed.sql
```

El seed crea el administrador inicial:

```text
usuario: admin
password: admin123
rol: PRINCIPAL
```

Cambia esta contrasena antes de publicar el sistema.

## Backend

Instalacion:

```bash
cd backend
npm install
```

Crear `backend/.env` tomando como base `backend/.env.example`:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pequeaventuras_db
JWT_SECRET=cambia_este_secreto_largo_en_produccion
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
WHATSAPP_NUMBER=51930700147
UPLOADS_DIR=src/uploads
```

Ejecucion en desarrollo:

```bash
npm run dev
```

Ejecucion en produccion:

```bash
npm start
```

API local:

```text
http://localhost:3000/api
```

## Frontend

Instalacion:

```bash
cd frontend
npm install
```

Crear `frontend/.env` tomando como base `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

Ejecucion en desarrollo:

```bash
npm run dev
```

Build de produccion:

```bash
npm run build
```

Vista previa del build:

```bash
npm run preview
```

## Rutas Principales

Publicas:

- `GET /api/public/banners`
- `GET /api/public/categorias`
- `GET /api/public/productos`
- `GET /api/public/productos/categoria/:slug`
- `GET /api/public/productos/destacados`
- `GET /api/public/productos/promociones`
- `GET /api/public/productos/:slug`
- `POST /api/public/carrito-evento`
- `POST /api/public/whatsapp-evento`
- `GET /api/public/configuracion/whatsapp`

Autenticacion:

- `POST /api/auth/login`
- `GET /api/auth/me`

Administracion:

- `/api/admin/productos`
- `/api/admin/categorias`
- `/api/admin/marcas`
- `/api/admin/promociones`
- `/api/admin/banners`
- `/api/admin/reportes/*`
- `/api/admin/administradores` solo rol `PRINCIPAL`

## Reglas Del Sistema

- El cliente no inicia sesion.
- El cliente nunca ve stock.
- Productos con stock `0` no aparecen en el catalogo publico.
- Productos destacados no muestran precios.
- Promociones muestran precio anterior y precio actual.
- El carrito usa `localStorage`.
- WhatsApp recibe solo nombres de productos.
- Las rutas administrativas requieren JWT.
- Solo `PRINCIPAL` gestiona administradores.

## Produccion

- Usar `NODE_ENV=production`.
- Cambiar `JWT_SECRET` por un valor largo y privado.
- Cambiar la contrasena del administrador inicial.
- Configurar `CORS_ORIGINS` con el dominio real del frontend.
- Servir el frontend compilado desde `frontend/dist`.
- Servir el backend con un proceso Node persistente.
- Usar HTTPS.
- Hacer respaldo periodico de MySQL y de `backend/src/uploads`.
