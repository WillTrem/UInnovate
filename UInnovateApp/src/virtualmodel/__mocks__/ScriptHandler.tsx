import { vi } from "vitest";

import { Table, Schema } from "../VMD";
import { DataAccessor, Row } from "../DataAccessor";

import { DataAccessorMock } from "./DataAccessor";
import * as VMDMock from "./VMD";

vi.unmock("../DataAccessor");

export class ScriptHandlerMock {
  public script: Row;
  public schema_name: string | undefined;

  public table_data: Row[] | undefined = {} as Row[];
  public new_table_data: Row[] = {} as Row[];

  public table: Table = {} as Table;
  public accessor: DataAccessor = {} as DataAccessor;

  constructor(script: Row) {
    this.script = script;
    this.schema_name = VMDMock.default.getTableSchema()?.schema_name;
    this.accessor = {} as DataAccessor;

    if (this.schema_name) {
      this.table = VMDMock.default.getTable("mock table name") as Table;
    }
  }

  init = vi.fn().mockImplementation(async () => {
    console.log("init in ScriptHandler mock was called");
    if (this.table && this.schema_name) {
      this.accessor = new DataAccessor("/api/data", {});
    }

    const mockDataAccessor = new DataAccessorMock(this.accessor.data_url, {});

    this.accessor.fetchRows = mockDataAccessor.fetchRows.bind(this.accessor);

    try {
      this.table_data = await this.accessor.fetchRows();
    } catch (error) {
      throw new Error("Error fetching data: " + error);
    }
  });

  // async executeScript() {
  //     try {
  //     const result = await Promise.resolve({
  //         data: this.new_table_data,
  //     });

  //     this.new_table_data = result.data;

  //     return this.new_table_data;
  //     } catch (error) {
  //     console.log(error);
  //     }
  // }

  getScript = vi.fn().mockImplementation(() => {
    return this.script;
  });

  getTableData = vi.fn().mockImplementation(() => {
    return this.table_data;
  });

  getNewTableData = vi.fn().mockImplementation(() => {
    return this.new_table_data;
  });

  getTable = vi.fn().mockImplementation(() => {
    return this.table;
  });

  getAccessor = vi.fn().mockImplementation(() => {
    return this.accessor;
  });

  getSchemaName = vi.fn().mockImplementation(() => {
    return this.schema_name;
  });
}
