const AdminFormModal = ({ title, children, onClose, onSubmit }) => {
  return (
    <>
      <div className="admin-modal-backdrop">
        <form onSubmit={onSubmit} className="admin-modal">
          <div className="admin-modal-head">
            <h2>{title}</h2>
            <button onClick={onClose} type="button">
              Cerrar
            </button>
          </div>

          {children}

          <div className="admin-modal-actions">
            <button onClick={onClose} type="button">
              Cancelar
            </button>

            <button type="submit" className="admin-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminFormModal;
