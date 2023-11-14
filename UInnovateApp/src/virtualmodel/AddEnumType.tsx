import axios from "axios";
import schemas from "./FetchData";

const table_url = "http://localhost:3000/";

// This function will add a "type" to an enum type table
export function addTypeToEnum(
  tableName: string,
  values: { [key: string]: string } | undefined
) {
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
  const request_url = table_url + tableName;
  axios
    .post(request_url, values, {
      headers: {
        Prefer: "return=representation",
        "Content-Type": "application/json",
        "Content-Profile": schema_name,
      },
    })
    .then(() => {
      console.log("Successfully added a new type to table ", tableName);
    })
    .catch((error) => {
      console.error(
        "Could not add a new type to table ",
        tableName,
        " because: "
      );
      console.log(error);
    });
}
