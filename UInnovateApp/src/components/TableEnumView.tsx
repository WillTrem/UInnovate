import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import {
  getColumnsFromTable,
  getRowsFromTable,
} from "../virtualmodel/FetchData";
import { useState, useEffect } from "react";

interface TableEnumViewProps {
  nameOfTable: string;
}

const TableEnumView: React.FC<TableEnumViewProps> = ({
  nameOfTable,
}: {
  nameOfTable: string;
}) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributes = await getColumnsFromTable(nameOfTable);
        const lines = await getRowsFromTable(nameOfTable);

        setColumns(attributes);
        setRows(lines);
      } catch (error) {
        console.error("Could not generate the columns and rows.");
      }
    };

    fetchData();
  }, [nameOfTable]);

  return (
    <div>
      {attr.map((table) => {
        if (table.table_name !== nameOfTable) {
          return null;
        } else {
          return (
            <div>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    {columns.map((column) => {
                      return <th key={column}>{column}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
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
                </tbody>
              </Table>
            </div>
          );
        }
      })}
    </div>
  );
};

export default TableEnumView;
