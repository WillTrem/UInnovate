import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import {
  getColumnsFromTable,
  getRowsFromTable,
} from "../virtualmodel/FetchData";
import { useEffect } from "react";

export default async function TableEnumView({
  nameOfTable,
}: {
  nameOfTable: string;
}) {
  const columns: string[] = await getColumnsFromTable("tools");
  console.log(columns);
  const rows = await getRowsFromTable("tools");
  console.log(rows);

  return (
    <div>
      {attr.map((table) => {
        if (table.table_name !== nameOfTable) {
          return null;
        } else {
          // const attributeElements = table.attributes.map((attribute) => (
          //   <th key={attribute}>{attribute}</th>
          // ));
          return (
            <div>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    {columns.map((column) => {
                      return <th key={column}>{column}</th>;
                    })}
                  </tr>
                  <tr>Yo</tr>
                </thead>
                {/* <tbody>
                  {rows.map((row) => {
                    console.log(row);
                    return (
                      <tr>
                        {row.map((cell) => {
                          return <td>{cell}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody> */}
              </Table>
            </div>
          );
        }
      })}
    </div>
  );
}
