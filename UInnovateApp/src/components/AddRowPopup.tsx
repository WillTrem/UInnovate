import { Modal, Box, Typography, Button } from "@mui/material";

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
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography>Adding a new Enumerated type</Typography>
        <form>
          {columns.map((column: string) => {
            return (
              <div>
                <label>
                  {column}
                  <input type="text" name={column} />
                </label>
              </div>
            );
          })}
        </form>
        <Button onClick={handleFormSubmit}>Save Changes</Button>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default AddRowPopup;
