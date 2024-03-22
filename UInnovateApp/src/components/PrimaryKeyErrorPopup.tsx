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


  const InfoPopup = ({ open, message, onClose }) => {
    return (
      <Modal open={open} onClose={onClose} aria-labelledby="info-popup-title">
        <Box sx={style}>
          <Typography id="info-popup-title" variant="h6" component="h2">
            Information
          </Typography>
          <Typography sx={{ mt: 2 }}>
            {message}
          </Typography>
          <Button variant="contained" style={buttonStyle} onClick={onClose}>
            Close
          </Button>
        </Box>
      </Modal>
    );
  };
export default InfoPopup;
