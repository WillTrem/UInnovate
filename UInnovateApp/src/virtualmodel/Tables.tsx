import axios from "axios";

const tables: string[] = [];

await axios.get("http://localhost:3000/alltables").then((response) => {
  response.data.forEach((table) => {
    table.table_type === "BASE TABLE" ? tables.push(table.table_name) : "";
  });
});

export default tables;
