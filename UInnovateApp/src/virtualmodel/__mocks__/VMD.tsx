import { vi } from "vitest";
import { DataAccessorMock } from "./DataAccessor";
import { FunctionAccessorMock } from "./FunctionAccessor.tsx";
import VMD, { Table, Schema, Column, TableDisplayType, View } from "../VMD";

export default {
  ...VMD,
  getRowsDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock("/api/data");
  }),
  getRowsDataAccessorForOrder: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessorForOrder in VMD mock was called");
    return new DataAccessorMock("/api/data");
  }),
  getUpdateRowDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getUpdateRowDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getUpsertDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getUpsertDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getSchema: vi.fn().mockImplementation(() => {
    console.log("getSchema in VMD mock was called");
    const mockSchema = new Schema("mock schema name");
    mockSchema.tables = [
      new TableMock("mock table name"),
      new TableMock("mock table name 2"),
    ];
    return mockSchema;
  }),
  getSchemas: vi.fn().mockImplementation(() => {
    console.log("getSchemas in VMD mock was called");
    return [
      { schema_name: "mock schema name" },
      { schema_name: "mock schema name 2" },
    ];
  }),
  getApplicationSchemas: vi.fn().mockImplementation(() => {
    console.log("getSchemas in VMD mock was called");
    return [
      { schema_name: "mock schema name" },
      { schema_name: "mock schema name 2" },
    ];
  }),
  getTable: vi.fn().mockImplementation(() => {
    console.log("getTable in VMD mock was called");
    return new TableMock("mock table name");
  }),
  getTables: vi.fn().mockImplementation(() => {
    console.log("getTables in VMD mock was called");
    return [
      new TableMock("mock1"),
      new TableMock("mock2"),
      new TableMock("mock3"),
    ];
  }),
  getTableSchema: vi.fn().mockImplementation(() => {
    console.log("getTableSchema in VMD mock was called");
    return new Schema("mock schema name");
  }),
  getAllTables: vi.fn().mockImplementation(() => {
    return [
      new TableMock("mock1"),
      new TableMock("mock2"),
      new TableMock("mock3"),
    ];
  }),
  getFunctionAccessor: vi.fn().mockImplementation(() => {
    console.log("getFunctionAccessor in VMD mock was called");
    return new FunctionAccessorMock();
  }),
  getViewRowsDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getViewRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getRemoveRowAccessor: vi.fn().mockImplementation(() => {
    console.log("getRemoveRowAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getAddRowDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getAddRowDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getRowsDataAccessorForLookUpTable: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessorForLookUpTable in VMD mock was called");
    return new DataAccessorMock();
  }),
  TableDisplayType: TableDisplayType,
  View: View,
};

export class TableMock extends Table {
  constructor(name: string) {
    super(name);
  }
  getColumns = vi.fn().mockImplementation(() => {
    console.log("getColumns in Table mock was called");
    return [
      new ColumnMock("Column1"),
      new ColumnMock("Column2"),
      new ColumnMock("Column3"),
      new ColumnMock("name"),
    ];
  });
  getEnumViewColumn = vi.fn().mockImplementation(() => {
    console.log("getEnumViewColumn in Table mock was called");
    return new ColumnMock("type");
  });
}

export class ColumnMock extends Column {
  constructor(name: string) {
    super(name);
  }
  getVisibility = vi.fn().mockImplementation(() => {
    console.log("getVisibility in Column mock was called");
    return true;
  });
  setVisibility = vi.fn().mockImplementation(() => {
    console.log("setVisibility in Column mock was called");
    super.setVisibility(true);
  });
}
