import React, { createContext, useContext, useState } from "react";

type ConfigValueType = {
	id?: number,
	property: string,
	table?: string,
	column?: string,
	value: string
}
type ConfigType = Array<ConfigValueType> | undefined

interface ConfigContextType {
	config: ConfigType,
	updateConfig: (newValue: ConfigValueType)=>void;
}

const ConfigContext = createContext<ConfigContextType>({config: [], updateConfig:() => {}});

type ConfigProviderProps = {children: React.ReactNode};

export const ConfigProvider: React.FC<ConfigProviderProps> = ({children}) => {
	// TODO : Fetch the config from the DB via PostgREST API call
	const [config, setConfig] = useState<ConfigType>([])

	const updateConfig = (newValue: ConfigValueType ) => {
		const newConfig: ConfigType = config?.map((value) => {
			return (value.property === newValue.property && value.table === newValue.table && value.column === newValue.column)
			? {...value, ...newValue}
			: value;
		});
		setConfig(newConfig);
	}
	
	return <ConfigContext.Provider value={{config, updateConfig}}>
		{children}
		</ConfigContext.Provider>
}

export const useConfig = (): ConfigContextType => {
	const configContext = useContext(ConfigContext);
	
	if(!configContext){
		throw new Error("useTables must be used within a TablesContextProvider.")
	}
	return configContext;
}