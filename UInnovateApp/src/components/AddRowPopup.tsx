import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";
import { useState } from "react";
import { addTypeToEnum } from "../virtualmodel/AddEnumType";

const AddRowPopup = ({
  onClose,
  table,
  columns,
}: {
  onClose: () => void;
  table: string;
  columns: string[];
}) => {
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    addTypeToEnum(table, inputValues);
  };

  const style = {
    position: "absolute",
    margin: "auto",
    padding: 3,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
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
    marginLeft: 10,
    padding: 8,
    borderRadiu: 4,
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
        <Typography variant="h5">Adding a new Enumerated type</Typography>
        <div className="addEnum">
          {columns.map((column: string) => {
            return (
              <div key={column + "Div"} style={{ marginBottom: 10 }}>
                <label key={column} style={labelStyle}>
                  {column}
                  <input
                    key={column + "Input"}
                    type="text"
                    name={column}
                    style={inputStyle}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            );
          })}
        </div>
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
      </Box>
    </Modal>
  );
};

export default AddRowPopup;
