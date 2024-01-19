import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";
import { Row } from "../virtualmodel/DataAccessor";

const ScriptLoadPopup = ({
  onClose,
  script,
}: {
  onClose: () => void;
  script: Row;
}) => {
  const handleConfirm = () => {
    // TODO: Load script
  };

  onClose();

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

  //   const labelStyle = {
  //     display: "block",
  //     marginBottom: 5,
  //     color: "#000000",
  //   };

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
        <Typography variant="h5" component="h2">
          Load Script
        </Typography>
        <Typography variant="body2" component="p">
          Are you sure you want to load the script {script["name"]}?
        </Typography>
        <div className="button-container">
          <Button
            variant="contained"
            color="primary"
            sx={buttonStyle}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={buttonStyle}
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ScriptLoadPopup;
