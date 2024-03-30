import { useEffect, useState } from "react";
import vmd, { Column, Table } from "../../virtualmodel/VMD";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import {
  Table as TableMUI,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface TableListViewProps {
  table: Table;
  currentRow: Row;
}

const LookUpTableDetails: React.FC<TableListViewProps> = ({
  table,
  currentRow,
}: TableListViewProps) => {
  const [tableLookups, setTableLookup] = useState<string[]>([]); // [tableName, type
  const [tablesData, setTablesData] = useState<{ tableName: string, columns: Column[], rows: Row[] }[]>([]);
  useEffect(() => {
    console.log("test")

    const getTable = JSON.parse(table.lookup_tables);
    const count = Object.keys(getTable).length - 1; // -1 to account for the row key and checks for the number of look up tables that are present
    const tableLookup = [];
    for (let i = -1; i < count - 1; i++) {
      if (getTable[i] != "none") {
        tableLookup.push(getTable[i]);
      }
    }
    setTableLookup(tableLookup);
  }, [table]);


  useEffect(() => {
    console.log("test")
    const fetchTableData = async () => {
      const promises = tableLookups.map(async (lookup) => {

        const attributes = table.getColumns();
        const value = lookup.split(":");
        const tableName = value[0].trim();
        const type = value[1].trim();

        let column = "";

        attributes?.map((attribute) => {
          //checks for references table and referenced table
          if (type == "references") {
            if (attribute.references_table == tableName) {
              column = attribute.references_by;
            }
          }

          if (type == "referenced") {
            if (
              attribute.referenced_table != null &&
              attribute.referenced_table != "null"
            ) {
              attribute.referenced_table.split(",").map((table) => {
                if (table.trim() == tableName) {
                  column = attribute.referenced_by;
                }
              });
            }
          }
        });

        let columnValue = currentRow[column];

        if (columnValue == undefined) {
          attributes?.map((attribute) => {
            if (attribute.is_editable == false) {
              columnValue = currentRow[attribute.column_name];
            }
          });
        }


        const schemaObj = vmd.getTableSchema(tableName);
        if (!schemaObj) {
          console.error("SchemaObj did not work");
          return { tableName: "", columns: [], rows: [] }; // Return a default object
        }
        const tableObj = vmd.getTable(schemaObj.schema_name, tableName);
        if (!tableObj) {
          console.error("tableObj did not work");
          return { tableName: "", columns: [], rows: [] }; // Return a default object
        }
        const columns = tableObj.getColumns();
        // setColumns((prevColumns) => [...prevColumns, Colss]);
        const data_accessor: DataAccessor =
          vmd.getRowsDataAccessorForLookUpTable(
            schemaObj.schema_name,
            tableName,
            column,
            columnValue
          );
        const rows = await data_accessor.fetchRows();

        const filteredRows = rows?.map((row) => {
          const filteredRowData: { [key: string]: string | number | boolean } = {};
          columns.forEach((column) => {
            filteredRowData[column.column_name] = row[column.column_name];
          });
          return filteredRowData;
        });
        
        
        
        console.log(filteredRows)
        if (!filteredRows) {
          console.error("Could not fetch rows");
          return { tableName: "", columns: [], rows: [] };
        }

        // setRows((prevRows) => [...(prevRows || []), filteredRows]);
        return { tableName, columns, rows: filteredRows };
      });

      const tablesData = await Promise.all(promises);
      setTablesData(tablesData);
    };

    fetchTableData();
  }, [tableLookups]);

  return (
    <>
      {tablesData.map((tableData, index) => (
        <div key={index}>
          <div style={{ marginLeft: "12px" }} data-testid="look-up-table-text">
            {tableData.tableName} look up table:
          </div>
          <div></div>
          {tableData.columns && tableData.rows ? (
            <TableContainer style={{ marginBottom: "2em" }}>
              <TableMUI
                className="table-container"
                size="medium"
                sx={{ border: "1px solid lightgrey" }}
                style={{ padding: "10px" }}
                data-testid="lookUp-table"
              >
                <TableHead>
                  <TableRow>
                    {tableData.columns.map((column) => {
                      return (
                        <TableCell key={column.column_name}>
                          {column.column_name}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(tableData.rows) &&
                    tableData.rows.map((row, rowIdx) => (
                      <TableRow key={rowIdx} sx={{ backgroundColor: "#f2f2f2" }}>
                        {Object.values(row).map((cell, idx) => (
                          <TableCell key={idx}>
                            {cell !== null &&
                            cell !== undefined &&
                            typeof cell !== "object"
                              ? cell.toString()
                              : ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </TableMUI>
            </TableContainer>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ))}
    </>
  );
};

export default LookUpTableDetails;
