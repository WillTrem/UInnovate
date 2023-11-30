import { Tab, Tabs } from "react-bootstrap";
import { Button, FormControl, Select, Switch, MenuItem, Chip, Stack } from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import TableComponent from "react-bootstrap/Table";
import "../../styles/TableComponent.css";
import "../../styles/UserManagementTab.css";
import vmd from "../../virtualmodel/VMD";
import React, { useState } from "react";
import AddUserModal from "./AddUserModal";



// Component containing the Users Management tab of the Settings page
const UserManagementTab = () => {
	const [isModalOpen, setModalOpen] = useState(false);

	function handleOnClick() {
		setModalOpen(true);
	}

	return (
		<div>
			<Tabs defaultActiveKey="users" variant="underline">
				<Tab eventKey="users" title="Users" className="users-container">
					<div className="users-container">
						<div className="add-button-container">
							<Button variant="contained" className="mt-3 mb-2" onClick={handleOnClick} sx={{ backgroundColor: "#404040" }}>
								Add User
							</Button>
						</div>
						<TableComponent bordered>
							<thead>
								<tr>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Email Address</th>
									<th>Role</th>
									<th>Active</th>
									<th>Schema Access</th>
								</tr>
							</thead>
							<tbody>
								{/* TODO: Use values from database table */}
								<UserTableRow firstName="John" lastName="Doe" emailAddress="john.doe@email.com" role="admin" active schemaAccess={[]} />
							</tbody>
						</TableComponent>
					</div>
				</Tab>
				<Tab eventKey="roles" title="Roles" disabled>

				</Tab>

			</Tabs>
			<AddUserModal open={isModalOpen} setOpen={setModalOpen} data-testid="add-user-modal" />
		</div>
	)

}

interface UserTableRowProps {
	firstName?: string,
	lastName?: string,
	emailAddress: string,
	role: string,
	active: boolean,
	schemaAccess: string[]
}
const UserTableRow: React.FC<UserTableRowProps> = ({ firstName, lastName, emailAddress, role, active, schemaAccess }) => {
	const [schemaAccessList, setSchemaAccessList] = useState(schemaAccess);
	const schemaNames = vmd.getSchemas().map((schema) => schema.schema_name);

	function handleActiveToggle() {
		// TODO: Implement the active toggle function
	};

	return <tr>
		<td>{firstName}</td>
		<td>{lastName}</td>
		<td>{emailAddress}</td>
		<td>{role}</td>
		<td>
			<Switch defaultChecked={active} onChange={handleActiveToggle} data-testid="visibility-switch" />
		</td>
		<td>
			<MultiSelect selectedList={schemaAccessList} setSelectedList={setSchemaAccessList} choiceList={schemaNames} />
		</td>
	</tr >
}

interface MultiSelectProps {
	selectedList: string[],
	setSelectedList: React.Dispatch<React.SetStateAction<string[]>>,
	choiceList: string[]
}

// Component obtained from https://codesandbox.io/s/mui-multi-select-kptq04?from-embed=&file=%2Fsrc%2FApp.js%3A238-291
export const MultiSelect: React.FC<MultiSelectProps> = ({ selectedList, setSelectedList, choiceList }) => {

	return (
		<FormControl sx={{
			width: '25vw'
		}}>
			<Select
				multiple
				value={selectedList}
				onChange={(e) => setSelectedList((e.target.value as string[]).sort((a, b) => a.localeCompare(b)))}
				inputProps={{ 'aria-label': 'Without label' }}
				sx={({ padding: 0, '& .MuiSelect-select': { padding: 1 } })}
				renderValue={(selected) => (
					<Stack gap={1} direction="row" flexWrap="wrap">
						{selected.map((value) => (
							<Chip
								key={value}
								label={value}
								onDelete={() =>
									setSelectedList(
										selectedList.filter((item) => item !== value)
									)
								}
								deleteIcon={
									<CancelIcon
										onMouseDown={(event) => event.stopPropagation()}
									/>
								}
							/>
						))}
					</Stack>
				)}
			>
				{choiceList.map((choice) => (
					<MenuItem key={choice} value={choice} sx={{ justifyContent: "space-between" }}>
						{choice}
						{selectedList.includes(choice) ? <CheckIcon color="info" /> : null}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}


export default UserManagementTab;