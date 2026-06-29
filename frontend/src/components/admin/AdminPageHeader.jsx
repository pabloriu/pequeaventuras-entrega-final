const AdminPageHeader = ({
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>

        {actionLabel ? (
          <button
            type="button"
            className="admin-primary"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </>
  );
};

export default AdminPageHeader;
