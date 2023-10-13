import "./TableComponent.css";
export default function TableComponent({ columnNames }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            {columnNames.map((columnName: string) => {
              return <th>{columnName}</th>;
            })}
          </tr>
        </thead>
      </table>
    </div>
  );
}
