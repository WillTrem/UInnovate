import { Modal, Box, Button, ModalProps, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import "../../styles/Modals.css"
import { Row } from "../../virtualmodel/DataAccessor";
import { FunctionAccessor } from "../../virtualmodel/FunctionAccessor";
import vmd from "../../virtualmodel/VMD";


// interface SignUpModalProps extends Omit<ModalProps,'children'>{
// 	closeModal: () => void
// }


/**
 * Used to describe the current state of the signup menu.
 */
enum SignupState {
	INITIAL, LOGIN, SIGNUP
};

const USER_NOT_FOUND_CODE = "42704";
const USER_NEVER_SIGNED_UP_CODE = "01000";

/**
 * Modal for either signing up or logging in the system in an interactive manner.
 * @param props Same props as the MUI's Modal, ommiting the children.
 */
const SignUpModal: React.FC<Omit<ModalProps, 'children'>> = (props) => {
	const [inputValues, setInputValues] = useState<Row>({})
	const [currentState, setCurrentState] = useState<SignupState>(SignupState.INITIAL);


	

	// Function accessors
	const verifySignUpFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "verify_signup");
	const signUpFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "signup");
	const loginFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "login");

	// Reset the state's values
	const resetValues = () => {
		setInputValues({});
		setCurrentState(SignupState.INITIAL);
	}

	// Cancels and closes the form
	const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.onClose && props.onClose(event, "escapeKeyDown");
		resetValues();
	}

	// Handles change in input field
	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newInput = {
			...inputValues,
			[e.target.name]: e.target.value,
		}
		setInputValues(newInput);
	};

	/**
	 * Changes the state of the signup depending on the result from the verify_signup db function execution
	 */
	const handleNext = () => {
		verifySignUpFunctionAccessor.setBody({ email: inputValues["email"] })
		verifySignUpFunctionAccessor.executeFunction({
			validateStatus: function (status: number) {
			  // Return `true` to resolve the promise if the status code is equal to 400
			  return status === 400;
			}
		  })
			.then((response) => {
				console.log(response);
				if(response.status === 400){
					const code = response.data.code;
					switch(code){
						case USER_NOT_FOUND_CODE: //TODO
						break;
						case USER_NEVER_SIGNED_UP_CODE: setCurrentState(SignupState.SIGNUP);
						break;
					}
				}
				else{
					setCurrentState(SignupState.LOGIN);
				}
			})
			
	}

	// Resets the state back to INITIAL
	const handleBack = () => setCurrentState(SignupState.INITIAL);

	const handleFormSubmit = () => {

	}

	return <Modal {...props}>
		<Box className='modal-container' component="form" >
			<div className="modal-content-center">
				<Typography variant="h5">Sign up (or Log in)</Typography>
				<div className="form">
					<TextField id="email-field" label="Email" variant="outlined" onChange={handleInputChange} name="email" />
					
					{/* Shows First Name and Last Name fields on signup */}
					{currentState === SignupState.SIGNUP &&
						<>
						<TextField id="first-name-field" label="First Name" variant="outlined" onChange={handleInputChange} name="first_name" />
						<TextField id="last-name-field" label="Last Name" variant="outlined" onChange={handleInputChange} name="last_name" />
						</>
					}

					{/* Shows Password field on both login and signup */}
					{currentState !== SignupState.INITIAL && 
						<TextField id="password-field" label="Password" type="password" variant="outlined" onChange={handleInputChange} name="password" />}

					{/* Shows Confirm Password field on signup */}
					{currentState === SignupState.SIGNUP &&
						<TextField id="confirm-password-field" label="Confirm Password" type="password" variant="outlined" onChange={handleInputChange} name="confirm_password" />
					}
				</div>
				<div className="button-container-wide">
					<Button variant="contained"
						onClick={handleCancel}
						sx={{ backgroundColor: "#404040" }}>
						Cancel
					</Button>
					{/* If in Login or Signup state, display login/signup button. Otherwise, display the 'next' button. */}
					{currentState !== SignupState.INITIAL ? 
					(<>
					<Button
						variant="contained"
						onClick={handleBack}
						sx={{ backgroundColor: "#404040" }}>
						Back
					</Button>
					<Button
						variant="contained"
						onClick={handleFormSubmit}
						sx={{ backgroundColor: "#404040" }}>
						{currentState === SignupState.LOGIN ? "Log in" : "Sign up"}
					</Button>
					</>)
					: 
					(<Button
						variant="contained"
						onClick={handleNext}
						sx={{ backgroundColor: "#404040" }}>
						Next
					</Button>)}
				</div>
			</div>
		</Box>
	</Modal>
}

export default SignUpModal;