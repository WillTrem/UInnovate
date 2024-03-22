import { useEffect, useState } from "react";
import vmd, { Column, Table, } from "../../virtualmodel/VMD";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import {
  Table as TableMUI,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';


interface TableListViewProps {
  table: Table;
  currentRow: Row;
}

const LookUpTableDetails: React.FC<TableListViewProps> =
  ({ table, currentRow }: TableListViewProps) => {

    const [Columns, setColumns] = useState<Column[][]>([]);
    const [rows, setRows] = useState<Row[][] | undefined>([]);
    const getTable = JSON.parse(table.lookup_tables);
    const count = Object.keys(getTable).length - 1; // -1 to account for the row key and checks for the number of look up tables that are present
    const LookUpTables = (num: number) => {
      num = num - 1;
      //if not settings are present for look up tables
      if (getTable[num] == 'none') {
        return (<></>);
      }
      else {
        const attributes = table.getColumns();
        const value = getTable[num].split(':');
        const tableName = value[0].trim();
        const type = value[1].trim();
        let column = 'bruh';
        attributes?.map((attribute) => {
          //checks for references table and referenced table
          if (type == 'references') {
            if (attribute.references_table == tableName) {
              column = attribute.references_by;
            }
          }
          if (type == 'referenced') {
            if (attribute.referenced_table != null && attribute.referenced_table != "null") {
              attribute.referenced_table.split(',').map((table) => {
                if (table.trim() == tableName) {
                  column = attribute.referenced_by;
                }
              }
              );
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




        useEffect(() => {

          const getRows = async () => {
            const schemaObj = vmd.getTableSchema(tableName)
            if (!schemaObj) {
              return (<>SchemaObj did not work</>);
            }
            const tableObj = vmd.getTable(schemaObj.schema_name, tableName);
            if (!tableObj) {
              return (<>tableObj did not work</>);
            }
            const Colss = tableObj.getColumns();
            setColumns(prevColumns => [...prevColumns, Colss]);
            const data_accessor: DataAccessor = vmd.getRowsDataAccessorForLookUpTable(
              schemaObj.schema_name,
              tableName,
              column,
              columnValue
            );
            const lines = await data_accessor.fetchRows();
            if (!lines) {
              return console.error("Could not fetch rows");
            }
            // Filter the rows to only include the visible columns
            const filteredRows = lines?.map((row) => {
              const filteredRowData: { [key: string]: string | number | boolean } =
                {};
              Colss.forEach((column) => {
                filteredRowData[column.column_name] = row[column.column_name];
              });
              return (filteredRowData);
            });
            setRows(prevRows => [...prevRows, filteredRows]);

          };
          getRows();
        }, [num, columnValue, tableName, column, currentRow, attributes]);

        return (
          <div>
            <div
              style={{ marginLeft: '12px' }}
              data-testid="look-up-table-text"
            >
              {tableName} {type} look up table:
            </div>
            <div>
              
            </div>
            {Columns[num + 1] && rows[num + 1] ? (
              <TableContainer style={{ marginBottom: '2em' }} >
                <TableMUI
                  className="table-container"
                  size="medium"
                  sx={{ border: "1px solid lightgrey" }}
                  style={{ padding: '10px' }}
                  data-testid="lookUp-table"
                >
                  <TableHead>
                    <TableRow >
                      {Columns[num + 1].map((column) => {
                        return <TableCell key={column.column_name}>{column.column_name}</TableCell>;
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(rows[num + 1]) && rows[num + 1].map((row, rowIdx) => (
                      <TableRow key={rowIdx} sx={{ backgroundColor: '#f2f2f2' }}>
                        {Object.values(row).map((cell, idx) => (
                          <TableCell key={idx} >
                            {cell !== null && cell !== undefined && typeof cell !== 'object' ? cell.toString() : ''}
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


        )

      }

    }


    return (<>
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {LookUpTables(index)}
        </div>

      ))}
    </>
    )




  }

export default LookUpTableDetails;