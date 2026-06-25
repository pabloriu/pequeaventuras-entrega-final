import { useEffect, useState } from 'react';
import AdminFormModal from '../../components/admin/AdminFormModal.jsx';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import AdminTable from '../../components/admin/AdminTable.jsx';
import { Field, TextInput, TextArea, SelectInput } from '../../components/admin/FormFields.jsx';
import { adminCreate, adminDelete, adminList, adminPatch, adminUpdate } from '../../services/api.js';

function toFormData(form, imageFile) {
  const data = new FormData();
  Object.entries(form).forEach(([key, value]) => data.append(key, value ?? ''));
  if (imageFile) data.append('imagen_archivo', imageFile);
  return data;
}

function AdminCrudPage({ config }) {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  async function loadRows() {
    setRows(await adminList(config.resource));
  }

  useEffect(() => {
    loadRows().catch(() => setError('No se pudieron cargar los datos.'));
  }, [config.resource]);

  function openCreate() {
    setEditing(null);
    setImageFile(null);
    setForm(config.initialForm || {});
  }

  function openEdit(row) {
    setEditing(row);
    setImageFile(null);
    setForm({ ...row, password: '' });
  }

  async function submit(event) {
    event.preventDefault();
    const payload = config.hasImage ? toFormData(form, imageFile) : form;

    if (editing) await adminUpdate(config.resource, config.getId(editing), payload, config.hasImage);
    else await adminCreate(config.resource, payload, config.hasImage);

    setEditing(null);
    setForm({});
    await loadRows();
  }

  async function remove(row) {
    if (!confirm('¿Eliminar este registro?')) return;
    await adminDelete(config.resource, config.getId(row));
    await loadRows();
  }

  async function toggle(row) {
    await adminPatch(config.resource, config.getId(row), 'estado', { estado: Number(row.estado) === 1 ? 0 : 1 });
    await loadRows();
  }

  return (
    <section className="admin-page">
      <AdminPageHeader title={config.title} description={config.description} actionLabel={config.actionLabel || 'Crear'} onAction={openCreate} />
      {error && <p className="admin-error">{error}</p>}
      <AdminTable columns={config.columns} rows={rows} getId={config.getId} onEdit={openEdit} onDelete={remove} onToggle={toggle} />

      {(editing || Object.keys(form).length > 0) && (
        <AdminFormModal title={editing ? `Editar ${config.singular}` : `Crear ${config.singular}`} onClose={() => { setEditing(null); setForm({}); }} onSubmit={submit}>
          <div className="admin-form-grid">
            {config.fields.map((field) => (
              <Field key={field.name} label={field.label}>
                {field.type === 'textarea' ? (
                  <TextArea value={form[field.name] || ''} onChange={(value) => setForm({ ...form, [field.name]: value })} />
                ) : field.type === 'select' ? (
                  <SelectInput value={form[field.name] || ''} onChange={(value) => setForm({ ...form, [field.name]: value })} options={field.options} required={field.required} />
                ) : (
                  <TextInput type={field.type || 'text'} value={form[field.name] || ''} onChange={(value) => setForm({ ...form, [field.name]: value })} required={field.required} />
                )}
              </Field>
            ))}
            {config.hasImage && (
              <Field label="Imagen por archivo">
                <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
              </Field>
            )}
          </div>
        </AdminFormModal>
      )}
    </section>
  );
}

export default AdminCrudPage;
