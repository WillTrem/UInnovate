import "../../../styles/TableComponent.css"
import { useEffect, useState } from "react";
import vmd, { UserData } from "../../../virtualmodel/VMD";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableRowProps, Typography, fabClasses } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { Role } from "../../../redux/AuthSlice";
import { displayError, displayNotification } from "../../../redux/NotificationSlice";
import { AuthState } from '../../../redux/AuthSlice';
import  Audits  from "../../../virtualmodel/Audits";

export interface SchemaRoles {
	[key: string]: Role | '';
}

interface SchemaRolesPerUser {
	[key: string]: SchemaRoles;
}

const RolesTab: React.FC = () => {
	const [schemaRolesPerUser, setSchemaRolesPerUser] = useState<SchemaRolesPerUser>();
	const [infoMessage, setInfoMessage] = useState('')
	const users = useSelector((state: RootState) => state.userData.users)
	const schemas: string[] = vmd.getApplicationSchemas().map((schema) => schema.schema_name);
	// const schemas: string[] = ["Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1"]
	async function getSchemaRoles() {
		const da = vmd.getRowsDataAccessor('meta', 'role_per_schema');
		const schemaRoles = await da.fetchRows();
		if (schemaRoles) {
			console.log(schemaRoles)
			// Transforms the array of {user, role, schema} objects into an object of {user: {schema1: role, schema2: role},...}
			const reducedSchemaRoles = schemaRoles.reduce((obj, { user, schema, role }) => {
				if (!obj[user]) {
					obj[user] = {}
				}
				obj[user][schema] = role;
				return obj;
			}, {});
			// console.log(reducedSchemaRoles);
			setSchemaRolesPerUser(reducedSchemaRoles);
		}
	}

	useEffect(() => {
		getSchemaRoles();
	}, []);

	return <Box display="flex" flexDirection="column" gap={"1rem"} alignItems="center" paddingTop={2}  >
		{infoMessage !== '' && <Typography>{infoMessage}</Typography>}
		{schemaRolesPerUser ?
			<Box sx={{ display: "inline-block", overflow: "auto", maxWidth: "100%", alignItems: "center" }}>
				<TableContainer sx={{ display: "block", border: "thin solid grey" }} component={Box}>
					<Table sx={{ minWidth: "max-content", borderCollapse: "separate", border: "none" }}>
						<TableHead >
							<TableRow>
								<TableCell className="sticky-column-left" sx={{ maxWidth: "15rem", borderRight: "thin solid #e0e0e0", fontWeight: "Bold" }}>Users</TableCell>
								<TableCell sx={{ minWidth: "11rem", width: "11rem", fontWeight: "Bold" }}>Default</TableCell>
								{schemas.map((schema) => {
									return <TableCell key={schema} sx={{ minWidth: "11rem", width: "11rem", fontWeight: "Bold" }}>{schema}</TableCell>
								})}
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user: UserData) => {
								return <RolesTableRow
									key={user.email}
									user={user}
									schemas={schemas}
									schemaRoles={schemaRolesPerUser[user.email]}
									getSchemaRoles={getSchemaRoles}
									setInfoMessage={setInfoMessage}
								/>
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			:
			<CircularProgress disableShrink sx={{ color: "#404040" }} size={"5vw"} />
		}
	</Box>
}

interface RolesTableRowProps extends Omit<TableRowProps, 'children'> {
	user: UserData,
	schemas: string[],
	schemaRoles: SchemaRoles,
	getSchemaRoles: () => Promise<void>,
	setInfoMessage: React.Dispatch<React.SetStateAction<string>>
}



const RolesTableRow: React.FC<RolesTableRowProps> = ({ user, schemas, schemaRoles = {}, getSchemaRoles, setInfoMessage, ...props }) => {
	const [defaultRole, setDefaultRole] = useState(user.role);
	const currentUser = useSelector((state: RootState) => state.auth.user);
	const dispatch = useDispatch();
	const {user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);
	
	function handleDefaultRoleChange(event: SelectChangeEvent) {
		const notificationMessage = `Default role updated successfully for user "${user.email}"`;
		const errorMessage = `A problem occured while updating the default role for user "${user.email}"`;

		const newRole = event.target.value;
		setDefaultRole(newRole as Role);
		const updateDefaultRoleFA = vmd.getFunctionAccessor('meta', 'update_default_role', { email: user.email, role: newRole });
		updateDefaultRoleFA
			.executeFunction()
			.then(() => {
				console.log("Default role updated successfully.");
				dispatch(displayNotification(notificationMessage));
				getSchemaRoles();
			})
			.catch(() => {
				console.log("Error while updating the default role");
				dispatch(displayError(errorMessage));
			});

		if (currentUser && user.email === currentUser) {
			setInfoMessage('It seems that you changed your own default role. To make your changes take effect, please reload the page.')
		}

		Audits.logAudits(
			loggedInUser || "",
			"Update Default Role",
			"User default role updated successfully " + user.email + " to " + newRole,
			"",
			""
		)
	}

	function handleRoleChange(event: SelectChangeEvent<unknown>, schema: string) {
		const notificationMessage = `Schema role updated successfully for user "${user.email}" on schema "${schema}"`;
		const errorMessage = `A problem occured while updating the schema role for user "${user.email}"`;
		// If selecting the empty choice, removes the line from the table
		if (event.target.value === '') {
			// event.preventDefault;
			const deleteRowDataAccessor = vmd.getRemoveRowAccessor('meta', 'role_per_schema', ['user', 'schema'], [user.email, schema]);
			deleteRowDataAccessor
				.deleteRow()
				.then(() => {
					console.log("Schema role updated successfully.");
					dispatch(displayNotification(notificationMessage));
					getSchemaRoles();
				})
				.catch(() => {
					console.log("Error while updating the schema role");
					dispatch(displayError(errorMessage));
				});

		}
		else {
			const primKeys = ['user', 'schema'];
			const newRow = { user: user.email, schema, role: event.target.value as Role }
			const upsertRoleDataAcc = vmd.getUpsertRowDataAccessor('meta', 'role_per_schema', primKeys, {}, newRow);
			upsertRoleDataAcc
				.put()
				.then(() => {
					console.log("Schema role updated successfully.");
					dispatch(displayNotification(notificationMessage));
					getSchemaRoles();
				})
				.catch(() => {
					console.log("Error while updating the schema role");
					dispatch(displayError(errorMessage));
				});
		}

		Audits.logAudits(
			loggedInUser || "",
			"Update Schema Role",
			"User updated schema role " + schema + " to " + event.target.value + " for user " + user.email,
			"",
			""
		)
	}

	return <TableRow {...props}>
		<TableCell className="sticky-column-left" sx={{ borderRight: "thin solid #e0e0e0" }}>{user.email}</TableCell>
		<TableCell >
			<FormControl fullWidth>
				<Select
					name="role"
					value={defaultRole}
					onChange={(event) => handleDefaultRoleChange(event)}
					variant="outlined"
					size="small"
					data-testid="default-role-select"
				>
					<MenuItem value={Role.USER}>User</MenuItem>
					<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
					<MenuItem value={Role.ADMIN}>Admin</MenuItem>
				</Select>
			</FormControl>
		</TableCell>
		{schemas.map((schema) => {
			return <TableCell key={schema}>
				{user.schema_access && user.schema_access.includes(schema)
					? <FormControl fullWidth>
						<Select
							name="role"
							value={schemaRoles[schema] || ''}
							onChange={(event) => handleRoleChange(event, schema)}
							variant="outlined"
							size="small"
							disabled={defaultRole === Role.ADMIN}
							defaultValue={schemaRoles[schema]}
							data-testid="schema-role-select"
						>
							<MenuItem value='' ><i>Default</i></MenuItem>
							<MenuItem value={Role.USER}>User</MenuItem>
							<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
						</Select>
					</FormControl>
					: <Typography color={"grey"}>No Access</Typography>}
			</TableCell>
		})}
	</TableRow>
}
export default RolesTab;