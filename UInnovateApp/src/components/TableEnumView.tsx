import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import {
  getColumnsFromTable,
  getRowsFromTable,
} from "../virtualmodel/FetchData";
import { useState, useEffect } from "react";
import AddRowPopup from "./AddRowPopup";

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
  const [originalColumns, setOriginalColumns] = useState<string[]>([]);
  // const [originalRows, setOriginalRows] = useState<string[][]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributes = await getColumnsFromTable(nameOfTable);
        const lines = await getRowsFromTable(nameOfTable);
        setOriginalColumns(attributes);
        // setOriginalRows(lines);

        // If a table was selected as enum type, filter through the attributes
        // to only get columns indicating a "type"
        const filteredAttributes = attributes.filter((columnName: string) =>
          // columnName.includes("type") ||
          // columnName.includes("id") ||
          columnName.includes("name")
        );

        // To display only the column of that specific attribute, we need
        // to find the indices of all the columns we keep
        const columnIndices = attributes.reduce(
          (indices: number[], columnName: string, index: number) => {
            if (filteredAttributes.includes(columnName)) {
              indices.push(index);
            }
            return indices;
          },
          [] as number[]
        );

        // Now we only keep the columns of the rows containing the data
        // of the matched indices
        const filteredRows = lines.map((row) =>
          columnIndices.map((index: number) => row[index])
        );

        setColumns(filteredAttributes);
        setRows(filteredRows);
      } catch (error) {
        console.error("Could not generate the columns and rows.");
      }
    };

    fetchData();
  }, [nameOfTable]);

  const handleAddRowClick = () => {
    setIsPopupVisible(true);
  };

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
              <div
                className="container"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  onClick={() => handleAddRowClick()}
                  style={{ display: "flex" }}
                >
                  +
                </button>
              </div>
              {isPopupVisible && (
                <AddRowPopup
                  onClose={() => setIsPopupVisible(false)}
                  table={table.table_name}
                  columns={originalColumns}
                />
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

export default TableEnumView;
