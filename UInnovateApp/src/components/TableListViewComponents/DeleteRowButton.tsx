import React, { ReactNode } from 'react';
import vmd, { Table } from '../../virtualmodel/VMD';
import { DataAccessor, Row } from '../../virtualmodel/DataAccessor';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { IoIosTrash } from 'react-icons/io';
import { displayError } from '../../redux/NotificationSlice';
interface DeleteRowProps {
  getRows: () => void;
  table: Table;
  row: Row;
}

const DeleteRowButton: React.FC<DeleteRowProps> =
  ({ getRows, table, row }: DeleteRowProps): ReactNode => {

    const dispatch = useDispatch();

    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }

    const DeleteRow = async () => {
      let column_name: string | undefined;
      let column_value: string | undefined;

      table.columns.forEach((column) => {
        if (column.is_editable === false) {
          // Check if the row contains the key
          column_name = column.column_name as string
          column_value = row.row?.[column.column_name] as string;
        }
      });

      if (column_name && column_value) {
        const data_accessor_delete: DataAccessor = vmd.getRemoveRowAccessor(
          schema.schema_name,
          table.table_name,
          column_name,
          column_value
        );

        try {
          await data_accessor_delete.deleteRow();
          console.log("Row deletion successful");
        } catch (error) {
          if (error) {
            dispatch(displayError("The row could not be deleted due to dependencies."));
          }
        }
        getRows();

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
          
          try {
            await data_accessor_delete.deleteRow();
            console.log("Row deletion successful");
          } catch (error) {
            if (error) {
              dispatch(displayError("The row could not be deleted due to dependencies."));
            }
          }
          getRows();

      }




    }

    return (<>

      <Button
        size="large"
        style={{
          color: 'black',
          position: 'absolute',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: 'transparent',
          minWidth: '35px'

        }}
        data-testid="delete-row-button"
        onClick={async (event) => {
          event.stopPropagation();
          await DeleteRow();

          // getRows();


        }}
      >
        <IoIosTrash size="1.5em" />
      </Button></>);

  }
export default DeleteRowButton;
