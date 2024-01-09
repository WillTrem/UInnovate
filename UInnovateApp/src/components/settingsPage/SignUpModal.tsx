import { Modal, Box, Button, ModalProps, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import "../../styles/Modals.css"
import { Row } from "../../virtualmodel/DataAccessor";


// interface SignUpModalProps extends Omit<ModalProps,'children'>{
// 	closeModal: () => void
// }

const SignUpModal: React.FC<Omit<ModalProps, 'children'>> = (props) => {
	const [inputValues, setInputValues] = useState<Row>({})

	const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => props.onClose && props.onClose(event, "escapeKeyDown")

	return <Modal {...props}>
		<Box className='modal-container'>
			<div className="modal-content-center">
				<Typography variant="h5">Sign Up (or Login)</Typography>
				<div className="form">
					{/* <div style={{ marginBottom: 10 }}>
						<label>
							Email
							<input
								type="text"
								name="email"
							// onChange={handleInputChange}
							/>
						</label>
					</div> */}
					<TextField id="outlined-basic" label="Email" variant="outlined" />
				</div>
				<div className="button-container-wide">
					<Button variant="contained"
						onClick={handleCancel}
						sx={{ backgroundColor: "#404040" }}>
						Cancel
					</Button>
					<Button
						variant="contained"
						// onClick={handleFormSubmit}
						sx={{ backgroundColor: "#404040" }}>
						Next
					</Button>
				</div>
			</div>
		</Box>
	</Modal>
}

export default SignUpModal;