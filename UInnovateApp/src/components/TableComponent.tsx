import "./TableComponent.css";

export default function TableComponent({ attr }) {
  const tableNames = Array.from(new Set(attr.map((table) => table.table_name)));
  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableNames.map((tableName: string) => {
              return <th>{tableName}</th>;
            })}
          </tr>
        </thead>
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