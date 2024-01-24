import { Tab, Tabs } from "react-bootstrap";
import { Button, FormControl, Select, Switch, MenuItem, Chip, Stack } from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import TableComponent from "react-bootstrap/Table";
import "../../styles/TableComponent.css";
import "../../styles/UserManagementTab.css";
import vmd, { UserData } from "../../virtualmodel/VMD";
import React, { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { Role } from "../../redux/AuthSlice";
import UnauthorizedScreen from "../UnauthorizedScreen";



// Component containing the Users Management tab of the Settings page
const UserManagementTab = () => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [users, setUsers] = useState<Row[]>([]);

	const role = useSelector((state: RootState) => state.auth.role);
	
	// Hides the menu for non-admin roles (except for anonymous)
	if(!(role === Role.ADMIN || role === null)){
		return <UnauthorizedScreen/>
	}

	const getUsers = async () => {
		const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
			"meta",
			"user_info"
		);

		const rows = await data_accessor.fetchRows();
		if (rows) {
			setUsers(rows);
		}
	}

	useEffect(() => {
		getUsers();
	}, [])

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
									<th>Email Address</th>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Role</th>
									<th>Active</th>
									<th>Schema Access</th>
								</tr>
							</thead>
							<tbody>
								{users && users.map((user, idx) => {
									if (user) {
										return <UserTableRow key={idx}
											firstName={user["first_name"] as string}
											lastName={user["last_name"] as string}
											emailAddress={user["email"] as string}
											role={user["role"] as string}
											active={user["is_active"] as boolean}
											schemaAccess={[]} />
									}
									return <React.Fragment key={idx} />

								})}
								{/* <UserTableRow firstName="John" lastName="Doe" emailAddress="john.doe@email.com" role="admin" active schemaAccess={[]} /> */}
							</tbody>
						</TableComponent>
					</div>
				</Tab>
				<Tab eventKey="roles" title="Roles" disabled>

				</Tab>

			</Tabs>
			<AddUserModal open={isModalOpen} setOpen={setModalOpen} getUsers={getUsers} data-testid="add-user-modal" />
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
		<td>{emailAddress}</td>
		<td>{firstName || "-"}</td>
		<td>{lastName || "-"}</td>
		<td>{role}</td>
		<td>
			<Switch defaultChecked={active} onChange={handleActiveToggle} data-testid="visibility-switch" />
		</td>
		<td>
			<MultiSelect selectedList={schemaAccessList} setSelectedList={setSchemaAccessList} choiceList={schemaNames} size="small" />
		</td>
	</tr >
}

interface MultiSelectProps {
	selectedList: string[],
	setSelectedList: React.Dispatch<React.SetStateAction<string[]>>,
	choiceList: string[],
	size?: "small" | "medium"
}

// Component obtained from https://codesandbox.io/s/mui-multi-select-kptq04?from-embed=&file=%2Fsrc%2FApp.js%3A238-291
export const MultiSelect: React.FC<MultiSelectProps> = ({ selectedList, setSelectedList, choiceList, size }) => {

	return (
			<Select
				size={size}
				multiple
				value={selectedList}
				onChange={(e) => setSelectedList((e.target.value as string[]).sort((a, b) => a.localeCompare(b)))}
				inputProps={{ 'aria-label': 'Without label' }}
				sx={({ 
					 '& .MuiSelect-select': { }, minWidth:'20vw', maxWidth: '25vw' })}
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
	);
}


export default UserManagementTab;