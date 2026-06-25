import { useEffect, useMemo, useState } from 'react';
import AlertMessage from '../../components/admin/AlertMessage.jsx';
import AdminFormModal from '../../components/admin/AdminFormModal.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { Field, MultiCheckbox, SelectInput, TextArea, TextInput } from '../../components/admin/FormFields.jsx';
import ImagePreview from '../../components/admin/ImagePreview.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { adminList } from '../../services/api.js';
import { productService } from '../../services/productService.js';

const emptyProduct = {
  nombre: '',
  descripcion: '',
  id_marca: '',
  precio_actual: '',
  precio_anterior: '',
  stock: '',
  imagen_url: '',
  meta_titulo: '',
  meta_descripcion: '',
  estado: 1,
  categorias: [],
  etiquetas: ''
};

function parseCategoryIds(value) {
  if (!value) return [];
  return String(value).split('|').map((item) => item.split(':')[0]).filter(Boolean);
}

function productFormData(form, imageFile) {
  const data = new FormData();
  const allowedFields = new Set([
    'nombre',
    'descripcion',
    'id_marca',
    'precio_actual',
    'precio_anterior',
    'stock',
    'imagen_url',
    'meta_titulo',
    'meta_descripcion',
    'estado',
    'categorias',
    'etiquetas'
  ]);

  Object.entries(form).forEach(([key, value]) => {
    if (!allowedFields.has(key)) return;
    if (key === 'categorias') data.append(key, JSON.stringify(value));
    else if (key === 'etiquetas') {
      data.append(key, JSON.stringify(String(value).split(',').map((tag) => tag.trim()).filter(Boolean)));
    } else data.append(key, value ?? '');
  });
  if (imageFile) data.append('imagen_archivo', imageFile);
  return data;
}

function validateProduct(form, imageFile, editing) {
  if (!form.nombre?.trim()) return 'El nombre es obligatorio.';
  if (!form.id_marca) return 'La marca es obligatoria.';
  if (form.precio_actual === '' || form.precio_actual === undefined) return 'El precio actual es obligatorio.';
  if (Number(form.precio_actual) < 0) return 'El precio actual debe ser mayor o igual a 0.';
  if (form.precio_anterior !== '' && form.precio_anterior !== null && form.precio_anterior !== undefined && Number(form.precio_anterior) < 0) return 'El precio anterior debe ser mayor o igual a 0.';
  if (form.stock === '' || form.stock === undefined) return 'El stock es obligatorio.';
  if (Number(form.stock) < 0) return 'El stock debe ser mayor o igual a 0.';
  if (!form.categorias?.length) return 'Debes seleccionar al menos una categoría.';
  if (imageFile && form.imagen_url) return 'Usa imagen por archivo o por URL, no ambas al mismo tiempo.';
  if (!editing && !imageFile && !form.imagen_url) return 'Debes registrar una imagen por archivo o URL.';
  return '';
}

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categoryOptions = useMemo(() => categories.map((item) => ({ value: String(item.id_categoria), label: item.nombre })), [categories]);
  const brandOptions = useMemo(() => brands.map((item) => ({ value: String(item.id_marca), label: item.nombre })), [brands]);

  async function load() {
    const [productRows, categoryRows, brandRows] = await Promise.all([
      productService.list(),
      adminList('categorias'),
      adminList('marcas')
    ]);
    setProducts(productRows);
    setCategories(categoryRows);
    setBrands(brandRows);
  }

  useEffect(() => {
    load().catch(() => setError('No se pudieron cargar los productos.'));
  }, []);

  function openCreate() {
    setEditing(null);
    setImageFile(null);
    setPreview('');
    setError('');
    setSuccess('');
    setForm(emptyProduct);
  }

  async function openEdit(product) {
    setError('');
    setSuccess('');
    setImageFile(null);
    const fullProduct = await productService.get(product.id_producto);
    setEditing(fullProduct);
    setPreview(fullProduct.imagen || '');
    setForm({
      ...emptyProduct,
      ...fullProduct,
      imagen_url: fullProduct.imagen_tipo === 'URL' ? fullProduct.imagen : '',
      categorias: parseCategoryIds(fullProduct.categorias),
      etiquetas: fullProduct.etiquetas ? String(fullProduct.etiquetas).split('|').join(', ') : ''
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateProduct(form, imageFile, editing);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (editing) await productService.update(editing.id_producto, productFormData(form, imageFile));
      else await productService.create(productFormData(form, imageFile));

      setSuccess(editing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
      setEditing(null);
      setForm({});
      setPreview('');
      await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo guardar el producto.');
    }
  }

  async function remove(product) {
    if (!confirm('¿Eliminar este producto?')) return;
    await productService.remove(product.id_producto);
    setSuccess('Producto eliminado correctamente.');
    await load();
  }

  async function toggle(product) {
    await productService.toggleStatus(product.id_producto, Number(product.estado) === 1 ? 0 : 1);
    setSuccess('Estado del producto actualizado.');
    await load();
  }

  return (
    <section className="admin-page">
      <AdminPageHeader title="Productos" description="Gestiona catálogo, precios, imágenes, categorías, etiquetas SEO y stock." actionLabel="Crear producto" onAction={openCreate} />
      <AlertMessage type="error">{error}</AlertMessage>
      <AlertMessage type="success">{success}</AlertMessage>
      <AdminTable
        rows={products}
        getId={(row) => row.id_producto}
        onEdit={openEdit}
        onDelete={remove}
        onToggle={toggle}
        columns={[
          { key: 'imagen', label: 'Imagen', type: 'image' },
          { key: 'nombre', label: 'Producto' },
          { key: 'marca', label: 'Marca' },
          { key: 'categorias', label: 'Categorías' },
          { key: 'precio_actual', label: 'Precio' },
          { key: 'precio_anterior', label: 'Precio anterior' },
          { key: 'stock', label: 'Stock' },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge active={Number(row.estado) === 1} /> }
        ]}
      />

      {(editing || Object.keys(form).length > 0) && (
        <AdminFormModal title={editing ? 'Editar producto' : 'Crear producto'} onClose={() => { setEditing(null); setForm({}); setPreview(''); }} onSubmit={submit}>
          <AlertMessage type="error">{error}</AlertMessage>
          <div className="admin-form-grid">
            <Field label="Nombre"><TextInput value={form.nombre} onChange={(value) => setForm({ ...form, nombre: value })} required /></Field>
            <Field label="Marca"><SelectInput value={form.id_marca} onChange={(value) => setForm({ ...form, id_marca: value })} options={brandOptions} required /></Field>
            <Field label="Precio actual"><TextInput type="number" value={form.precio_actual} onChange={(value) => setForm({ ...form, precio_actual: value })} required /></Field>
            <Field label="Precio anterior"><TextInput type="number" value={form.precio_anterior || ''} onChange={(value) => setForm({ ...form, precio_anterior: value })} /></Field>
            <Field label="Stock"><TextInput type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: value })} required /></Field>
            <Field label="Estado"><SelectInput value={String(form.estado)} onChange={(value) => setForm({ ...form, estado: value })} options={[{ value: '1', label: 'Activo' }, { value: '0', label: 'Inactivo' }]} /></Field>
            <Field label="Imagen por URL"><TextInput value={form.imagen_url || ''} onChange={(value) => { setForm({ ...form, imagen_url: value }); setPreview(value); }} /></Field>
            <Field label="Imagen por archivo"><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0] || null; setImageFile(file); setPreview(file ? URL.createObjectURL(file) : (form.imagen_url || editing?.imagen || '')); }} /></Field>
            <Field label="Categorías"><MultiCheckbox options={categoryOptions} values={form.categorias || []} onChange={(value) => setForm({ ...form, categorias: value })} /></Field>
            <Field label="Etiquetas SEO separadas por coma"><TextInput value={form.etiquetas || ''} onChange={(value) => setForm({ ...form, etiquetas: value })} /></Field>
            <Field label="Meta título"><TextInput value={form.meta_titulo || ''} onChange={(value) => setForm({ ...form, meta_titulo: value })} /></Field>
            <Field label="Meta descripción"><TextInput value={form.meta_descripcion || ''} onChange={(value) => setForm({ ...form, meta_descripcion: value })} /></Field>
            <Field label="Descripción"><TextArea value={form.descripcion || ''} onChange={(value) => setForm({ ...form, descripcion: value })} /></Field>
            <ImagePreview src={preview || form.imagen_url || editing?.imagen} label="Imagen del producto" />
          </div>
        </AdminFormModal>
      )}
    </section>
  );
}

export default AdminProductsPage;
