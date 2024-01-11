import { Modal, Box, Button, ModalProps, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import "../../styles/Modals.css"
import { Row } from "../../virtualmodel/DataAccessor";
import { FunctionAccessor } from "../../virtualmodel/FunctionAccessor";
import vmd from "../../virtualmodel/VMD";
import Cookies from "js-cookie";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../redux/AuthSlice";

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
const SignupModal: React.FC<Omit<ModalProps, 'children'>> = (props) => {
	const [inputValues, setInputValues] = useState<Row>({})
	const [currentState, setCurrentState] = useState<SignupState>(SignupState.INITIAL);

	const dispatch = useDispatch();

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
			  // Return `true` to resolve the promise if the status code is equal to 400 or a regular valid status code
			  return (status >= 200 && status < 300) || status === 400;
			}
		  })
			.then((response) => {
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

	// Switches to the next state when Enter key is pressed in email textbox
	const handleEmailKeyDown = (event: React.KeyboardEvent) => {
		if(event.key === 'Enter'){
			handleNext();
			event.preventDefault();
		}
	}

	// Attempts to login / signup when Enter key is pressed in password textbox
	const handlePasswordKeyDown = (event: React.KeyboardEvent) => {
		if(event.key === 'Enter' && currentState === SignupState.LOGIN ){
			handleFormSubmit();
			event.preventDefault();
		}
	}

	// Resets the state back to INITIAL
	const handleBack = () => setCurrentState(SignupState.INITIAL);

	const handleFormSubmit = () => {
		if(currentState === SignupState.LOGIN){
			loginFunctionAccessor.setBody(inputValues);
			loginFunctionAccessor.executeFunction()
			// Logs in the user
			.then(async (response) => {
				const token = response.data.token;
				dispatch(logIn(token));

				// Closes the form
				const dummyEvent = document.createEvent('MouseEvents');
				// dummyEvent.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				handleCancel(dummyEvent as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
			})
			.catch((error) => {
				//TODO
			});
		}
		else{
			//TODO
		}
	}

	return <Modal {...props}>
		<Box className='modal-container' component="form" >
			<div className="modal-content-center">
				<Typography variant="h5">Sign up (or Log in)</Typography>
				<div className="form">
					<TextField id="email-field" label="Email" variant="outlined" onChange={handleInputChange} onKeyDown={handleEmailKeyDown} name="email" />
					
					{/* Shows First Name and Last Name fields on signup */}
					{currentState === SignupState.SIGNUP &&
						<>
						<TextField id="first-name-field" label="First Name" variant="outlined" onChange={handleInputChange} name="first_name" />
						<TextField id="last-name-field" label="Last Name" variant="outlined" onChange={handleInputChange} name="last_name" />
						</>
					}

					{/* Shows Password field on both login and signup */}
					{currentState !== SignupState.INITIAL && 
						<TextField id="password-field" label="Password" type="password" variant="outlined" onChange={handleInputChange} onKeyDown={handlePasswordKeyDown} name="password" autoFocus = {currentState === SignupState.LOGIN}/>}

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

export default SignupModal;