import { useConfig } from "../../contexts/ConfigContext";
import { useEffect, useRef } from 'react';
import { updateAppConfigValues } from '../../virtualmodel/Config';

const CONFIG_UPDATE_TIMER_MS = 10000;

// Invisible component in charge of saving the configuration at regular intervals and on leave
const ConfigurationSaver: React.FC = () => {
	const { config } = useConfig();
	const configRef = useRef(config);

	// Keeps the configRef up to date with the latest config value
	useEffect(() => {
		console.log("ConfigRef updated")
		configRef.current = config;
	}, [config]);

	// Initializes the timer and the cleanup functions
	useEffect(() => {
		const interval = setInterval(() => {
			updateAppConfigValues(configRef.current)
			console.log("Saving the configuration in the DB via timer.")
		}, CONFIG_UPDATE_TIMER_MS);

		// Cleanup function
		return () => {
			clearInterval(interval);
			updateAppConfigValues(configRef.current);
			console.log("Unmounting ConfigurationSaver, saving the configuration to the DB.")
		}
	}, []);

	return <></>
}

export default ConfigurationSaver;