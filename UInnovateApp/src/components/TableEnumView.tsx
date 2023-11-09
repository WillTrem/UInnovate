import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";

export default function TableEnumView({
  nameOfTable,
}: {
  nameOfTable: string | undefined;
}) {
  return (
    <div>
      {attr.map((table) => {
        if (table.table_name !== nameOfTable) {
          return null;
        } else {
          const attributeElements = table.attributes.map((attribute, index) => (
            <th key={index}>{attribute}</th>
          ));

          return (
            <div>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>{attributeElements}</tr>
                </thead>
              </Table>
            </div>
          );
        }
      })}
    </div>
  );
}
