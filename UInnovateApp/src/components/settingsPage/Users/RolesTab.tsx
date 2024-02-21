import { useState } from "react";
import { Row } from "../../../virtualmodel/DataAccessor";
import vmd, { UserData } from "../../../virtualmodel/VMD";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableRowProps } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { Role } from "../../../redux/AuthSlice";

const RolesTab: React.FC = () => {
	const users = useSelector((state: RootState) => state.userData.users)
	const schemas: string[] = vmd.getApplicationSchemas().map((schema) => schema.schema_name);
	// const schemas: string[] = ["Schema1","Schema1","Schema1","Schema1","Schema1","Schema1","Schema1","Schema1","Schema1","Schema1"]
	

	return <Box paddingTop={2} alignContent={"center"}>
		<TableContainer >
			<Table sx={{width:"auto"}}>
				<TableHead>
					<TableRow>
						<TableCell sx={{maxWidth: "15rem"}}>Users</TableCell>
						<TableCell sx={{minWidth:"11rem", width:"11rem"}}>Default </TableCell>
						{schemas.map((schema) => {
							return <TableCell key={schema} sx={{minWidth:"11rem", width:"11rem"}}>{schema}</TableCell>
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
}

interface RolesTableRowProps extends Omit<TableRowProps, 'children'> {
	user: UserData,
	schemas: string[]
}

interface SchemaRoles {
	[key: string]: Role;
}

const RolesTableRow: React.FC<RolesTableRowProps> = ({ user, schemas, ...props }) => {
	const [schemaRoles, setSchemaRoles] = useState<SchemaRoles>({})
	const [defaultRole, setDefaultRole] = useState(user.role)

	function handleDefaultRoleChange(event: SelectChangeEvent) {
		setDefaultRole(event.target.value as Role)
	}

	function handleRoleChange(event: SelectChangeEvent, schema: string) {
		setSchemaRoles({ ...schemaRoles, [schema]: event.target.value as Role })
	}

	return <TableRow {...props}>
		<TableCell >{user.email}</TableCell>
		<TableCell >
			<FormControl fullWidth>
				<Select
					name="role"
					value={defaultRole}
					onChange={(event) => handleDefaultRoleChange(event)}
					variant="outlined"
					

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
						value={schemaRoles[schema]}
						onChange={(event) => handleRoleChange(event, schema)}
						variant="outlined"
						
					>
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