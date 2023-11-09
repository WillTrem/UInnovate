import axios from "axios";

const data_url = "http://localhost:3000/tables";
let schema_data_url = "http://localhost:3000/";

const schemas: Schema[] = [];
const datas = [];

// /tables with meta header provides the names of the schemas with their corresponding tables
// so we can get the table names from there along with their schemas

// We can then use the accept-profile attribute from headers to specify the schema and its corresponding tables

type Database = {
  schema: string;
  table: string;
};

class Schema {
  name: string;
  tables: string[];

  constructor(name: string) {
    this.name = name;
    this.tables = [];
  }

  pushTable(table: string) {
    this.tables.push(table);
  }
}

// export function fetchData() {
await axios
  .get(data_url, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data: Database) => {
      let schema = schemas.find((s: Schema) => s.name === data.schema);

      if (!schema) {
        schema = new Schema(data.schema);
        schemas.push(schema);
      }

      for (let i = 0; i < schemas.length; i++) {
        if (schemas[i].name === data.schema) {
          schemas[i].pushTable(data.table);
        }
      }
    });
  });

schemas.forEach((schema) => {
  schema.tables.forEach((table: string) => {
    const table_url = schema_data_url + table;
    console.log(table_url);
    axios
      .get(table_url, { headers: { "Accept-Profile": schema.name } })
      .then((response) => {
        response.data.forEach((data) => {
          datas.push(data);
        });
      });
  });
});
// }

export default datas;
