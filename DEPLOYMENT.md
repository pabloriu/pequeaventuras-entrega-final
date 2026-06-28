# Despliegue De PequeAventuras

Guia simple para publicar el proyecto en un VPS o hosting con soporte para Node.js y MySQL.

## 1. Servidor

Preparar un servidor con:

- Node.js 18 o superior.
- MySQL 8 o superior.
- Nginx o Apache como proxy web.
- Dominio apuntando al servidor.
- Certificado HTTPS.

## 2. Base De Datos

Crear e importar la base:

```bash
mysql -u root < backend/database/schema.sql
mysql -u root pequeaventuras_db < backend/database/seed.sql
```

Crear un usuario MySQL propio para la aplicacion y evitar usar `root` en produccion.

## 3. Backend

Instalar dependencias:

```bash
cd backend
npm install
```

Crear `backend/.env`:

```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario_mysql
DB_PASSWORD=password_mysql
DB_NAME=pequeaventuras_db
MYSQL_PUBLIC_URL=
JWT_SECRET=un_secreto_largo_y_privado
JWT_EXPIRES_IN=8h
FRONTEND_URL=https://tudominio.com
CORS_ORIGINS=https://tudominio.com
WHATSAPP_NUMBER=51930700147
UPLOADS_DIR=src/uploads
```

Para Render conectado a Railway MySQL, se recomienda usar la variable completa de Railway:

```env
MYSQL_PUBLIC_URL=mysql://root:password@host.proxy.rlwy.net:38913/railway
```

Si `MYSQL_PUBLIC_URL` esta configurada, el backend la usa como prioridad y no necesita `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` ni `DB_NAME` para conectarse.

Iniciar:

```bash
npm start
```

En un VPS conviene usar un administrador de procesos como PM2 o el servicio que ofrezca el hosting.

## 4. Frontend

Configurar `frontend/.env`:

```env
VITE_API_URL=https://api.tudominio.com/api
```

Compilar:

```bash
cd frontend
npm install
npm run build
```

Publicar el contenido de `frontend/dist` en el hosting estatico o servirlo con Nginx/Apache.

## 5. Dominio, HTTPS Y CORS

- Configurar el dominio publico del frontend.
- Configurar el dominio o subdominio del backend.
- Activar HTTPS.
- Actualizar `CORS_ORIGINS` con el dominio real del frontend.
- Actualizar `VITE_API_URL` con la URL real del backend.

## 6. Seguridad Antes De Publicar

- Cambiar `JWT_SECRET`.
- Cambiar la contrasena del administrador inicial `admin`.
- Revisar que MySQL no use usuario `root` para la aplicacion.
- Mantener respaldos de la base de datos.
- Mantener respaldos de `backend/src/uploads`.
- No subir archivos `.env` al repositorio.

## 7. Verificacion Final

- Abrir el catalogo publico.
- Ver categorias y detalle de producto.
- Agregar productos al carrito.
- Probar el boton "Contactarse con el vendedor".
- Entrar a `/admin/login`.
- Crear y editar productos.
- Cambiar stock a `0` y confirmar que desaparece del catalogo publico.
- Crear categoria, marca, promocion y banner.
- Revisar reportes.
- Cerrar sesion.
