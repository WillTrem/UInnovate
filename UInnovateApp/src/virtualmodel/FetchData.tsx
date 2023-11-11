import axios from "axios";

const data_url = "http://localhost:3000/tables";
const schema_data_url = "http://localhost:3000/";

const schemas: Schema[] = [];
// const datas = [];

// /tables with meta header provides the names of the schemas with their corresponding tables
// so we can get the table names from there along with their schemas

// We can then use the accept-profile attribute from headers to specify the schema and its corresponding tables

type Database = {
  schema: string;
  table: string;
};

class Schema {
  name: string;
  tables: Table[];

  constructor(name: string) {
    this.name = name;
    this.tables = [];
  }

  pushTable(table: Table) {
    this.tables.push(table);
  }
}
class Table {
  name: string;
  rows: string[][];
  constructor(name: string) {
    this.name = name;
    this.rows = [];
  }

  pushRow(row: string[]) {
    this.rows.push(row);
  }
}

type Row = {
  id: number;
};

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
          schemas[i].pushTable(new Table(data.table));
        }
      }
    });
  });

// Here we export a function that returns a Row[] depending on the table specified
// We still need the schema[] for the Accept-Profile header for the GET request

export async function getRowsFromTable(tableName: string) {
  const rows: string[][] = [];
  for (const schema of schemas) {
    const table_url = schema_data_url + tableName;
    for (const table of schema.tables) {
      if (table.name === tableName) {
        try {
          const response = await axios.get(table_url, {
            headers: { "Accept-Profile": schema.name },
          });
          response.data.forEach((data: Row) => {
            const row = Object.values(data).map((value) => value.toString());
            rows.push(row);
          });
        } catch (error) {
          console.log("Error");
        }
      }
    }
  }
  return rows;
}

// Function to fetch the columns from a specific table - appears in the same order
// as they do when fetching data; this eases frontend rendering
export async function getColumnsFromTable(tableName: string) {
  let columns: string[] = [];
  for (const schema of schemas) {
    const table_url = schema_data_url + tableName;
    for (const table of schema.tables) {
      if (table.name === tableName) {
        try {
          const response = await axios.get(table_url, {
            headers: { "Accept-Profile": schema.name },
          });
          const attributes = Object.keys(response.data[0]);
          columns = attributes;
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
  return columns;
}
// schemas.forEach((schema) => {
//   schema.tables.forEach((table: Table) => {
//     const table_url = schema_data_url + table.name;
//     console.log(table_url);
//     axios
//       .get(table_url, { headers: { "Accept-Profile": schema.name } })
//       .then((response) => {
//         response.data.forEach((data: string[]) => {
//           table.pushRow(data);
//           datas.push(data);
//         });
//       });
//   });
// });
