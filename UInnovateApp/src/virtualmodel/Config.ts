import axios from "axios";
import { ConfigType } from "../contexts/ConfigContext";

const appconfig_valuesUpsertURL = "http://localhost:3000/appconfig_values";

// Base appconfig_value type
export interface ConfigValue {
  id: number;
  property: string;
  value: string;
  table: string;
  column: string;
}

//All display types as enum
export enum ColumnDisplayTypes {
  text = "text",
  boolean = "boolean",
  number = "number",
  datetime = "datetime",
  longtext = "longtext",
}

// This function will update the appconfig_values table in the database by inserting new values and updating exisiting ones
export function updateAppConfigValues(config: ConfigType) {
  axios
    .post(appconfig_valuesUpsertURL, config, {
      params: {
        columns: "property,table,column,value",
        on_conflict: "property,table,column",
      },
      headers: {
        "Content-Type": "application/json",
        "Content-Profile": "meta",
        Prefer: "resolution=merge-duplicates",
      },
    })
    .then(() => {
      console.log(
        "Sucessfully updated appconfig_values database table with new configuration."
      );
    })
    .catch((error) => {
      console.log(
        "ERROR: An error has occured when attempting to update the appconfig_values database table. Reason: "
      );
      console.log(error);
    });
}

//Local array that contains all config properties values
export const config_properties_values: ConfigValue[] = [];

//Request to fetch all config values and storing them in config_properties_values
await axios
  .get(appconfig_valuesUpsertURL, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data) => {
      config_properties_values.push(data);
    });
  });
