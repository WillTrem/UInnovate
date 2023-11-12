import axios from "axios";
import schemas from "./FetchData";

let table_url = "http://localhost:300/";

// This function will add a "type" to an enum type table
export function addTypeToEnum(tableName: string, values: string[]) {
  // First we have to find under which schema the table appears
  // We're importing schemas from FetchData for this purpose
  let schema_name = "";
  for (const schema of schemas) {
    for (const table of schema.tables) {
      if (table.name === tableName) {
        schema_name = schema.name;
      }
    }
  }

  // Setting the url of the table
  table_url += tableName;
  axios
    .post(table_url, values, {
      params: {},
      headers: {
        "Content-Type": "application/json",
        "Content-Profile": schema_name,
      },
    })
    .then(() => {
      console.log("Successfully added a new type to table ", tableName);
    })
    .catch((error) => {
      console.error("Could not add a new type to table ", tableName);
      console.log(error);
    });
}
