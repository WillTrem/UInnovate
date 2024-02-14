import { vi } from "vitest";

import { Table } from "../VMD";
import { DataAccessor, Row } from "../DataAccessor";

import { DataAccessorMock } from "./DataAccessor";
import * as VMDMock from "./VMD";
import ScriptHandler from "../ScriptHandler";

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
  });

  updateTableData = vi.fn().mockImplementation(() => {
    console.log("updateTableData in ScriptHandler mock was called");
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
}
