import { vi } from "vitest";

import { Table } from "../VMD";
import { DataAccessor, Row } from "../DataAccessor";
import ScriptHandler from "../ScriptHandler";

import { DataAccessorMock } from "./DataAccessor";
import * as VMDMock from "./VMD";
import axios from "axios";

vi.unmock("../DataAccessor");

export class ScriptHandlerMock extends ScriptHandler {
  constructor(script: Row) {
    super(script);

    super.setScript(script);
    super.setSchemaName(
      VMDMock.default.getTableSchema()?.schema_name as string
    );
    super.setAccessor({} as DataAccessor);

    if (super.getSchemaName()) {
      super.setTable(VMDMock.default.getTable("mock table name") as Table);
    }
  }

  init = vi.fn().mockImplementation(async () => {
    console.log("init in ScriptHandler mock was called");

    if (super.getTable() && super.getSchemaName()) {
      super.setAccessor(new DataAccessor("/api/data", {}));
    }

    const mockDataAccessor = new DataAccessorMock(
      super.getAccessor().data_url,
      {}
    );

    super.getAccessor().fetchRows = mockDataAccessor.fetchRows.bind(
      super.getAccessor()
    );

    try {
      super.setTableData((await super.getAccessor().fetchRows()) as Row[]);
    } catch (error) {
      throw new Error("Error fetching data: " + error);
    }
  });

  executeScript = vi.fn().mockImplementation(async () => {
    console.log("executeScript in ScriptHandler mock was called");
    super.executeScript();

    try {
      const result = await Promise.resolve({
        input: {
          script: super.getScript()["content"],
          table: super.getTable(),
          primary_key: super.getTable().getPrimaryKey()?.column_name,
        },
        data: {
          ...super.getScript(),
          Column1: 4,
          Column2: "mock row 4",
          Column3: "mock description 4",
        },
        status: 201,
        statusText: "Created",
        headers: {},
        config: {},
      });

      console.log(result.data);
      this.setNewTableData(result.data);
      return this.getNewTableData();
    } catch (error) {
      console.log(error);
    }
  });

  updateTableData = vi.fn().mockImplementation(() => {
    super.updateTableData();
  });

  getScript = vi.fn().mockImplementation(() => {
    return super.getScript();
  });

  getTableData = vi.fn().mockImplementation(() => {
    return super.getTableData();
  });

  getNewTableData = vi.fn().mockImplementation(() => {
    return super.getNewTableData();
  });

  getTable = vi.fn().mockImplementation(() => {
    return super.getTable();
  });

  getAccessor = vi.fn().mockImplementation(() => {
    return super.getAccessor();
  });

  getSchemaName = vi.fn().mockImplementation(() => {
    return super.getSchemaName();
  });

  setScript = vi.fn().mockImplementation((script: Row) => {
    super.setScript(script);
  });

  setTableData = vi.fn().mockImplementation((table_data: Row[]) => {
    super.setTableData(table_data);
  });

  setNewTableData = vi.fn().mockImplementation((new_table_data: Row[]) => {
    super.setNewTableData(new_table_data);
  });

  setTable = vi.fn().mockImplementation((table: Table) => {
    super.setTable(table);
  });

  setAccessor = vi.fn().mockImplementation((accessor: DataAccessor) => {
    super.setAccessor(accessor);
  });

  setSchemaName = vi.fn().mockImplementation((schema_name: string) => {
    super.setSchemaName(schema_name);
  });
}
