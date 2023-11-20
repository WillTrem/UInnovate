import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
// import { fetchTableAndColumnConfig } from "../virtualmodel/ConfigFetch";
// ConfigContext defines a React context for app config, so we can access and manipulate config data through React component tree (UI components)
export type ConfigValueType = {
	id?: number;
	property: string;
	table?: string;
	column?: string;
	value: string;
};
export type ConfigType = Array<ConfigValueType> | undefined;

interface ConfigContextType {
	config: ConfigType;
	updateConfig: (newValue: ConfigValueType) => void;
	fetchConfig: () => void; // Fetch configuration
	// fetchTableAndColumnConfig: () => void; // Fetch configuration from ConfigFetch.ts
}

const ConfigContext = createContext<ConfigContextType>({
	config: [],
	updateConfig: () => {},
	fetchConfig: () => {}, // Initialize fetchConfig method
	// fetchTableAndColumnConfig: () => {},
});
type ConfigProviderProps = { children: React.ReactNode };

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
	const [config, setConfig] = useState<ConfigType>([]);

	const fetchConfig = async () => {
		try {
			const response = await axios.get<ConfigType>(
				"http://localhost:3000/appconfig_values?columns=property,table,column,value&on_conflict=property,table,column",
				{
					headers: {
						"Accept-Profile": "meta",
					},
				}
			);
			setConfig(response.data);
		} catch (error) {
			console.error("Error fetching configuration:", error);
		}
	};

	useEffect(() => {
		fetchConfig(); // Fetch configuration on 'ConfigProvider' component mount
	}, []); //if they have val already dont apply the default value; else use default value

	const updateConfig = (newValue: ConfigValueType) => {
		let found = false;
		const newConfig: ConfigType = config?.map((value) => {
			if (
				value.property === newValue.property &&
				value.table === newValue.table &&
				value.column === newValue.column
			) {
				found = true;
				return { ...value, ...newValue };
			}
			return value;
		});
		if (!found) {
			newConfig?.push(newValue);
		}
		setConfig(newConfig);
	};

	useEffect(() => {
		console.log("CONFIG");
		console.log(config);
	}, [config]);

	return (
		<ConfigContext.Provider value={{ config, updateConfig, fetchConfig }}>
			{children}
		</ConfigContext.Provider>
	);
};

export const useConfig = (): ConfigContextType => {
	const configContext = useContext(ConfigContext);

	if (!configContext) {
		throw new Error("useTables must be used within a TablesContextProvider.");
	}
	return configContext;
};
