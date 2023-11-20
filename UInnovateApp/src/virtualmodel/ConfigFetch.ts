import axios from "axios";

// const appconfig_propertiesURL = "http://localhost:3000/appconfig_properties";
const appconfig_valuesURL = "http://localhost:3000/appconfig_values";
const tablesURL = "http://localhost:3000/tables";
// const columnsURL = "http://localhost:3000/columns";
//VMD fetches all tables + columns (which is default basically), then fetches appconfig_values
//VMD then loops through each table and column, and checks if there is a user-modified value for that column

interface UserConfigProperty {
	name: string;
	default_value: string;
}

interface TableConfig {
	name: string;
	columns: ColumnConfig[];
}

interface ColumnConfig {
	name: string;
	type: string;
	default_value?: string;
}

export async function fetchTableAndColumnConfig(): Promise<TableConfig[]> {
	try {
		//fetching tables and default app config values (?)
		const { data: tables } = await axios.get<TableConfig[]>(tablesURL);
		const { data: userConfigProperties } = await axios.get<
			UserConfigProperty[]
		>(
			appconfig_valuesURL,
			{ headers: { "Accept-Profile": "meta" } } // Assuming there is a profile for user configurations
		);

		// apply user-modified configurations over the defaults
		// step 1; loop through each table
		for (const table of tables) {
			for (const column of table.columns) {
				// step 2; check if the table has a default value
				// find user-modified value for this column(if it exists)
				const userConfig = userConfigProperties.find(
					(property) => property.name === column.name
				);

				// override default value with user-modified one (if it exists)
				if (userConfig) {
					column.default_value = userConfig.default_value;
				}
			}
		}

		//tables with updated configs
		return tables;
	} catch (error) {
		console.error("Error fetching default app config values:", error);
		if (axios.isAxiosError(error)) {
			console.error("Axios error:", error.response);
		}
		throw error; // rethrow error
	}
}

fetchTableAndColumnConfig()
	.then((config) => {
		console.log("Fetched configuration:", config);
	})
	.catch((error) => {
		console.error("Error fetching configuration:", error);
	});
