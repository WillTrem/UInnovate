import "../styles/TableComponent.css";
import TableComponent from "react-bootstrap/Table";
import vmd, { Table, Column } from "../virtualmodel/VMD";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import { useState, useEffect } from "react";
import AddRowPopup from "./AddRowPopup";

interface TableEnumViewProps {
  table: Table;
}

const TableEnumView: React.FC<TableEnumViewProps> = ({
  table,
}: {
  table: Table;
}) => {
  const [column, setColumn] = useState<Column>();
  const [originalColumns, setOriginalColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[] | undefined>([]);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schema = vmd.getTableSchema(table.table_name);
        if (!schema) {
          throw new Error("Schema not found");
        }

        const attribute = table.getEnumViewColumn();
        const columns = table.getColumns();

        if (!attribute) {
          throw new Error("Attribute not found");
        }

        const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
          schema.schema_name,
          table.table_name
        );
        const lines = await data_accessor.fetchRows();

        // Filter the rows to only include the attribute column
        const filteredRows = lines?.map((row: Row) => {
          const filteredRowData: { [key: string]: string | number | boolean } =
            {};
          filteredRowData[attribute.column_name] = row[attribute.column_name];
          return new Row(filteredRowData);
        });

        setColumn(attribute);
        setOriginalColumns(columns);
        setRows(filteredRows);
      } catch (error) {
        console.error("Could not generate the columns and rows.");
      }
    };

    fetchData();
  }, [table]);

  const handleAddRowClick = () => {
    setIsPopupVisible(true);
  };

  return (
    <div>
      <div>
        <TableComponent striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>{column?.column_name}</th>
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, rowIdx) => {
              return (
                <tr key={rowIdx}>
                  {Object.values(row.row).map((cell, cellIdx) => {
                    return <td key={cellIdx}>{cell}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </TableComponent>
      </div>
      <div>
        <div>
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
              table={table}
              columns={originalColumns}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableEnumView;
