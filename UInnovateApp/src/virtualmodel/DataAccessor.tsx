import axios from "axios";

export class DataAccessor {
  data_url: string;
  headers: { [key: string]: string };

  constructor(data_url: string, headers: { [key: string]: string }) {
    this.data_url = data_url;
    this.headers = headers;
  }

  async fetchRows() {
    try {
      const rows: Row[] = [];

      const response = await axios.get(this.data_url, {
        headers: this.headers,
      });

      response.data.forEach((row: Row) => {
        rows.push(row);
      });

      return rows;
    } catch (error) {
      console.error("Could not fetch data:", error);
    }
  }
}

export class Row {
  row: { [key: string]: string | number | boolean };

  constructor(row: { [key: string]: string | number | boolean }) {
    this.row = row;
  }

  // Adding index signature to Row class to allow for dynamic access of row properties
  [key: string]: any;
}
