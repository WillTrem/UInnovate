import axios from "axios";

const data_url = "http://localhost:3000/tables";
const schema_data_url = "http://localhost:3000/";

const schemas: Schema[] = [];

// The directory /tables with the meta header provides the names of the schemas with their corresponding tables
// So we can get the table names from there along with their schemas
// We can then use the accept-profile attribute from headers to specify the schema and its corresponding tables

// Defining a Database type for typescript syntax
type Database = {
  schema: string;
  table: string;
};

// Defining a class Schema with constructor to facilitate making a data structure
// made of schema objects
export class Schema {
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

// Defining a class Table with constructor for type issues and for making a data
// structure made of table objects
export class Table {
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

// Type Row for data parsing
type Row = {
  id: number;
};

// GET Request to get all the schemas and their corresponding tables
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
console.log(schemas)
// Here we export a function that returns a String[][] depending on the table specified
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
            const row = Object.values(data).map((value) => value?.toString() || "null");
            rows.push(row);
          });
        } catch (error) {
          console.error(error);
          console.error("Could not fetch the rows of the desired table.");
        }
      }
    }
  }
  console.log(rows)
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
          console.error("Could not fetch the columns of the desired table.");
        }
      }
    }
  }
  return columns;
}

export default schemas;
