import { ConfigType } from "../contexts/ConfigContext";
import { DataAccessor, Row } from "./DataAccessor";
import vmd from "./VMD";

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
  date = "date",
  longtext = "longtext",
  categories = "categories",
  phone = "phone",
  email = "email",
  currency = "currency",
  multiline_wysiwyg = "multiline_wysiwyg",
}

export enum CategoriesDisplayType {
  category1 = "category1",
  category2 = "category2",
  category3 = "category3",
  category4 = "category4",
  category5 = "category5",
  category6 = "category6",
  category7 = "category7",
  file = "file",
}

// This function will update the appconfig_values table in the database by inserting new values and updating exisiting ones
export function updateAppConfigValues(config: ConfigType) {
  const data_accessor: DataAccessor = vmd.getUpsertDataAccessor(
    "meta",
    "appconfig_values",
    {
      columns: "property,table,column,value",
      on_conflict: "property,table,column",
    },
    config as unknown as Row
  );

  data_accessor
    .upsert()
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
const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
  "meta",
  "appconfig_values"
);
data_accessor.fetchRows().then((response) => {
  response?.forEach((row: Row) => {
    config_properties_values.push(row as unknown as ConfigValue);
  });
});
