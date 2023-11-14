import axios from "axios";

// Definining Table Type
export class Table {
  schema: string;
  table_name: string;
  attributes: string[];
  view_status: string;

  constructor(
    schema: string,
    name: string,
    attributes: string[],
    view_status?: string
  ) {
    this.schema = schema;
    this.table_name = name;
    this.attributes = attributes;
    this.view_status = view_status || "list";
  }

  updateViewStatus(newViewStatus: string) {
    this.view_status = newViewStatus;
  }
}

export enum TableDisplayType {
  listView = "list",
  enumView = "enum",
}

// Defining the TableData interface when calling /tables with the API
interface TableData {
  schema: string;
  table: string;
}

// // Defining the ColumnData interface when calling /columns with the API
interface ColumnData {
  schema: string;
  table: string;
  column: string;
}

const attr: Table[] = [];
const table_url = "http://localhost:3000/tables";
const attr_url = "http://localhost:3000/columns";

// GET Request to get the table names and populate the Table Array
await axios
  .get(table_url, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data: TableData) => {
      attr.push(new Table(data.schema, data.table, []));
    });
  });

// GET Request to get the columns of each table within the Table Array
await axios
  .get(attr_url, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data: ColumnData) => {
      for (let i = 0; i < attr.length; i++) {
        if (attr[i].table_name === data.table) {
          attr[i].attributes.push(data.column);
        }
      }
    });
  });

export default attr;
