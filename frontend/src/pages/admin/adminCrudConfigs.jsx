import AdminCrudPage from './AdminCrudPage.jsx';

const statusOptions = [{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }];
const roleOptions = [{ value: 'PRINCIPAL', label: 'PRINCIPAL' }, { value: 'SECUNDARIO', label: 'SECUNDARIO' }];

export function AdminCategoriesPage() {
  return (
    <AdminCrudPage config={{
      title: 'Categorías',
      singular: 'categoría',
      resource: 'categorias',
      description: 'Organiza el catálogo público por categorías.',
      actionLabel: 'Crear categoría',
      hasImage: true,
      getId: (row) => row.id_categoria,
      initialForm: { nombre: '', slug: '', imagen: '', estado: 1 },
      columns: [
        { key: 'imagen', label: 'Imagen', type: 'image' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'slug', label: 'Slug' },
        { key: 'estado', label: 'Estado', render: (row) => Number(row.estado) === 1 ? 'Activo' : 'Inactivo' }
      ],
      fields: [
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'slug', label: 'Slug' },
        { name: 'imagen', label: 'Imagen por URL' },
        { name: 'estado', label: 'Estado', type: 'select', options: statusOptions }
      ]
    }} />
  );
}

export function AdminBrandsPage() {
  return (
    <AdminCrudPage config={{
      title: 'Marcas',
      singular: 'marca',
      resource: 'marcas',
      description: 'Gestiona las marcas asociadas a productos.',
      actionLabel: 'Crear marca',
      getId: (row) => row.id_marca,
      initialForm: { nombre: '', slug: '', estado: 1 },
      columns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'slug', label: 'Slug' },
        { key: 'estado', label: 'Estado', render: (row) => Number(row.estado) === 1 ? 'Activo' : 'Inactivo' }
      ],
      fields: [
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'slug', label: 'Slug' },
        { name: 'estado', label: 'Estado', type: 'select', options: statusOptions }
      ]
    }} />
  );
}

export function AdminPromotionsPage() {
  return (
    <AdminCrudPage config={{
      title: 'Promociones',
      singular: 'promoción',
      resource: 'promociones',
      description: 'Define promociones vigentes por fecha y estado.',
      actionLabel: 'Crear promoción',
      getId: (row) => row.id_promocion,
      initialForm: { nombre: '', descripcion: '', fecha_inicio: '', fecha_fin: '', estado: 1, productos: '' },
      columns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'fecha_inicio', label: 'Inicio' },
        { key: 'fecha_fin', label: 'Fin' },
        { key: 'estado', label: 'Estado', render: (row) => Number(row.estado) === 1 ? 'Activo' : 'Inactivo' }
      ],
      fields: [
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'descripcion', label: 'Descripción', type: 'textarea' },
        { name: 'fecha_inicio', label: 'Fecha inicio', type: 'date', required: true },
        { name: 'fecha_fin', label: 'Fecha fin', type: 'date', required: true },
        { name: 'productos', label: 'IDs de productos separados por coma' },
        { name: 'estado', label: 'Estado', type: 'select', options: statusOptions }
      ]
    }} />
  );
}

export function AdminBannersPage() {
  return (
    <AdminCrudPage config={{
      title: 'Banners',
      singular: 'banner',
      resource: 'banners',
      description: 'Gestiona el slider principal de la página pública.',
      actionLabel: 'Crear banner',
      hasImage: true,
      getId: (row) => row.id_banner,
      initialForm: { titulo: '', descripcion_corta: '', imagen: '', orden: 0, estado: 1 },
      columns: [
        { key: 'imagen', label: 'Imagen', type: 'image' },
        { key: 'titulo', label: 'Título' },
        { key: 'orden', label: 'Orden' },
        { key: 'estado', label: 'Estado', render: (row) => Number(row.estado) === 1 ? 'Activo' : 'Inactivo' }
      ],
      fields: [
        { name: 'titulo', label: 'Título', required: true },
        { name: 'descripcion_corta', label: 'Descripción corta' },
        { name: 'imagen', label: 'Imagen por URL' },
        { name: 'orden', label: 'Orden', type: 'number' },
        { name: 'estado', label: 'Estado', type: 'select', options: statusOptions }
      ]
    }} />
  );
}

export function AdminUsersPage() {
  return (
    <AdminCrudPage config={{
      title: 'Administradores',
      singular: 'administrador',
      resource: 'administradores',
      description: 'Solo el rol PRINCIPAL puede gestionar administradores.',
      actionLabel: 'Crear administrador',
      getId: (row) => row.id_admin,
      initialForm: { nombre_completo: '', correo: '', usuario: '', password: '', rol: 'SECUNDARIO', estado: 1 },
      columns: [
        { key: 'nombre_completo', label: 'Nombre' },
        { key: 'correo', label: 'Correo' },
        { key: 'usuario', label: 'Usuario' },
        { key: 'rol', label: 'Rol' },
        { key: 'estado', label: 'Estado', render: (row) => Number(row.estado) === 1 ? 'Activo' : 'Inactivo' }
      ],
      fields: [
        { name: 'nombre_completo', label: 'Nombre completo', required: true },
        { name: 'correo', label: 'Correo', type: 'email', required: true },
        { name: 'usuario', label: 'Usuario', required: true },
        { name: 'password', label: 'Contraseña', type: 'password' },
        { name: 'rol', label: 'Rol', type: 'select', options: roleOptions, required: true },
        { name: 'estado', label: 'Estado', type: 'select', options: statusOptions }
      ]
    }} />
  );
}
