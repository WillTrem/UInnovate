import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";

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

const ScriptErrorPopup = ({
  onClose,
  error,
}: {
  onClose: () => void;
  error: string | Error;
}) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Error
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          It seems that an error occurred while trying to execute the script.
          <br />
          {error.toString()}
        </Typography>
        <Button variant="contained" style={buttonStyle} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const ScriptSuccessPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Success
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Your script was successfully executed.
        </Typography>
        <Button variant="contained" style={buttonStyle} onClick={onClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export { ScriptErrorPopup, ScriptSuccessPopup };
