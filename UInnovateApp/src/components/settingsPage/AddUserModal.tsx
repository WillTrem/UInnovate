import { Box, Button, MenuItem, Modal, ModalProps, Select, SelectChangeEvent, Typography } from "@mui/material"
import React, { ReactNode, useState } from "react"

import "../../styles/Modals.css"
import "../../styles/UserManagementTab.css"
import vmd from "../../virtualmodel/VMD"
import { Row } from "../../virtualmodel/DataAccessor"
import { MultiSelect } from "./UserMangementTab"
import { FunctionAccessor } from "../../virtualmodel/FunctionAccessor"
import { Role } from "../../redux/AuthSlice"


interface AddUserModalProps extends Omit<ModalProps, 'children'> {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
	getUsers: () => Promise<void>
}
// Modal component allowing a user to be added to the database
const AddUserModal: React.FC<AddUserModalProps> = ({ setOpen, getUsers, ...props }) => {
	// Input values of the modal
	const defaultInputValues = { role: "user" };
	const [inputValues, setInputValues] = useState<Row>(defaultInputValues)

	// Role selection state
	const [role, setRole] = useState("user");

	// Schema Access List state
	const [schemaAccessList, setSchemaAccessList] = useState<string[]>([]);
	const schemaNames = vmd.getSchemas().map((schema) => schema.schema_name);

	// Function accessor
	const functionAccessor: FunctionAccessor = vmd.getFunctionAccessor("meta", "create_user");

	// Handles change in input field
	function handleInputChange(e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) {
		const newInput = {
			...inputValues,
			[e.target.name]: e.target.value,
		}
		setInputValues(newInput);
	};

	function handleRoleChange(e: SelectChangeEvent<string>) {
		setRole(e.target.value);
		handleInputChange(e);
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
		// TODO: Implement function
		functionAccessor.setBody(inputValues);
		functionAccessor.executeFunction()
			.then((response) => {
				console.log("User " + inputValues["email"] + " created successfully");
				getUsers();
				resetModal();
			})
			.catch((error) => {
				console.error("An error occured while creating user " + inputValues["email"]);
			});
	}

	// All the props from AddUserModal are directly passed down to the Modal component
	return <Modal onClose={handleClose} {...props}>
		<Box className='modal-container'>
			<div className="modal-content">
				<Typography variant="h5">Add new user</Typography>
				<div className="form">
					<div style={{ marginBottom: 10 }}>
						<label>
							Email
							<input
								type="text"
								name="email"
								onChange={handleInputChange}
							/>
						</label>
					</div>
					<div style={{ marginBottom: 10 }}>
						<label>
							Role
							<Select
								name="role"
								value={role}
								onChange={(event) => handleRoleChange(event)}
								displayEmpty
							>
								<MenuItem value={Role.USER}>User</MenuItem>
								<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
								<MenuItem value={Role.ADMIN}>Admin</MenuItem>
							</Select>
						</label>
					</div>
					<div style={{ marginBottom: 10 }}>
						<label>
							Schema Access
							<MultiSelect selectedList={schemaAccessList} setSelectedList={setSchemaAccessList} choiceList={schemaNames} />
						</label>
					</div>
				</div>
				<div className="button-container">
					<Button
						variant="contained"
						onClick={handleFormSubmit}
						sx={{ backgroundColor: "#404040" }}>
						Add
					</Button>
					<Button variant="contained" onClick={handleClose} sx={{ backgroundColor: "#404040" }}>
						Cancel
					</Button>
				</div>
			</div>
		</Box>
	</Modal>
}

export default AddUserModal;