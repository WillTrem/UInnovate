import { Tab, Tabs } from "react-bootstrap";
import { Button, Switch } from "@mui/material"
import TableComponent from "react-bootstrap/Table";
import "../../../styles/TableComponent.css";
import "../../../styles/UserManagementTab.css";
import vmd, { UserData } from "../../../virtualmodel/VMD";
import React, { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import { DataAccessor, Row } from "../../../virtualmodel/DataAccessor";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { Role, updateSchemaAccess } from "../../../redux/AuthSlice";
import UnauthorizedScreen from "../../UnauthorizedScreen";
import MultiSelect from "../MultiSelect";
import  { setUserData, updateUserData } from "../../../redux/UserDataSlice";

import {isEqual} from 'lodash';
import RolesTab from "./RolesTab";


// Component containing the Users Management tab of the Settings page
const UserManagementTab = () => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [users, setUsers] = useState<Row[]>([]);

	const dbRole = useSelector((state: RootState) => state.auth.dbRole);
	const dispatch = useDispatch();

	// Hides the menu for non-admin roles (except for anonymous)
	if (!(dbRole === Role.ADMIN || dbRole === null)) {
		return <UnauthorizedScreen />
	}

	const getUsers = async () => {
		const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
			"meta",
			"user_info"
		);

		const rows = await data_accessor.fetchRows();
		if (rows) {
			setUsers(rows);
			dispatch(setUserData(rows as UserData[]));
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
											active={user["is_active"] as boolean}
											schemaAccess={user["schema_access"]} />
									}
									return <React.Fragment key={idx} />

								})}
							</tbody>
						</TableComponent>
					</div>
				</Tab>
				<Tab eventKey="roles" title="Roles">
					<RolesTab/>
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
	active: boolean,
	schemaAccess: string[]
}
const UserTableRow: React.FC<UserTableRowProps> = ({ firstName, lastName, emailAddress, active, schemaAccess }) => {
	const [userData, setUserData] = useState<UserData>({first_name: firstName, last_name: lastName, email: emailAddress, is_active: active, schema_access: schemaAccess})
	const [schemaAccessList, setSchemaAccessList] = useState(schemaAccess);
	const schemaNames = vmd.getApplicationSchemas().map((schema) => schema.schema_name);
	const dispatch = useDispatch();
	const {user: current_user, schema_access} = useSelector((state: RootState) => state.auth)

	function handleActiveToggle(event: React.ChangeEvent<HTMLInputElement>, checked: boolean ) {
		// TODO: Implement the active toggle function
		setUserData({...userData, is_active: checked});
		console.log(checked)
	};

	// Updates the local user data state 
	useEffect(() => {
		setUserData({...userData, schema_access: schemaAccessList});
	}, [schemaAccessList])

	// Updates the global user data state with new user data 
	useEffect(() => {
		dispatch(updateUserData(userData))
		// If the current user is the one being modified, update the schema access list state directly (only if modified)
		if(current_user === userData.email && !isEqual(new Set(schema_access), new Set(userData.schema_access))){
			dispatch(updateSchemaAccess(userData.schema_access as string[]));
		}
	}, [userData]);


	return <tr>
		<td>{emailAddress}</td>
		<td>{firstName || "-"}</td>
		<td>{lastName || "-"}</td>
		<td>
			<Switch defaultChecked={active} onChange={handleActiveToggle} data-testid="visibility-switch" />
		</td>
		<td>
			<MultiSelect selectedList={schemaAccessList} setSelectedList={setSchemaAccessList} choiceList={schemaNames} size="small" sx={{
				'& .MuiSelect-select': {}, minWidth: 400, maxWidth: 400
			}} />
		</td>
	</tr >
}




export default UserManagementTab;