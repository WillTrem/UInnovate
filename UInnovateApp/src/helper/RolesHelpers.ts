import vmd from "../virtualmodel/VMD";
import { Role } from "../redux/AuthSlice";
import { SchemaRoles } from "../components/settingsPage/Users/RolesTab";

/**
 * Function that obtains the schema roles for a given user
 * @returns SchemaRoles
 */
export async function getSchemaRoles(user: string): Promise<SchemaRoles> {
	const rolePerSchemaDA = vmd.getRowDataAccessor('meta', 'role_per_schema', 'user', user);
	const rolePerSchemaResponse = await rolePerSchemaDA.fetchRows();
	if (rolePerSchemaResponse) {
		const reducedRolePerSchema = rolePerSchemaResponse.reduce((obj, { schema, role }) => {
			obj[schema] = role;
			return obj;
		}, {});
		return reducedRolePerSchema;
	} else {
		console.log('Failed to obtain the schema roles of user ' + user);
		return {};
	}
}
/**
 * Function that obtains the default role for a given user
 * @returns Role
 */

export async function getDefaultRole(user: string): Promise<Role | null> {
	const defaultRoleDA = vmd.getViewRowDataAccessor('meta', 'user_info', ['email'], [user]);
	const response = await defaultRoleDA.fetchRows();
	if (response) {
		const defaultRole = response[0]['role'];
		return defaultRole as Role;
	} else {
		console.log('Failed to obtain the default role of user ' + user);
		return null;
	}
}
