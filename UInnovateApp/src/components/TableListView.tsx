import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import {
  getColumnsFromTable,
  getRowsFromTable,
} from "../virtualmodel/FetchData";
import { useState, useEffect } from "react";

interface TableListViewProps {
  nameOfTable: string;
}

const TableListView: React.FC<TableListViewProps> = ({
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
      {attr.map((table, tableIdx) => {
        if (table.table_name !== nameOfTable) {
          return null;
        } else {
          return (
            <div key={table.table_name + tableIdx}>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    {columns.map((column, colIdx) => {
                      return <th key={column + colIdx}>{column}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => {
                    return (
                      <tr key={rowIdx}>
                        {row.map((cell, cellIdx) => {
                          return <td key={cell + cellIdx}>{cell}</td>;
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

export default TableListView;
