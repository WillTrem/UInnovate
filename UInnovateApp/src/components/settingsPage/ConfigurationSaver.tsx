import { ConfigType, useConfig } from "../../contexts/ConfigContext";
import { useEffect, useRef, useState } from 'react';
import { updateAppConfigValues } from '../../virtualmodel/Config';
import { CircularProgress, Snackbar } from "@mui/material";
import BuildIcon from '@mui/icons-material/Build';
import { grey } from "@mui/material/colors";

const CONFIG_UPDATE_TIMER_MS = 10000;
const CONFIG_SAVE_ANIMATION_DURATION_MS = 1000;

// Invisible component in charge of saving the configuration at regular intervals and on leave
const ConfigurationSaver: React.FC = () => {
	const { config } = useConfig();
	const configRef = useRef<ConfigType>(config);
	const [isSnackbarVisible, setSnackbarVisible] = useState(false);

	// Keeps the configRef up to date with the latest config value
	useEffect(() => {
		console.log("ConfigRef updated")
		configRef.current = config;
	}, [config]);

	// Initializes the timer and the cleanup functions
	useEffect(() => {
		const interval = setInterval(() => {
			updateAppConfigValues(configRef.current);
			setSnackbarVisible(true);
			console.log("Saving the configuration in the DB via timer.");
		}, CONFIG_UPDATE_TIMER_MS);

		// Cleanup function
		return () => {
			clearInterval(interval);
			setSnackbarVisible(true);
			updateAppConfigValues(configRef.current);
			console.log("Unmounting ConfigurationSaver, saving the configuration to the DB.");
		}
	}, []);

	function handleSnackbarClose(event?: React.SyntheticEvent | Event, reason?: string) {
		if (reason === 'clickaway') {
			return;
		}

		setSnackbarVisible(false);
	}
	return <>
		<Snackbar open={isSnackbarVisible} autoHideDuration={CONFIG_SAVE_ANIMATION_DURATION_MS}
			onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
			<div>
				<BuildIcon sx={{
					color: grey[400]
				}} />
				<CircularProgress
					sx={{
						color: grey[400],
						position: 'absolute',
						top: -5,
						left: -8,
						zIndex: 1,
					}}
				/>
			</div>
		</Snackbar>
	</>
}

export default ConfigurationSaver;