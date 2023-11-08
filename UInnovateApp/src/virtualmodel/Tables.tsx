import axios from "axios";
import { useState, useEffect } from "react";
// Definining Table Type
export class Table {
  table_name: string;
  attributes: string[];
  view_status: string;

  constructor(name: string, attributes: string[], view_status?: string) {
    this.table_name = name;
    this.attributes = attributes;
    this.view_status = view_status || "list";
  }

  updateViewStatus(newViewStatus: string) {
    this.view_status = newViewStatus;
  }
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

// const attr: Table[] = [];
const table_url = "http://localhost:3000/tables";
const attr_url = "http://localhost:3000/columns";

function fetchData({ onDataFetched }) {
  const [attr, setAttr] = useState<Table[]>([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (!isDataFetched) {
      // If the data has not been fetched yet,
      // GET Request to get the table names and populate the Table Array
      axios
        .get(table_url, { headers: { "Accept-Profile": "meta" } })
        .then((response) => {
          response.data.forEach((data: TableData) => {
            attr.push(new Table(data.table, []));
          });
        });

      // GET Request to get the columns of each table within the Table Array
      axios
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

      setIsDataFetched(true);
    }
  }, [isDataFetched, attr]);

  useEffect(() => {
    if (isDataFetched) {
      onDataFetched(attr);
    }
  }, [isDataFetched, attr, onDataFetched]);
}

export default fetchData;
