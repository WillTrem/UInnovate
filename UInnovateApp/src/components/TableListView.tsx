import "../styles/TableComponent.css";
import Table from "react-bootstrap/Table";
import attr from "../virtualmodel/Tables";
import {
  getColumnsFromTable,
  getRowsFromTable,
} from "../virtualmodel/FetchData";
import { useState, useEffect } from "react";

interface TableListViewProps {
  nameoftable: string;
}

const TableListView: React.FC<TableListViewProps> = ({
  nameoftable,
}: {
  nameoftable: string;
}) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attributes = await getColumnsFromTable(nameoftable);
        const lines = await getRowsFromTable(nameoftable);

        setColumns(attributes);
        setRows(lines);
      } catch (error) {
        console.error("Could not generate the columns and rows.");
      }
    };

    fetchData();
  }, [nameoftable]);

  return (
    <div>
      {attr.map((table) => {
        if (table.table_name !== nameoftable) {
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
                    //console.log(row);
                    return (
                      <tr>
                        {row.map((cell) => {
                         // console.log(cell)
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

export default TableListView;
