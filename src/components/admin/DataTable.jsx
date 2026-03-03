export function DataTable({ columns, data, emptyText = 'Sem dados', rowKey = 'id' }) {
  if (!data.length) {
    return <div className="admin-empty">{emptyText}</div>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[rowKey]}>
              {columns.map((column) => (
                <td key={`${row[rowKey]}-${column.key}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
