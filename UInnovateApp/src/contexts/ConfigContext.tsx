import React, { createContext, useContext, useEffect, useState } from "react";

export type ConfigValueType = {
	id?: number,
	property: string,
	table?: string,
	column?: string,
	value: string
}
export type ConfigType = Array<ConfigValueType> | undefined

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
		let found = false;
		const newConfig: ConfigType = config?.map((value) => {
			if(value.property === newValue.property && value.table === newValue.table && value.column === newValue.column){
				found = true;
				return {...value, ...newValue};
			}
			return value;
		});
		if(!found){
			newConfig?.push(newValue);
		}
		setConfig(newConfig);
	}

	useEffect(() => {
	console.log("CONFIG");
	console.log(config);
	}, [config])
	
	return <ConfigContext.Provider value={{config, updateConfig}}>
		{children}
		</ConfigContext.Provider>
}

export const useConfig = (): ConfigContextType => {
	const configContext = useContext(ConfigContext);
	
	if(!configContext){
		throw new Error("useConfig must be used within a ConfigProvider component.")
	}
	return configContext;
}