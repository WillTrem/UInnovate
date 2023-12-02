import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";
import { useState } from "react";
import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import vmd, { Column, Table } from "../virtualmodel/VMD";

const AddRowPopup = ({
  onClose,
  table,
  columns,
}: {
  onClose: () => void;
  table: Table;
  columns: Column[];
}) => {
  const [inputValues, setInputValues] = useState<Row>(new Row({}));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      row: { ...inputValues.row, [e.target.name]: e.target.value },
    });
  };

  const handleFormSubmit = () => {
    const schema = vmd.getTableSchema(table.table_name);
    if (!schema) {
      console.error("Could not find schema for table ", table.table_name);
      return;
    }

    const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
      schema?.schema_name,
      table.table_name,
      inputValues
    );

    data_accessor.addRow();
    onClose();
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
    borderRadius: 8,
    boxShadow: 24,
    p: 4,
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
            return (
              <div key={column.column_name} style={{ marginBottom: 10 }}>
                <label key={idx} style={labelStyle}>
                  {column.column_name}
                  <input
                    type="text"
                    name={column.column_name}
                    style={inputStyle}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            );
          })}
        </div>
        <div>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            style={buttonStyle}
          >
            Save Changes
          </Button>
          <Button variant="contained" onClick={onClose} style={buttonStyle}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default AddRowPopup;
