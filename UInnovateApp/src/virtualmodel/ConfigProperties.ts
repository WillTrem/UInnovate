import axios from "axios";
import { ConfigValueType } from "../contexts/ConfigContext";

// Base appconfig_value type
export interface ConfigValue {
  id: number;
  property: string;
  value: string;
  table: string;
  column: string;
}

//All configuration properties as enum
export enum ConfigProperty {
  TABLE_VIEW = "table_view",
  VISIBLE = "visible",
  EDITABLE = "editable",
  DISPLAY_COLUMN_AS_CURRENCY = "display_column_as_currency",
  COLUMN_DISPLAY_TYPE = "column_display_type",
  METADATA_VIEW = "metadata_view",
}

//All display types as enum
export enum ColumnDisplayTypes {
  text = "text",
  boolean = "boolean",
  number = "number",
  datetime = "datetime",
  longtext = "longtext",
}

//Local array that contains all config properties values
export const config_properties_values: ConfigValue[] = [];

const config_values_url = "http://localhost:3000/appconfig_values";

//Request to fetch all config values and storing them in config_properties_values
await axios
  .get(config_values_url, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data) => {
      config_properties_values.push(data);
    });
  });

//Send all changes made to config_properties_values to database
export const updateDisplayConfig = async (
  newDisplayConfig: ConfigValueType[]
) => {
  const data = JSON.stringify(newDisplayConfig);
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/appconfig_values",
    headers: {
      "Content-Profile": "meta",
      Prefer: "resolution=merge-duplicates",
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};
