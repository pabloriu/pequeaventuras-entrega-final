import { getImageUrl, handleImageError } from '../../utils/imageUrl.js';

function AdminTable({ columns, rows, getId, onEdit, onDelete, onToggle, toggleLabel = 'estado' }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getId(row)}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.type === 'image' && row[column.key] ? (
                    <img className="admin-thumb" src={getImageUrl(row[column.key])} alt="" onError={handleImageError} />
                  ) : column.render ? column.render(row) : String(row[column.key] ?? '')}
                </td>
              ))}
              <td>
                <div className="admin-actions">
                  {onEdit && <button type="button" onClick={() => onEdit(row)}>Editar</button>}
                  {onToggle && (
                    <button type="button" onClick={() => onToggle(row)}>
                      {Number(row[toggleLabel]) === 1 ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                  {onDelete && <button className="danger" type="button" onClick={() => onDelete(row)}>Eliminar</button>}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1}>No hay registros.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
