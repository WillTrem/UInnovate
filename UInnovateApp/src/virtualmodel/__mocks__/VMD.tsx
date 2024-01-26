import { vi } from "vitest";
import { DataAccessorMock } from "./DataAccessor";
import { FunctionAccessorMock } from "./FunctionAccessor.tsx";
import VMD, { Table, Schema, Column, TableDisplayType, View } from "../VMD";

export { Table, Schema, Column };

export default {
  ...VMD,
  getRowsDataAccessor: vi
    .fn()
    .mockImplementation((schema_name?, table_name?) => {
      console.log("getRowsDataAccessor in VMD mock was called");
      return new DataAccessorMock(schema_name, table_name);
    }),
  getRowsDataAccessorForOrder: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessorForOrder in VMD mock was called");
    return new DataAccessorMock();
  }),
  getUpsertDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getUpsertDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getSchema: vi.fn().mockImplementation(() => {
    console.log("getSchema in VMD mock was called");
    return new Schema("mock schema name");
  }),
  getSchemas: vi.fn().mockImplementation(() => {
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
  Table: Table,
  Column: Column,
  TableDisplayType: TableDisplayType,
  View: View,
};
