import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";

const AddRowPopup = ({
  onClose,
  columns,
  rows,
}: {
  onClose: () => void;
  columns: string[];
  rows: string[][];
}) => {
  const handleFormSubmit = () => {
    onClose();
  };

  function alreadyExists(rowId: string) {
    return true;
  }

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
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>
                  {column}
                  <input type="text" name={column} style={inputStyle} />
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
