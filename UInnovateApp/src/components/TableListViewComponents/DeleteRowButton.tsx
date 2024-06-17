import React, { ReactNode } from 'react';
import vmd, { Table } from '../../virtualmodel/VMD';
import { DataAccessor, Row } from '../../virtualmodel/DataAccessor';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { MdDelete } from "react-icons/md";
import { displayError } from '../../redux/NotificationSlice';
import Logger from '../../virtualmodel/Logger';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { AuthState } from "../../redux/AuthSlice";
import "../../styles/TableListView.css";

interface DeleteRowProps {
  getRows: () => void;
  table: Table;
  row: Row;
}

const DeleteRowButton: React.FC<DeleteRowProps> =
  ({ getRows, table, row }: DeleteRowProps): ReactNode => {
    const { user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);
    //for the error display message
    const dispatch = useDispatch();
    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Schema not found");
      return;
    }

    //finding the dependent tables if there are any 
    const columnWithReference = table.columns.find(column => column.referenced_table != null);
    let referencedTables: string = "";
    if (columnWithReference) {
      referencedTables = columnWithReference.referenced_table as string;
    }




    //deleting function
    const DeleteRow = async () => {
      console.log(table);

      let column_name: string | undefined;
      let column_value: string | undefined;

      // Finding the primary key
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
          Logger.logUserAction(
            loggedInUser || "",
            "Deleted Row",
            "User has deleted a row in the table: " + table.table_name + "with primary key: " + column_name + " = " + column_value,
            schema?.schema_name || "",
            table.table_name

          );
        } catch (error) {
          if (error) {
            dispatch(displayError(`The row could not be deleted due to dependencies with ${referencedTables}.`));
          }

        }


        getRows();

      }
      else {
        //if the table has no primary keys
        const rowKeys: string[] = Object.keys(row.row || {});
        const rowValues: string[] = Object.values(row.row || {}).map(String);
        const data_accessor_delete: DataAccessor = vmd.getRemoveRowAccessor(
          schema.schema_name,
          table.table_name,
          rowKeys,
          rowValues
        );

        try {
          await data_accessor_delete.deleteRow();

          Logger.logUserAction(
            loggedInUser || "",
            "Deleted Row",
            "User has deleted a row in the table: " + table.table_name,
            schema?.schema_name || "",
            table.table_name
          );

        } catch (error) {
          if (error) {
            dispatch(displayError(`The row could not be deleted due to dependencies with ${referencedTables}.`));
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
          // position: 'absolute',
          // right: '10px',
          // transform: 'translateY(-50%)',
          // zIndex: 1,
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
        <MdDelete size="1.5em" className="delete-icon" />
      </Button></>);

  }
export default DeleteRowButton;
