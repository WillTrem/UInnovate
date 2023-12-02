import { Box, Button, MenuItem, Modal, ModalProps, Select, SelectChangeEvent, Typography } from "@mui/material"
import React, { ReactNode, useState } from "react"

import "../../styles/AddUserModal.css"
import "../../styles/UserManagementTab.css"
import vmd from "../../virtualmodel/VMD"
import { Row } from "../../virtualmodel/DataAccessor"
import { MultiSelect } from "./UserMangementTab"


interface AddUserModalProps extends Omit<ModalProps, 'children'> {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
// Modal component allowing a user to be added to the database
const AddUserModal: React.FC<AddUserModalProps> = ({ setOpen, ...props }) => {
	// Input values of the modal
	const [inputValues, setInputValues] = useState<Row>(new Row({}))

	// Role selection state
	const [role, setRole] = useState("user");

	// Schema Access List state
	const [schemaAccessList, setSchemaAccessList] = useState<string[]>([]);
	const schemaNames = vmd.getSchemas().map((schema) => schema.schema_name);

	// Handles change in input field
	function handleInputChange(e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) {
		setInputValues({
			...inputValues,
			row: { ...inputValues.row, [e.target.name]: e.target.value },
		});
	};

	function handleRoleChange(e: SelectChangeEvent<string>) {
		setRole(e.target.value);
		handleInputChange(e);
	}

	// Handles modal close
	function handleClose() {
		setOpen(false);
	}

	// Handles adding a user 
	function handleFormSubmit() {
		// TODO: Implement function
	}

	// All the props from AddUserModal are directly passed down to the Modal component
	return <Modal onClose={handleClose} {...props}>
		<Box className='modal-container'>
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
							value={role}
							onChange={(event) => handleRoleChange(event)}
							displayEmpty
						>
							{/*TODO:  Should create the  list of roles from a db table*/}
							<MenuItem value={"user"}>User</MenuItem>
							<MenuItem value={"configurator"}>Configurator</MenuItem>
							<MenuItem value={"admin"}>Admin</MenuItem>
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
		</Box>
	</Modal>
}

// interface FormInputProps {
// 	label: string,

// 	children?: ReactNode
// 	onChange: () => {},
// }
// // Component representing an input field from the modal 
// const FormInput: React.FC<FormInputProps> = ({ label, children, onChange }) => {
// 	return <div style={{ marginBottom: 10 }}>
// 		<label >
// 			{label}
// 			{/* By default, the field will be a text input field */}
// 			{children ? React.cloneElement(children, { onChange }) :
// 				<input
// 					type="text"
// 					name={column.column_name}
// 					onChange={onChange}
// 				/>
// 			}
// 		</label>
// 	</div>;
// }

export default AddUserModal;