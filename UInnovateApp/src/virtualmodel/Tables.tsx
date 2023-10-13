import axios from "axios";

// Definining Table Type
interface Table {
  table_name: string;
  attributes: string[];
}

const tables: string[] = [];
const attr: Table[] = [];
const table_url = "http://localhost:3000/tables";
const attr_url = "http://localhost:3000/columns";

// GET Request to get the table names, helps also populate the table names for the Table Array
await axios
  .get(table_url, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data) => {
      tables.push(data.table);
      attr.push({ table_name: data.table, attributes: [] });
    });
  });

// GET Request to get the attributes of each table within the Table Array
await axios
  .get(attr_url, { headers: { "Accept-Profile": "meta" } })
  .then((response) => {
    response.data.forEach((data) => {
      for (let i = 0; i < attr.length; i++) {
        if (attr[i].table_name === data.table) {
          attr[i].attributes.push(data.column);
        }
      }
    });
  });

export default attr;
