import "../../../styles/TableComponent.css"
import { useEffect, useState } from "react";
import vmd, { UserData } from "../../../virtualmodel/VMD";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableRowProps, Typography, fabClasses } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { Role } from "../../../redux/AuthSlice";

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
								<TableCell sx={{ minWidth: "11rem", width: "11rem", fontWeight: "Bold" }}>Default </TableCell>
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

	function handleDefaultRoleChange(event: SelectChangeEvent) {
		const newRole = event.target.value;
		setDefaultRole(newRole as Role);
		const updateDefaultRoleFA = vmd.getFunctionAccessor('meta', 'update_default_role', { email: user.email, role: newRole });
		updateDefaultRoleFA.executeFunction();
		
		if (currentUser && user.email === currentUser) {
			setInfoMessage('It seems that you changed your own default role. To make your changes take effect, please reload the page.')
		}
	}

	function handleRoleChange(event: SelectChangeEvent<unknown>, schema: string) {
		// If selecting the empty choice, removes the line from the table
		if (event.target.value === '') {
			// event.preventDefault;
			const deleteRowDataAccessor = vmd.getRemoveRowAccessor('meta', 'role_per_schema', ['user', 'schema'], [user.email, schema]);
			deleteRowDataAccessor.deleteRow().then(() => {
				console.log("Schema role updated successfully.")
				getSchemaRoles();
			})
				.catch(() => console.log("Error while updating the schema role"));

		}
		else {
			const primKeys = ['user', 'schema'];
			const newRow = { user: user.email, schema, role: event.target.value as Role }
			const upsertRoleDataAcc = vmd.getUpsertRowDataAccessor('meta', 'role_per_schema', primKeys, {}, newRow);
			upsertRoleDataAcc.put()
				.then(() => {
					console.log("Schema role updated successfully.")
					getSchemaRoles();
				})
				.catch(() => console.log("Error while updating the schema role"));
		}
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

				>
					<MenuItem value={Role.USER}>User</MenuItem>
					<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
					<MenuItem value={Role.ADMIN}>Admin</MenuItem>
				</Select>
			</FormControl>
		</TableCell>
		{schemas.map((schema) => {
			return <TableCell key={schema}>
				<FormControl fullWidth>
					<Select
						name="role"
						value={schemaRoles[schema] || ''}
						onChange={(event) => handleRoleChange(event, schema)}
						variant="outlined"
						size="small"
						disabled={defaultRole === Role.ADMIN}
						defaultValue={schemaRoles[schema]}
					>
						<MenuItem value='' />
						<MenuItem value={Role.USER}>User</MenuItem>
						<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
						{/* <MenuItem value={Role.ADMIN}>Admin</MenuItem> */}
					</Select>
				</FormControl>
			</TableCell>
		})}
	</TableRow>
}
/**
 * Function that obtains the schema roles for a given user
 * @returns SchemaRoles
 */
export async function getSchemaRoles(user: string): Promise<SchemaRoles>
{
	const rolePerSchemaDA = vmd.getRowDataAccessor('meta', 'role_per_schema', 'user', user);
	const rolePerSchemaResponse = await rolePerSchemaDA.fetchRows();
	console.log(rolePerSchemaResponse);
	if (rolePerSchemaResponse) {
		const reducedRolePerSchema = rolePerSchemaResponse.reduce((obj, { schema, role }) => {
			obj[schema] = role;
			return obj;
		}, {});
		return reducedRolePerSchema
	}else{
		console.log('Failed to obtain the schema roles of user ' + user)
		return {};
	}
}

/**
 * Function that obtains the default role for a given user
 * @returns Role
 */
export async function getDefaultRole(user: string): Promise<Role|null>
{
	const defaultRoleDA = vmd.getViewRowDataAccessor('meta', 'user_info', ['email'],[ user]);
	const response = await defaultRoleDA.fetchRows();
	if (response) {
		console.log(response);
		const defaultRole = response[0]['role']
		return defaultRole as Role;
	}else{
		console.log('Failed to obtain the default role of user ' + user);
		return null;
	}
}

export default RolesTab;