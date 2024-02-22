import "../../../styles/TableComponent.css"
import { useState } from "react";
import vmd, { UserData } from "../../../virtualmodel/VMD";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableRowProps, fabClasses } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { Role } from "../../../redux/AuthSlice";
const RolesTab: React.FC = () => {
	const users = useSelector((state: RootState) => state.userData.users)
	const schemas: string[] = vmd.getApplicationSchemas().map((schema) => schema.schema_name);
	// const schemas: string[] = ["Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1", "Schema1"]


	return <Box display="flex" justifyContent="center" paddingTop={2}  >
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
							return <RolesTableRow user={user} schemas={schemas} />
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	</Box>
}

interface RolesTableRowProps extends Omit<TableRowProps, 'children'> {
	user: UserData,
	schemas: string[]
}

interface SchemaRoles {
	[key: string]: Role | '';
}

const RolesTableRow: React.FC<RolesTableRowProps> = ({ user, schemas, ...props }) => {
	const initialSchemaRoles = schemas.reduce((roles, schema) => {
		roles[schema] = '';
		return roles;
	  }, {} as SchemaRoles);

	const [schemaRoles, setSchemaRoles] = useState<SchemaRoles>(initialSchemaRoles)
	const [defaultRole, setDefaultRole] = useState(user.role)

	function handleDefaultRoleChange(event: SelectChangeEvent) {
		setDefaultRole(event.target.value as Role)
	}

	function handleRoleChange(event: SelectChangeEvent<unknown>, schema: string) {
		setSchemaRoles({ ...schemaRoles, [schema]: event.target.value as Role })
		const primKeys = ['user', 'schema'];
		const newRow = {user: user.email, schema, role: event.target.value as Role}
		const upsertRoleDataAcc = vmd.getUpsertRowDataAccessor('meta', 'role_per_schema', primKeys, {}, newRow );
		upsertRoleDataAcc.put()
		.then(() => console.log("Schema role updated successfully."))
		.catch(() => console.log("Error while updating the schema role"));
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
					>
						<MenuItem value=''/>
						<MenuItem value={Role.USER}>User</MenuItem>
						<MenuItem value={Role.CONFIG}>Configurator</MenuItem>
						{/* <MenuItem value={Role.ADMIN}>Admin</MenuItem> */}
					</Select>
				</FormControl>
			</TableCell>
		})}
	</TableRow>
}

export default RolesTab;