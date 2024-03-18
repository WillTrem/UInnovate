import { vi } from "vitest";
import { DataAccessorMock } from "./DataAccessor";
import { FunctionAccessorMock } from "./FunctionAccessor.tsx";
import VMD, { Table, Schema, Column, TableDisplayType, View } from "../VMD";

export { Table, Schema, Column };

export default {
  ...VMD,
  getRowsDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getRowsDataAccessorForOrder: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessorForOrder in VMD mock was called");
    return new DataAccessorMock("For List View");
  }),
  getUpsertDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getUpsertDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getSchema: vi.fn().mockImplementation(() => {
    console.log("getSchema in VMD mock was called");
    const mockSchema = new Schema("mock schema name");
    mockSchema.tables = [new Table("mock table name"), new Table("mock table name 2")]
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
    return new Table("mock table name");
  }),
  getTables: vi.fn().mockImplementation(() => {
    console.log("getTables in VMD mock was called");
    return [new Table("mock1"), new Table("mock2"), new Table("mock3")];
  }),
  getTableSchema: vi.fn().mockImplementation(() => {
    console.log("getTableSchema in VMD mock was called");
    return new Schema("mock schema name");
  }),
  getAllTables: vi.fn().mockImplementation(() => {
    return [new Table("mock1"), new Table("mock2"), new Table("mock3")];
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
  Table: Table,
  Column: Column,
  TableDisplayType: TableDisplayType,
  View: View,
};
