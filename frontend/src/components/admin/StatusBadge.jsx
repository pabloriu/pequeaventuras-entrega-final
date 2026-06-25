function StatusBadge({ active }) {
  return <span className={active ? 'status-badge active' : 'status-badge inactive'}>{active ? 'Activo' : 'Inactivo'}</span>;
}

export default StatusBadge;
