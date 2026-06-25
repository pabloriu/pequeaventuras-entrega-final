function AdminPageHeader({ title, description, actionLabel, onAction }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actionLabel && (
        <button className="admin-primary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default AdminPageHeader;
