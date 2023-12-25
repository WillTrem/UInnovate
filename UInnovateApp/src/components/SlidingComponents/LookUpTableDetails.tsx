import { useEffect, useState } from "react";
import vmd, { Column, Table } from "../../virtualmodel/VMD";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import TableComponent from "react-bootstrap/Table";


interface TableListViewProps {
  table: Table;
}

const LookUpTableDetails: React.FC<TableListViewProps> = ({ table }: TableListViewProps) => {
  const name = table.table_name + "T";
  const Local = localStorage.getItem(name);
  if (Local == null) {
    return (<>no</>)
  }
  else {
    const [Columns, setColumns] = useState<Column[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [connect, setConnect] = useState<string>("");
    const [rows, setRows] = useState<Row[][] | undefined>([]);
    const getTable = JSON.parse(Local!);
    var count = Object.keys(getTable).length - 1;
    let currentPrimaryKey: string;
    const nonEditableColumn = table.columns.find((column: { is_editable: boolean; }) => column.is_editable === false);
    if (nonEditableColumn) {
      currentPrimaryKey = nonEditableColumn.column_name;
    }
    const LookUpTables = (num: number) => {
      num = num - 1;

      if (getTable[num] == 'none') {
        return (<>nothing</>);
      }
      else {
        const tableName = getTable[num];
          const search = table.getColumns()

          let toolsColumn: string = "none";
          search?.map((attribute) => {
            if (attribute.references_table == tableName) {
              toolsColumn = attribute.column_name;
            }
            else {
              return (<>nothing</>);
            }
          });
          const temp = toolsColumn + "L";
          const connectionID = localStorage.getItem(temp);
          if (connectionID == undefined) {
            return (<>nothing</>);
          }
          localStorage.setItem('connect', connectionID);
          useEffect(() => {
            console.log("connectionId")
            console.log(connectionID)
            setConnect(connectionID);
            console.log(connect)
          }, []);
          console.log(connect)


        useEffect(() => {
          setLoading(true);
          
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
              toolsColumn,
              "1"
            );
            console.log(data_accessor);
            const lines = await data_accessor.fetchRows();
            if (!lines) {
              return console.error("Could not fetch rows Damn...");
            }
            setRows(prevRows => [...prevRows, lines]);

          };
          getRows();
        }, [num]);

        useEffect(() => {
          setLoading(false);
        }, [Columns, rows]);

        if (loading) {
          return (
            <div>
              <p>Loading...</p>
            </div>
          );
        }
        return (
          <div>
            Here is the connectionID: {connectionID}

            <div>
              {/* Here is the table name: {toolsColumn} */}
            </div>
            <TableComponent striped bordered hover>
              <thead>
                <tr>
                  {Columns[num + 1].map((column) => {
                    return <th key={column.column_name}>{column.column_name}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
      {Array.isArray(rows[num + 1]) && rows[num + 1].map((row, rowIdx) => (
        <tr key={rowIdx}>
          {Object.values(row).map((cell, idx) => (
            <td key={idx}>
              {cell && typeof cell !== 'object' ? cell.toString() : ''}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
            </TableComponent>


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
}

export default LookUpTableDetails;