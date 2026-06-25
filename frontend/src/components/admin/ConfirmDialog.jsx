function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal confirm-dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button type="button" onClick={onCancel}>Cancelar</button>
          <button className="admin-primary danger-primary" type="button" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
