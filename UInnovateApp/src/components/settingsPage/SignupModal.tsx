import { Modal, Box, Button, ModalProps, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import "../../styles/Modals.css"
import { Row } from "../../virtualmodel/DataAccessor";
import { FunctionAccessor } from "../../virtualmodel/FunctionAccessor";
import vmd from "../../virtualmodel/VMD";
import validator from 'validator';
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../redux/AuthSlice";
import { useNavigate } from "react-router-dom";

// interface SignUpModalProps extends Omit<ModalProps,'children'>{
// 	closeModal: () => void
// }


/**
 * Used to describe the current state of the signup menu.
 */
enum SignupState {
	INITIAL, LOGIN, SIGNUP
};
enum ErrMsg {
	INVALID_EMAIL = "Invalid email address",
	EMAIL_NOT_FOUND = "Couldn't find your email address in the system",
	WRONG_PASSWORD = "Incorrect password for the given email address",
	INSECURE_PASSWORD = "This password is not strong enough. It should contain at least 8 characters, a number and a special character",
	NO_MATCH_CONFIRM_PASSWORD = "Passwords didn't match",
	MISSING_FIELD = "Missing field"
}

const USER_NOT_FOUND_CODE = "42704";
const USER_NEVER_SIGNED_UP_CODE = "01000";


/**
 * Modal for either signing up or logging in the system in an interactive manner.
 * @param props Same props as the MUI's Modal, ommiting the children.
 */
const SignupModal: React.FC<Omit<ModalProps, 'children'>> = (props) => {
	const [inputValues, setInputValues] = useState<Row>({})
	const [currentState, setCurrentState] = useState<SignupState>(SignupState.INITIAL);
	const [emailError, setEmailError] = useState<string>("");
	const [firstNameError, setFirstNameError] = useState<string>("");
	const [lastNameError, setLastNameError] = useState<string>("");
	const [passwordError, setPasswordError] = useState<string>("");
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

	const navigate = useNavigate();
	const dispatch = useDispatch();

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
		
		if(!validateUserInput()){
			return;
		}
		const verifySignUpFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "verify_signup");
		verifySignUpFunctionAccessor.setBody({ email: inputValues["email"] })
		verifySignUpFunctionAccessor.executeFunction({
			validateStatus: function (status: number) {
				// Return `true` to resolve the promise if the status code is equal to 400 or a regular valid status code
				return (status >= 200 && status < 300) || status === 400;
			}
		})
			.then((response) => {
				if (response.status === 400) {
					const code = response.data.code;
					switch (code) {
						case USER_NOT_FOUND_CODE: setEmailError(ErrMsg.EMAIL_NOT_FOUND);
							break;
						case USER_NEVER_SIGNED_UP_CODE: setCurrentState(SignupState.SIGNUP);
							break;
					}
				}
				else {
					setCurrentState(SignupState.LOGIN);
				}
			})

	}

	// Switches to the next state when Enter key is pressed in email textbox
	const handleEmailKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleNext();
			event.preventDefault();
		}
	}

	// Attempts to login / signup when Enter key is pressed in password textbox
	const handlePasswordKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' && currentState === SignupState.LOGIN) {
			handleFormSubmit();
			event.preventDefault();
		}
	}

	// Resets the state back to INITIAL
	const handleBack = () => setCurrentState(SignupState.INITIAL);

	const handleFormSubmit = () => {
		if(!validateUserInput()){
			return;
		}
		
		const loginFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "login");
		const signUpFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "signup");

		if (currentState === SignupState.LOGIN) {
			loginFunctionAccessor.setBody(inputValues);
			loginFunctionAccessor.executeFunction({withCredentials: true})
				// Logs in the user
				.then(async (response) => {
					const token = response.data.token;
					dispatch(logIn(token));
					await vmd.refetchSchemas();
					// Closes the form
					const dummyEvent = document.createEvent('MouseEvents');
					handleCancel(dummyEvent as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
					navigate('/');
				})
				.catch((error) => {
					setPasswordError(ErrMsg.WRONG_PASSWORD);
				});
		}
		else {
			//TODO
		}
	}

	const validateUserInput = (): boolean => {
		//Reset Error Message states
		setEmailError("");
		setPasswordError("");
		setFirstNameError("");
		setLastNameError("");
		setConfirmPasswordError("");

		//Validate Email
		switch (currentState) {
			case SignupState.INITIAL:
				if (!inputValues.email || inputValues.email.trim() === '') {
					setEmailError(ErrMsg.MISSING_FIELD);
					return false;
				}
				else if (!validator.isEmail(inputValues.email)) {
					setEmailError(ErrMsg.INVALID_EMAIL);
					return false;
				}
				else {
					return true;
				}
			case SignupState.LOGIN:
				if (!inputValues.password || inputValues.password.trim() === '') {
					setPasswordError(ErrMsg.MISSING_FIELD);
					return false;
				}
				else {
					return true;
				}
			case SignupState.SIGNUP:
				//TODO: Implement input validation for signup
				return true;
		}
	};

	return <Modal {...props}>
		<Box className='modal-container' component="form" >
			<div className="modal-content-center">
				<Typography variant="h5">Sign up (or Log in)</Typography>
				<div className="form">
					<TextField id="email-field"
						label="Email"
						variant="outlined"
						onChange={handleInputChange}
						onKeyDown={handleEmailKeyDown}
						name="email"
						helperText={emailError}
						error={emailError === "" ? false : true}
						className="textField" 
						disabled={currentState!==SignupState.INITIAL}/>

					{/* Shows First Name and Last Name fields on signup */}
					{currentState === SignupState.SIGNUP &&
						<>
							<TextField id="first-name-field"
								label="First Name"
								variant="outlined"
								onChange={handleInputChange}
								name="first_name"
								helperText={firstNameError}
								error={firstNameError === "" ? false : true}
								className="textField" />

							<TextField id="last-name-field"
								label="Last Name"
								variant="outlined"
								onChange={handleInputChange}
								name="last_name"
								helperText={lastNameError}
								error={lastNameError === "" ? false : true}
								className="textField" />
						</>
					}

					{/* Shows Password field on both login and signup */}
					{currentState !== SignupState.INITIAL &&
						<TextField id="password-field"
							label="Password"
							type="password"
							variant="outlined"
							onChange={handleInputChange}
							onKeyDown={handlePasswordKeyDown}
							name="password"
							autoFocus={currentState === SignupState.LOGIN}
							helperText={passwordError}
							error={passwordError === "" ? false: true}
							className="textField" />}

					{/* Shows Confirm Password field on signup */}
					{currentState === SignupState.SIGNUP &&
						<TextField id="confirm-password-field"
							label="Confirm Password"
							type="password"
							variant="outlined"
							onChange={handleInputChange}
							name="confirm_password"
							helperText={confirmPasswordError} 
							error={confirmPasswordError === "" ? false: true}
							className="textField"/>
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