import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";
import { Row } from "../virtualmodel/DataAccessor";
import ScriptHandler from "../virtualmodel/ScriptHandler";

const ScriptLoadPopup = ({
  onClose,
  script,
}: {
  onClose: () => void;
  script: Row | null;
}) => {
  const handleConfirm = async () => {
    if (script) {
      const handler = new ScriptHandler(script);

      await handler.init();
      const new_data = await handler.executeScript();

      console.log(new_data);
    }
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
          Confirm Script Execution
        </Typography>
        <Typography variant="subtitle1" component="h6" mb={2}>
          Are you sure you want to execute the script "{script?.["name"]}"?
        </Typography>
        <Typography variant="subtitle1">Description:</Typography>
        <Typography variant="body2" component="p">
          {script?.["description"]}
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
