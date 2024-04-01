import axiosCustom from "../api/AxiosCustom";

export class DataAccessor {
  data_url: string;
  params?: { [key: string]: string };
  headers: { [key: string]: string };
  values?: Row | Row[];

  constructor(
    data_url: string,
    headers: { [key: string]: string },
    params?: { [key: string]: string },
    values?: Row | Row[]
  ) {
    this.data_url = data_url;
    this.headers = headers;
    this.params = params;
    this.values = values;
  }

  // Method to fetch rows from a table
  // return type: Row[]
  async fetchRows(signal?: AbortSignal | undefined) {
    try {
      const rows: Row[] = [];

      const response = await axiosCustom.get(this.data_url, {
        signal: signal,
        headers: this.headers,
        params: this.params
      });

      response.data.forEach((row: Row) => {
        rows.push(row);
      });

      return rows;
    } catch (error) {
      console.error("Could not fetch data:", error);
    }
  }

  // Method to fetch rows from a table or view by column values
  // return type: Row[]
  async fetchRowsByColumnValues(column_name: string, column_value: string, order_by_column: string | undefined, signal?: AbortSignal | undefined) {
    try {
      const rows: Row[] = [];
      this.data_url = this.data_url + `?${column_name}=eq.${column_value}`;
      if (order_by_column) {
        this.data_url = this.data_url + `&order=${order_by_column}.asc`;
      }
      const response = await axiosCustom.get(this.data_url, {
        signal: signal,
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
      throw error;
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
      throw error;
    }
  }


  /**Method to upsert a SINGLE ROW in a table
   * @returns AxiosResponse
   */
  async put(){
    try {
      const response = await axiosCustom.put(this.data_url, this.values, {
        params: this.params,
        headers: this.headers,
      });

      return response;
    } catch (error) {
      console.error("Could not update or insert row:", error);
      throw error;
    }
  }

  // Method to delete a row from a table
  // return type: AxiosResponse
  async deleteRow() {
    try {
      const response = await axiosCustom.delete(this.data_url, {
        headers: this.headers,
        params: this.params
      });

      return response;
    } catch (error) {
      console.error("Could not delete row:", error);
      throw error;
    }
  }

  async updateTableData(
    new_table_data: Row[],
    table: ITable,
    schema_name: string
  ) {
    let old_row: Row | undefined = {} as Row;
    let old_table_data = await this.fetchRows();

    const primary_key = table.getPrimaryKey()?.column_name;
    // const schema_name = vmd.getTableSchema(table.table_name)?.schema_name;

    // After fetching rows, change the header from Accept-Profile to Content-Profile
    this.headers = { "Content-Profile": schema_name as string };

    if (!primary_key) return false;

    try {
      if (!(typeof new_table_data[Symbol.iterator] === "function")) {
        throw new Error("new_table_data is not iterable");
      }

      for (const new_row of new_table_data) {
        old_row = old_table_data?.find(
          (r) => r[primary_key] === new_row[primary_key]
        );

        if (old_row) {
          for (const key in new_row) {
            if (old_row[key] !== new_row[key]) {
              console.log(this);
              this.values = new_row;
              this.data_url = `${table.getURL()}?${primary_key}=eq.${
                new_row[primary_key]
              }`;
              await this.updateRow();
            }
          }
        } else {
          this.values = new_row;
          this.data_url = table.getURL();
          await this.addRow();
        }
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      throw error;
    }

    // If the new data does not contain a row that exists in the old data, delete the row from the table
    old_table_data = old_table_data?.filter((old_row) => {
      const existsInNewData = new_table_data.some(
        (new_row) => new_row[primary_key] === old_row[primary_key]
      );
      if (!existsInNewData) {
        this.data_url = `${table.getURL()}?${primary_key}=eq.${
          old_row[primary_key]
        }`;
        try {
          this.deleteRow();
        } catch (error) {
          console.error("Error updating row:", error);
          throw error;
        }
      }
      return existsInNewData;
    });
  }

  toggleAuthentication(value: boolean) {
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

interface ITable {
  table_name: string;
  getURL: () => string;
  getPrimaryKey: () => IColumn | undefined;
}

interface IColumn {
  column_name: string;
}
