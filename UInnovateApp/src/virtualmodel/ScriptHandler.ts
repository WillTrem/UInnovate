import { DataAccessor, Row } from "./DataAccessor";
import vmd, { Table } from "./VMD";
import axios from "axios";

/* This class will be used to define methods that users can use to 
interact with a table in the list view page through custom scripts
*/
class ScriptHandler {
  private script: Row;
  private schema_name: string | undefined;

  private table_data: Row[] | undefined = {} as Row[];
  private new_table_data: Row[] = {} as Row[];

  private table: Table = {} as Table;
  private accessor: DataAccessor = {} as DataAccessor;

  constructor(script: Row) {
    this.script = script;
    this.schema_name = vmd.getTableSchema(script["table_name"])?.schema_name;
    this.accessor = {} as DataAccessor;

    if (this.schema_name) {
      this.table = vmd.getTable(
        this.schema_name,
        script["table_name"]
      ) as Table;
    }
  }

  async init() {
    if (this.table && this.schema_name) {
      this.accessor = vmd.getRowsDataAccessor(
        this.schema_name,
        this.table.table_name
      );

      try {
        this.table_data = await this.accessor.fetchRows();
      } catch (error) {
        throw new Error("Error fetching table data: " + error);
      }
    }
  }

  async executeScript() {
    try {
      const result = await axios.post("http://localhost:3001/execute", {
        script: this.script["content"],
        table: this.table_data,
        primary_key: this.table.getPrimaryKey()?.column_name,
      });

      this.new_table_data = result.data;

      return this.new_table_data;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTableData() {
    this.accessor = new DataAccessor(
      this.table.getURL(),
      this.accessor.headers
    );

    try {
      await this.accessor.updateTableData(
        this.new_table_data,
        this.table,
        this.schema_name as string
      );
    } catch (error) {
      throw new Error("Error updating table data: " + error);
    }
  }

  getScript() {
    return this.script;
  }

  getTableData() {
    return this.table_data;
  }

  getNewTableData() {
    return this.new_table_data;
  }

  getTable() {
    return this.table;
  }

  getAccessor() {
    return this.accessor;
  }

  getSchemaName() {
    return this.schema_name;
  }

  setScript(script: Row) {
    this.script = script;
  }

  setTableData(table_data: Row[]) {
    this.table_data = table_data;
  }

  setNewTableData(new_table_data: Row[]) {
    this.new_table_data = new_table_data;
  }

  setTable(table: Table) {
    this.table = table;
  }

  setAccessor(accessor: DataAccessor) {
    this.accessor = accessor;
  }

  setSchemaName(schema_name: string) {
    this.schema_name = schema_name;
  }
}

export default ScriptHandler;
