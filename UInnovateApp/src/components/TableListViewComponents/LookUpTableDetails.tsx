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
    const count = Object.keys(getTable).length - 1;
    const LookUpTables = (num: number) => {
      num = num - 1;

      if (getTable[num] == 'none') {
        return (<></>);
      }
      else {
        console.log(currentRow);
        const attributes = table.getColumns();
        const lookup: string[] = getTable[num].split(':');
        const tableName = lookup[0].trim();
        const column = lookup[1].trim();
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
            console.log(data_accessor);
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
        }, [num, columnValue, tableName, column]);

        return (
          <div>
            {tableName} look up table:
            <div>
              {/* Here is the table name: {toolsColumn} */}
            </div>
            {Columns[num + 1] && rows[num + 1] ? (
              <TableContainer style={{ marginBottom: '2em' }}>
                <TableMUI
                  className="table-container"
                  size="medium"
                  sx={{ border: "1px solid lightgrey" }}
                  style={{ padding: '10px' }}
                  data-testid="table"
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