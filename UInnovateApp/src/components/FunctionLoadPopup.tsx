import { Modal, Box, Typography, Button } from "@mui/material";
import "../styles/AddEnumModal.css";
import { Row } from "../virtualmodel/DataAccessor";
import FunctionHandler from "../virtualmodel/FunctionHandler";
import { FunctionErrorPopup, FunctionSuccessPopup } from "./FunctionPopup";
import { useState, useEffect } from "react";

const FunctionLoadPopup = ({
    onClose,
    function: func,
}: {
    onClose: () => void;
    function: Row | null;
}) => {
    const [error, setError] = useState<Error | null>(null);
    const [success, setSuccess] = useState(false);

    const handleClose = () => {
        setError(null);
        setSuccess(false);
        window.location.reload();
    };

    const handleConfirm = async () => {
        if (func) {
            const handler = new FunctionHandler(func);

            // Executing Function
            try {
                await handler.init();
                await handler.executeFunction();

                setSuccess(true);
            } catch (error) {
                console.error("Error executing function:", error);
                setError(error as Error);

                return;
            }
        }
    };

    useEffect(() => {}, [error, success, onClose]);

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
        <>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h5" component="h2">
                        Confirm Function Execution
                    </Typography>
                    <Typography variant="subtitle1" component="h6" mb={2}>
                        Are you sure you want to execute the function "{func?.["name"]}"?
                    </Typography>
                    <Typography variant="subtitle1">Description:</Typography>
                    <Typography variant="body2" component="p">
                        {func?.["description"]}
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
            {error ? <FunctionErrorPopup onClose={handleClose} error={error} /> : null}
            {success ? <FunctionSuccessPopup onClose={handleClose} /> : null}
        </>
    );
};

export default FunctionLoadPopup;