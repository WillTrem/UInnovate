import React, { ReactNode } from 'react';
import vmd, { Table } from '../../virtualmodel/VMD';
import { DataAccessor, Row } from '../../virtualmodel/DataAccessor';

interface DeleteRowProps {
  table: Table;
  row: Row;
}

const DeleteRowFunction: React.FC<DeleteRowProps> =
  ({ table, row }: DeleteRowProps): ReactNode => {

  console.log(table);
  const DeleteRow = async (row: Row) => {
    let column_name: string | undefined;
    let column_value: string | undefined;
    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }
    table.columns.forEach((column) => {
      if (column.is_editable === false) {
        // Check if the row contains the key
        column_name = column.column_name as string
        column_value = row.row?.[column.column_name] as string;
      }
    });
     
    console.log(schema.schema_name)
    if( column_name && column_value){
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
  DeleteRow(row);
  return null;
}

export default DeleteRowFunction;
