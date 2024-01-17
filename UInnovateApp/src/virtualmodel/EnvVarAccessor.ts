import { DataAccessor } from "./DataAccessor";
import vmd from "./VMD.tsx";

export const insertNewEnvVar = async (varname: string, varvalue: string) => {
	try {
		const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
			"meta", // schema name
			"env_vars", // table name
			//new row data:
			{
				name: varname,
				value: varvalue,
			}
		);

		// Use data accessor to add the new row woop woop
		await data_accessor.addRow();
		alert("Environment variable saved successfully."); // Let user know it worked yay
	} catch (error) {
		console.error("Error in upserting environment variable:", error);
		alert("Failed to save environment variable."); // User sad :(
	}
};

export const editEnvVar = async (varID: string, varNewValue: string) => {
	try {
		const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
			"meta", // schema name
			"env_vars", // table name
			//new row data:
			{
				value: varNewValue,
			},
			"id",
			varID
		);

		// Use data accessor to add the new row woop woop
		await data_accessor.addRow();
		alert("Environment variable saved successfully."); // Let user know it worked yay
	} catch (error) {
		console.error("Error in upserting environment variable:", error);
		alert("Failed to save environment variable."); // User sad :(
	}
};
