import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import { getRowsFromTable } from "../virtualmodel/FetchData";

export default function TableEnumView({
  nameOfTable,
}: {
  nameOfTable: string | undefined;
}) {
  const rows = getRowsFromTable("tools");
  console.log(rows);
  return (
    <div>
      {attr.map((table) => {
        if (table.table_name !== nameOfTable) {
          return null;
        } else {
          const attributeElements = table.attributes.map((attribute, index) => (
            <th key={index}>{attribute}</th>
          ));

          const rowElements = rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ));
          return (
            <div>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>{attributeElements}</tr>
                </thead>
                <tbody>{rowElements}</tbody>
              </Table>
            </div>
          );
        }
      })}
    </div>
  );
}
