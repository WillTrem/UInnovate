import axios from "axios";
import { ConfigType } from "../contexts/ConfigContext";

const appconfig_valuesUpsertURL = "http://localhost:3000/appconfig_values"

// This function will update the appconfig_values table in the database by inserting new values and updating exisiting ones
export function updateAppConfigValues(config: ConfigType){
	axios
	.post(appconfig_valuesUpsertURL,config, {
		params: {
			'columns':'property,table,column,value',
			'on_conflict':'property,table,column'
		},
		headers:{
			'Content-Type': 'application/json',
			'Content-Profile':'meta',
			'Prefer':'resolution=merge-duplicates'
		}
	})
	.then(() => {
		console.log("Sucessfully updated appconfig_values database table with new configuration.");
	})
	.catch((error) => {
		console.log("ERROR: An error has occured when attempting to update the appconfig_values database table. Reason: ");
		console.log(error);
	});
}