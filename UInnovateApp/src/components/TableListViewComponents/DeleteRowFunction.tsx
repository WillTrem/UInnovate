import React, { ReactNode } from 'react';
import vmd, { Table } from '../../virtualmodel/VMD';
import { DataAccessor, Row } from '../../virtualmodel/DataAccessor';
import { Delete } from '@mui/icons-material';

interface DeleteRowProps {
  table: Table;
  row: Row;
}

const DeleteRowFunction: React.FC<DeleteRowProps> =
  ({ table, row }: DeleteRowProps): ReactNode => {
    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }

    const DependencyCheck = async (Independent_Delete:boolean, tables:Table, value:string[] ) => {
      console.log("Dependency Check", tables.table_name, value, Independent_Delete)
      if (tables.columns.every(column => column.referenced_table == null)) {
        DeleteRow(Independent_Delete);
      }
      else {
        // Independent_Delete = false;
        // const columnWithReference = tables.columns.find(column => column.referenced_table != null);
        // if (columnWithReference) {
        //   const referencedTables = columnWithReference.referenced_table.split(',');
        //   const referencedCol = columnWithReference.referenced_by;
        //   console.log("dependency found in", referencedTables, "column", referencedCol, "row", row.row?.[referencedCol]);
        //   const table = vmd.getTable(schema.schema_name, referencedTables[0]);
        //   if(table) {
        //   DependencyCheck(Independent_Delete, table, [row.row?.[referencedCol] as string]);
        // }
        // }
        DeleteRow(Independent_Delete);
      }
    }

    const DeleteRow = async (Independent_Delete: boolean) => {
      if (Independent_Delete) {
        let column_name: string | undefined;
        let column_value: string | undefined;
      
        table.columns.forEach((column) => {
          if (column.is_editable === false) {
            // Check if the row contains the key
            column_name = column.column_name as string
            column_value = row.row?.[column.column_name] as string;
          }
        });

        console.log(schema.schema_name)
        if (column_name && column_value) {
          const data_accessor_delete: DataAccessor = vmd.getRemoveRowAccessor(
            schema.schema_name,
            table.table_name,
            column_name,
            column_value
          );

          data_accessor_delete.deleteRow().then(() => {
          });
          console.log(data_accessor_delete)
        }
        else {
          console.log("No Primary Key Found");
          const rowKeys: string[] = Object.keys(row.row || {});
          const rowValues: string[] = Object.values(row.row || {}).map(String);
          console.log(rowKeys)
          console.log(rowValues)
          const data_accessor_delete: DataAccessor = vmd.getRemoveRowAccessor(
            schema.schema_name,
            table.table_name,
            rowKeys,
            rowValues
          );

          data_accessor_delete.deleteRow().then(() => {

          });
          console.log(data_accessor_delete);

        }

      }
      else {
        console.log("Cannot delete dependent row");
      }


    }
    DependencyCheck(true, table, []);
    return null;
  }
export default DeleteRowFunction;
