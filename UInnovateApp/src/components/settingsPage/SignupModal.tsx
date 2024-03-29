import { Modal, Box, Button, ModalProps, Typography, TextField, TextFieldProps, InputLabel, FormControl, OutlinedInput, IconButton, InputAdornment, FormHelperText, breadcrumbsClasses } from "@mui/material";
import React, { useState } from "react";
import "../../styles/Modals.css"
import { Row } from "../../virtualmodel/DataAccessor";
import { FunctionAccessor } from "../../virtualmodel/FunctionAccessor";
import vmd from "../../virtualmodel/VMD";
import validator from 'validator';
import { useDispatch, useSelector } from "react-redux";
import { logIn, updateDefaultRole, updateSchemaRoles } from "../../redux/AuthSlice";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff, Check, Close, NavigateNext, NavigateBefore } from '@mui/icons-material';
import { green, grey } from '@mui/material/colors';
import { ErrMsg } from "../../enums/ErrMsg";
import { setLoading } from "../../redux/LoadingSlice";
import { getDefaultRole, getSchemaRoles } from "../../helper/RolesHelpers";

const LENGTH_REGEX = new RegExp(/.{8,}$/);
const UPPERCASE_REGEX = new RegExp(/.*[A-Z]/);
const NUMBER_REGEX = new RegExp(/.*\d/);
const SPECIAL_CHARS_REGEX = new RegExp(/.*[-'/`~!#*$@_%+=.,^&(){}[\]|;:"<>?\\]/);
const PASSWORD_VALID_REGEX = new RegExp(
	`^(?=${[
		LENGTH_REGEX.source,
		UPPERCASE_REGEX.source,
		NUMBER_REGEX.source,
		SPECIAL_CHARS_REGEX.source
	].join(")(?=")}).*$`);

const REGEX_LIST = [
	{ label: "min. 8 characters ", regexp: LENGTH_REGEX },
	{ label: "1 uppercase character", regexp: UPPERCASE_REGEX },
	{ label: "1 number", regexp: NUMBER_REGEX },
	{ label: "1 special character", regexp: SPECIAL_CHARS_REGEX }
]

/**
 * Used to describe the current state of the signup menu.
 */
enum SignupState {
	INITIAL, LOGIN, SIGNUP, SIGNUP_SUCCESSFUL
};
const USER_NOT_FOUND_CODE = "42704";
const USER_NEVER_SIGNED_UP_CODE = "01000";
const USER_DEACTIVATED_CODE = "01100";


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

	// Reset the inputValues state's values
	const resetValues = () => setInputValues({});

	function resetErrorMessages() {
		//Reset Error Message states
		setEmailError("");
		setPasswordError("");
		setFirstNameError("");
		setLastNameError("");
		setConfirmPasswordError("");
	}

	// Cancels and closes the form
	const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.onClose && props.onClose(event, "escapeKeyDown");
		setCurrentState(SignupState.INITIAL);
		resetValues();
		resetErrorMessages();
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

		if (!validateUserInput()) {
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
						case USER_DEACTIVATED_CODE: setEmailError(ErrMsg.USER_DEACTIVATED);
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
	const handleBack = () => {
		setCurrentState(SignupState.INITIAL);
		setInputValues({ email: inputValues.email })
	}

	const handleFormSubmit = () => {
		if (!validateUserInput()) {
			return;
		}

		const loginFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "login");
		const signUpFunctionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "signup");

		if (currentState === SignupState.LOGIN) {
			loginFunctionAccessor.setBody(inputValues);
			loginFunctionAccessor.executeFunction({ withCredentials: true })
				// Logs in the user
				.then(async (response) => {
					dispatch(setLoading(true));
					const token = response.data.token;
					dispatch(logIn(token));
					navigate('/');
					await vmd.refetchSchemas();
					const schemaRoles = await getSchemaRoles(inputValues.email);
					dispatch(updateSchemaRoles(schemaRoles));
					
					const defaultRole = await getDefaultRole(inputValues.email);
					dispatch(updateDefaultRole(defaultRole));

					// Closes the form
					const dummyEvent = document.createEvent('MouseEvents');
					handleCancel(dummyEvent as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>);
					dispatch(setLoading(false));
				})
				.catch(() => {
					setPasswordError(ErrMsg.WRONG_PASSWORD);
				});
		}
		else if (currentState === SignupState.SIGNUP) {
			// Removing confirm password value from the sent input fields
			const { confirm_password, ...signupInputValues } = inputValues;
			signUpFunctionAccessor.setBody(signupInputValues);
			signUpFunctionAccessor.executeFunction({ withCredentials: true })
				.then(() => {
					setCurrentState(SignupState.SIGNUP_SUCCESSFUL);
					resetValues();
				});
		}
	}

	const validateUserInput = (): boolean => {
		
		resetErrorMessages();

		//Validate Credentials based on the current state of the signup
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
				// Missing field validation
				if (!inputValues['first_name'] || inputValues['first_name'].trim() === '') {
					setFirstNameError(ErrMsg.MISSING_FIELD);
					return false;
				}
				else if (!inputValues['last_name'] || inputValues['last_name'].trim() === '') {
					setLastNameError(ErrMsg.MISSING_FIELD);
					return false;
				}
				else if (!inputValues['password'] || inputValues['password'].trim() === '') {
					setPasswordError(ErrMsg.MISSING_FIELD);
					return false;
				}
				else if (!inputValues['confirm_password'] || inputValues['confirm_password'].trim() === '') {
					setConfirmPasswordError(ErrMsg.MISSING_FIELD);
					return false;
				}

				// Password strength requirements validation
				if (!PASSWORD_VALID_REGEX.test(inputValues['password'])) {
					setPasswordError(ErrMsg.INSECURE_PASSWORD);
					// Reset the confirm password field
					setInputValues({ ...inputValues, confirm_password: "" });
					return false;
				}

				// Confirmation password matches the password
				if (inputValues['password'] !== inputValues['confirm_password']) {
					setConfirmPasswordError(ErrMsg.NO_MATCH_CONFIRM_PASSWORD);
					return false;
				}
				else {
					return true;
				}
			default:
				return true
		}
	};

	const initialFormContent =
		<>
			<TextField id="email-field"
				label="Email"
				variant="outlined"
				onChange={handleInputChange}
				onKeyDown={handleEmailKeyDown}
				name="email"
				helperText={emailError}
				error={emailError === "" ? false : true}
				className="textField" />
		</>

	const signupFormContent =
		<>
			<TextField id="email-field"
				label="Email"
				variant="outlined"
				onChange={handleInputChange}
				onKeyDown={handleEmailKeyDown}
				name="email"
				helperText={emailError}
				error={emailError === "" ? false : true}
				className="textField"
				disabled />

			{/* Shows First Name and Last Name fields on signup */}
			<TextField id="first-name-field"
				label="First Name"
				variant="outlined"
				onChange={handleInputChange}
				name="first_name"
				autoFocus
				helperText={firstNameError}
				error={firstNameError === "" ? false : true}
				className="textField"
				required />
			<TextField id="last-name-field"
				label="Last Name"
				variant="outlined"
				onChange={handleInputChange}
				name="last_name"
				helperText={lastNameError}
				error={lastNameError === "" ? false : true}
				className="textField"
				required />
			{/* Shows Password field on both login and signup */}
			<PasswordField id="password-field"
				label="Password"
				type="password"
				onChange={handleInputChange}
				onKeyDown={handlePasswordKeyDown}
				name="password"
				helperText={passwordError}
				error={passwordError === "" ? false : true}
				className="textField"
				required={currentState === SignupState.SIGNUP}
				validateStrength />

			{/* Shows Confirm Password field on signup */}
			<PasswordField id="confirm-password-field"
				label="Confirm Password"
				type="password"
				onChange={handleInputChange}
				name="confirm_password"
				helperText={confirmPasswordError}
				error={confirmPasswordError === "" ? false : true}
				className="textField"
				value={inputValues["confirm_password"]}
				required />
		</>

	const loginFormContent =
		<>
			<TextField id="email-field"
				label="Email"
				variant="outlined"
				onChange={handleInputChange}
				onKeyDown={handleEmailKeyDown}
				name="email"
				helperText={emailError}
				error={emailError === "" ? false : true}
				className="textField"
				disabled />

			<PasswordField id="password-field"
				label="Password"
				type="password"
				onChange={handleInputChange}
				onKeyDown={handlePasswordKeyDown}
				name="password"
				autoFocus
				helperText={passwordError}
				error={passwordError === "" ? false : true}
				className="textField" />
		</>

	const signupSuccessfulFormContent =
		<>
			<Typography variant='body1' align="center">Sign up has been done successfully. <br />
				You can now log in using your credentials.</Typography>
			<Button variant="contained"
				onClick={handleBack}
				sx={{ backgroundColor: "#404040" }}>
				Log in
			</Button>
		</>

	return <Modal {...props} onClose={handleCancel} >
		<Box className='modal-container-center' component="form" >
			<div className="modal-content-center">
				<Typography variant="h5">
					{currentState === SignupState.INITIAL
						? "Sign up (or Log in)"
						: currentState === SignupState.LOGIN
							? "Log in"
							: "Sign up"}
				</Typography>
				<div className="form">
					{currentState === SignupState.INITIAL
						? initialFormContent
						: currentState === SignupState.LOGIN
							? loginFormContent
							: currentState === SignupState.SIGNUP
								? signupFormContent
								: signupSuccessfulFormContent}
				</div>
				<div className="button-container-wide" hidden={currentState === SignupState.SIGNUP_SUCCESSFUL}>
					<Button variant="contained"
						onClick={handleCancel}
						sx={{ backgroundColor: "#404040" }}>
						Cancel
					</Button>
					{/* If in Login or Signup state, display login/signup button. Otherwise, display the 'next' button. */}
					{currentState === SignupState.LOGIN || currentState === SignupState.SIGNUP
						?
						(<Box display="flex" justifyContent="end" gap={"16px"}>
							<Button
								variant="contained"
								onClick={handleBack}
								sx={{ backgroundColor: "#404040" }}
								data-testid='back-button'>
								<NavigateBefore />
							</Button>
							<Button
								variant="contained"
								onClick={handleFormSubmit}
								sx={{ backgroundColor: "#404040" }}>
								{currentState === SignupState.LOGIN ? "Log in" : "Sign up"}
							</Button>
						</Box>)
						: currentState === SignupState.INITIAL &&
						(<Button
							variant="contained"
							onClick={handleNext}
							sx={{ backgroundColor: "#404040" }}
							data-testid='next-button'>
							<NavigateNext />
						</Button>)
					}
				</div>
			</div>
		</Box>
	</Modal>
}

interface PasswordFieldProps extends Omit<TextFieldProps, 'variant'> {
	validateStrength?: boolean
}
/**
 * Custom password text field component
 */
const PasswordField: React.FC<PasswordFieldProps> = ({ validateStrength = false, ...props }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [isSelected, setSelected] = useState(false);
	const [value, setValue] = useState("");
	const isPasswordValid = PASSWORD_VALID_REGEX.test(value);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		props.onChange && props.onChange(e);
		setValue(e.target.value);

	}
	return <FormControl variant="outlined"
		className={props.className}
		error={props.error && !isPasswordValid}
		id={props.id}
		required={props.required}
		sx={props.sx}
		onKeyDown={props.onKeyDown}
	>
		<InputLabel>{props.label}</InputLabel>
		<OutlinedInput
			type={showPassword ? 'text' : 'password'}
			onChange={handleChange}
			name={props.name}
			value={props.value}
			autoFocus={props.autoFocus}
			onFocus={() => setSelected(true)}
			onBlur={() => setSelected(false)}
			endAdornment={
				<InputAdornment position="end" >
					<IconButton
						onMouseDown={() => setShowPassword(true)}
						onMouseUp={() => setShowPassword(false)}
						edge="end"
						tabIndex={-1}>
						{showPassword ? <VisibilityOff /> : <Visibility />}
					</IconButton>
				</InputAdornment>
			}
			label={props.label}
			data-testid="password-field"
		/>
		{validateStrength
			?
			// If the Password field is selected or there is an error with the password, show the strength validation 
			<>{(isSelected || (props.error && !isPasswordValid))
				&&
				REGEX_LIST.map(({ label, regexp }) => {
					const patternMatched = regexp.test(value);
					return <Box key={label} display='flex' flex-direction='row' justifyContent='space-between'>
						<FormHelperText
							error={props.error && !patternMatched}
							sx={{ color: patternMatched ? green[800] : grey[400] }} >
							{label}
						</FormHelperText>
						{patternMatched && <Check sx={{ color: green[800] }} />}
						{!patternMatched && props.error && <Close color="error" />}
					</Box>
				})}
			</>
			:
			<FormHelperText>{props.helperText}</FormHelperText>

		}

	</FormControl>
}

export default SignupModal;