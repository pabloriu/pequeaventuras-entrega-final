function AlertMessage({ type = 'info', children }) {
  if (!children) return null;

  return <p className={`alert-message ${type}`}>{children}</p>;
}

export default AlertMessage;
