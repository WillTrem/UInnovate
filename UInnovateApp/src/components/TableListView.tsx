import "./TableComponent.css";

export default function TableListView({ attr }) {
  const tableNames = Array.from(new Set(attr.map((table) => table.table_name)));
  return (
    <div>
      <table>
       
        <tbody>
          {attr.map((table) => {
            return (
              <tr>
                {tableNames.map((tableName) => {
                  return (
                    <td>
                      {table.table_name === tableName
                        ? table.attributes.join(", ")
                        : null}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
