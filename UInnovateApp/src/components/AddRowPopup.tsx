import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  Menu,
  MenuItem,
} from "@mui/material";
import "../styles/AddEnumModal.css";
import { useEffect, useRef, useState } from "react";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import vmd, { Column, Table } from "../virtualmodel/VMD";
import Logger from "../virtualmodel/Logger";
import { AuthState } from "../redux/AuthSlice";
import { RootState } from "../redux/Store";
import { useSelector } from "react-redux";

const AddRowPopup = ({
  getRows,
  onClose,
  table,
  columns,
}: {
  getRows: () => void;
  onClose: () => void;
  table: Table;
  columns: Column[];
}) => {
  const [inputValues, setInputValues] = useState<Row>(new Row({}));
  const { user: loggedInUser }: AuthState = useSelector(
    (state: RootState) => state.auth
  );
  const [displayField, setdisplayField] = useState<string[]>([]);
  const [Rows, setRows] = useState<Row[][] | undefined>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    {}
  );
  const selectCountRef = useRef(-1);

  useEffect(() => {
    getForeignKeys();
  }, [columns]);

  // this is for the values of the foreign keys
  const getForeignKeys = async () => {
    const newDisplayFields = [];
    const newRows = [];

    for (const column of columns) {
      if (
        column.references_table != null &&
        column.references_table != "filegroup"
      ) {
        const schema = vmd.getTableSchema(column.references_table);

        if (!schema) {
          console.error(
            "Could not find schema for table ",
            column.references_table
          );
          continue;
        }

        const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
          schema.schema_name,
          column.references_table
        );
        const rows = await data_accessor.fetchRows();

        if (!rows) {
          console.error("Could not fetch rows");
          continue;
        }

        const display_field = await vmd.getTableDisplayField(
          schema.schema_name,
          column.references_table
        );
        newDisplayFields.push(display_field as string);
        newRows.push(rows);
      }
    }

    setdisplayField(newDisplayFields);
    setRows(newRows);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      row: { ...inputValues.row, [e.target.name]: e.target.value },
    });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<{ name?: string; value: number }>
  ) => {
    const value = e.target.value;
    const name = e.target.name;

    setInputValues({
      ...inputValues,
      row: {
        ...inputValues.row,
        [e.target.name as string]: e.target.value as unknown as string,
      },
    });

    setSelectedValues((prevValues) => ({
      ...prevValues,
      [name as string]: value,
    }));
  };

  const handleFormSubmit = () => {
    const schema = vmd.getTableSchema(table.table_name);

    if (!schema) {
      console.error("Could not find schema for table ", table.table_name);
      return;
    }

    Logger.logUserAction(
      loggedInUser || "",
      "Add Row",
      "Added a new row with the following values: " +
        JSON.stringify(inputValues.row),
      schema?.schema_name || "",
      table.table_name
    );

    const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
      schema?.schema_name,
      table.table_name,
      inputValues.row as Row
    );
    data_accessor.addRow();

    onClose();
    getRows();
  };

  const style = {
    position: "absolute",
    margin: "auto",
    padding: 3,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "#f1f1f1",
    border: "2px solid #000",
    // borderRadius: 8,
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflow: "auto",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 5,
    color: "#000000",
  };

  const inputStyle = {
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ccc",
  };

  const selectStyle = {
    width: "100%",
    borderRadius: 0,
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      data-testid="modal-row-popup"
    >
      <Box sx={style}>
        {/* Verify if we need a modal for the Enum Type or the List Type to display the title */}
        {table.table_display_type === "enum" ? (
          <Typography variant="h5">Adding a new Enumerated type</Typography>
        ) : (
          <Typography variant="h5">Adding a new List type</Typography>
        )}
        <div className="addEnum">
          {columns.map((column: Column, idx) => {
            if (
              column.references_table != null &&
              column.references_table != "filegroup"
            ) {
              selectCountRef.current += 1;
            }
            const count = selectCountRef.current % displayField.length;
            return (
              <div key={column.column_name} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label key={idx} style={labelStyle}>
                    {column.references_table != null &&
                    column.references_table != "filegroup"
                      ? column.references_table
                      : column.column_name}
                  </label>
                </div>
                <div>
                  {column.references_table != null &&
                  column.references_table != "filegroup" ? (
                    <Select
                      name={column.column_name}
                      sx={selectStyle}
                      value={selectedValues[column.column_name] || -1}
                      onChange={handleSelectChange}
                      data-testid="select-field"
                    >
                      <MenuItem value={-1}>None</MenuItem>

                      {displayField[count] &&
                        Rows &&
                        Rows[count] &&
                        Rows[count].map((row, index) => (
                          <MenuItem
                            key={index}
                            value={row[column.references_by]}
                            data-testid="select-field-item"
                          >
                            {row[displayField[count]]}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : (
                    <input
                      type="text"
                      name={column.column_name}
                      style={inputStyle}
                      onChange={handleInputChange}
                      data-testid="input-field"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            style={buttonStyle}
            data-testid="submit-button"
          >
            Save Changes
          </Button>
          <Button 
          variant="contained" 
          onClick={onClose} 
          style={buttonStyle}
          data-testid="close-button"
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddRowPopup;
