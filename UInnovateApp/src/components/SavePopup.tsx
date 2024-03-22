import { Modal, Box, Typography, Button } from '@mui/material';

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


const ConfirmationPopup = ({ open, title, message, onConfirm, onCancel }) => {
    return (
      <Modal open={open} onClose={onCancel} aria-labelledby="confirmation-dialog-title">
        <Box sx={style}>
          <Typography id="confirmation-dialog-title" variant="h6">{title}</Typography>
          <Typography sx={{ mt: 2 }}>{message}</Typography>
          <Button  variant="contained" onClick={onConfirm} sx={buttonStyle}>Yes</Button>
          <Button  variant="contained" onClick={onCancel} sx={buttonStyle}>No</Button>
        </Box>
      </Modal>
    );
  };
  
export default ConfirmationPopup;
