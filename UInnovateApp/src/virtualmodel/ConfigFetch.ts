import axios from "axios";
import { ConfigType } from "../contexts/ConfigContext";

const appconfig_propertiesURL = "http://localhost:3000/appconfig_properties";

interface AppConfigProperty {
	name: string;
	default_value: string;
	// other fields from appconfig_properties table if necessary like value_type
}

export async function fetchDefaultAppConfigValues(
	defaultConfigValue: ConfigType
): Promise<ConfigType> {
	try {
		const response = await axios.get<AppConfigProperty[]>(
			appconfig_propertiesURL,
			{
				headers: {
					"Content-Type": "application/json",
					"Content-Profile": "meta",
				},
			}
		);

		const defaultValues = response.data;

		const mergedConfig: ConfigType = defaultValues.map((defaultItem) => {
			const existingItem = defaultConfigValue?.find(
				(ec) => ec.property === defaultItem.name
			);
			if (existingItem) {
				return { ...existingItem };
			} else {
				return {
					property: defaultItem.name,
					value: defaultItem.default_value,
				};
			}
		});

		return mergedConfig;
	} catch (error) {
		console.error("Error fetching default app config values:", error);
		if (axios.isAxiosError(error)) {
			console.error("Axios error:", error.response);
		}
		return [];
	}
}
