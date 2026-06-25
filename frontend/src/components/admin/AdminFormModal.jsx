function AdminFormModal({ title, children, onClose, onSubmit }) {
  return (
    <div className="admin-modal-backdrop">
      <form className="admin-modal" onSubmit={onSubmit}>
        <div className="admin-modal-head">
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>Cerrar</button>
        </div>
        {children}
        <div className="admin-modal-actions">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button className="admin-primary" type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default AdminFormModal;
