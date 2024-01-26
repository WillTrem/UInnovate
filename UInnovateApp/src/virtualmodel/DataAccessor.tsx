import axiosCustom from "../api/AxiosCustom";

export class DataAccessor {
  data_url: string;
  params?: { [key: string]: string };
  headers: { [key: string]: string };
  values?: Row;

  constructor(
    data_url: string,
    headers: { [key: string]: string },
    params?: { [key: string]: string },
    values?: Row
  ) {
    this.data_url = data_url;
    this.headers = headers;
    this.params = params;
    this.values = values;
  }

  // Method to fetch rows from a table
  // return type: Row[]
  async fetchRows() {
    try {
      const rows: Row[] = [];

      const response = await axiosCustom.get(this.data_url, {
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

  // Method to add a row to a table
  // return type: AxiosResponse
  async addRow() {
    try {
      const response = await axiosCustom.post(this.data_url, this.values, {
        headers: this.headers,
      });

      return response;
    } catch (error) {
      console.error("Could not add row:", error);
    }
  }

  // Method to update a row in a table
  // return type: AxiosResponse
  async updateRow() {
    try {
      const response = await axiosCustom.patch(this.data_url, this.values, {
        headers: this.headers,
      });

      return response;
    } catch (error) {
      console.error("Could not update row:", error);
    }
  }

  // Method to upsert a set of rows in a table
  // return type: AxiosResponse
  async upsert() {
    try {
      const response = await axiosCustom.post(this.data_url, this.values, {
        params: this.params,
        headers: this.headers,
      });

      return response;
    } catch (error) {
      console.error("Could not update or insert row:", error);
    }
  }

  toggleAuthentication(value: boolean){
    axiosCustom.defaults.withCredentials = value;
  }
}

export class Row {
  row?: { [key: string]: string | number | boolean };

  constructor(row?: { [key: string]: string | number | boolean }) {
    this.row = row;
  }

  // Adding index signature to Row class to allow for dynamic access of row properties
  [key: string]: any;
}
