import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	ModalProps,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
//
import "../../../styles/Modals.css";
import "../../../styles/UserManagementTab.css";
import vmd from "../../../virtualmodel/VMD";
import { Row } from "../../../virtualmodel/DataAccessor";
import MultiSelect from "../MultiSelect";
import { FunctionAccessor } from "../../../virtualmodel/FunctionAccessor";
import { Role } from "../../../redux/AuthSlice";

import { ErrMsg } from "../../../enums/ErrMsg";
import validator from "validator";
import { AxiosError } from "axios";
import { AuthState } from "../../../redux/AuthSlice";
import { RootState } from "../../../redux/Store";
import { useSelector } from "react-redux";
import Audits from "../../../virtualmodel/Audits";

interface AddUserModalProps extends Omit<ModalProps, "children"> {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	getUsers: () => Promise<void>;
}

//Button style to match the rest of modals

const buttonStyle = {
	marginRight: 10,
	backgroundColor: "#404040",
	color: "white",
};

// Modal component allowing a user to be added to the database
const AddUserModal: React.FC<AddUserModalProps> = ({
	setOpen,
	getUsers,
	...props
}) => {
	// Input values of the modal
	const defaultInputValues = { role: "user" };
	const [inputValues, setInputValues] = useState<Row>(defaultInputValues);
	const { user: loggedInUser }: AuthState = useSelector(
		(state: RootState) => state.auth
	);
	const [emailError, setEmailError] = useState<string>("");

	// Role selection state
	const [role, setRole] = useState("user");

	// Schema Access List state
	const [schemaAccessList, setSchemaAccessList] = useState<string[]>([]);
	const schemaNames = vmd
		.getApplicationSchemas()
		.map((schema) => schema.schema_name);
	// const schemaNames = vmd.getSchemas().map((schema) => schema.schema_name);

	// Handles updating the input values with the schemaAccessList
	useEffect(() => {
		const newInput = {
			...inputValues,
			schema_access: `{${schemaAccessList.join(", ")}}`, // Formats the schema access list into the postgresql array format
		};
		setInputValues(newInput);
	}, [schemaAccessList]);

	// Handles change in input field
	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newInput = {
			...inputValues,
			[e.target.name]: e.target.value,
		};
		setInputValues(newInput);
	}

	function handleRoleChange(e: SelectChangeEvent<string>) {
		setRole(e.target.value);
		handleInputChange(e as React.ChangeEvent<HTMLInputElement>);
	}

	function resetModal() {
		setInputValues(defaultInputValues);
		setRole("user");
		handleClose();
	}

	// Handles modal close
	function handleClose() {
		setOpen(false);
	}

	// Handles adding a user
	function handleFormSubmit() {
		if (!validateEmail()) {
			return;
		}
		// Function accessor
		const functionAccessor: FunctionAccessor = vmd.getFunctionAccessor(
			"meta",
			"create_user"
		);
		functionAccessor.setBody(inputValues);
		functionAccessor
			.executeFunction()
			.then((response) => {
				console.log("User " + inputValues["email"] + " created successfully");
				getUsers();
				resetModal();
			})
			.catch((error: AxiosError) => {
				console.log(error);
				if (error.response?.status === 409) {
					setEmailError(ErrMsg.USER_ALREADY_EXISTS);
				}
				console.error(
					"An error occured while creating user " + inputValues["email"]
				);
			});

		Audits.logAudits(
			loggedInUser || "",
			"Create New User",
			"Create User " +
				inputValues["email"] +
				" with role " +
				inputValues["role"] +
				" and schema access " +
				inputValues["schema_access"],
			"",
			""
		);
	}

	function validateEmail(): boolean {
		setEmailError("");
		if (!inputValues.email || inputValues.email.trim() === "") {
			setEmailError(ErrMsg.MISSING_FIELD);
			return false;
		} else if (!validator.isEmail(inputValues.email)) {
			setEmailError(ErrMsg.INVALID_EMAIL);
			return false;
		} else {
			return true;
		}
	}

	// All the props from AddUserModal are directly passed down to the Modal component
	return (
		<Modal onClose={handleClose} {...props}>
			<Box className='modal-container-center' style={{ borderRadius: "10px" }}>
				<div className='modal-content'>
					<Typography variant='h5'>Add new user</Typography>
					<div className='form'>
						<TextField
							id='email-field'
							label='Email'
							variant='outlined'
							onChange={handleInputChange}
							name='email'
							helperText={emailError}
							error={emailError === "" ? false : true}
							className='textField'
						/>
						<FormControl fullWidth>
							<InputLabel id='role-label'>Role</InputLabel>
							<Select
								labelId='role-label'
								name='role'
								value={role}
								onChange={(event) => handleRoleChange(event)}
								variant='outlined'
								label='Role'>
								<MenuItem value={Role.USER}>User</MenuItem>
								<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
								<MenuItem value={Role.ADMIN}>Admin</MenuItem>
							</Select>
						</FormControl>
						<FormControl>
							<InputLabel id='schema-access-label'>Schema Access</InputLabel>
							<MultiSelect
								selectedList={schemaAccessList}
								setSelectedList={setSchemaAccessList}
								choiceList={schemaNames}
								labelId='schema-access-label'
								label='Schema Access'
							/>
						</FormControl>
					</div>
					<div
						className='button-container'
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "flex-end",
						}}>
						<Button
							variant='contained'
							onClick={handleClose}
							style={buttonStyle}>
							Cancel
						</Button>
						<Button
							variant='contained'
							onClick={handleFormSubmit}
							style={buttonStyle}>
							Add
						</Button>
					</div>
				</div>
			</Box>
		</Modal>
	);
};

export default AddUserModal;
