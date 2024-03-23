import { vi } from "vitest";
import { DataAccessorMock, Row } from "./DataAccessor";
import { FunctionAccessorMock } from "./FunctionAccessor.tsx";
import VMD, { Table, Schema, Column, TableDisplayType, View } from "../VMD";

export { Table, Schema, Column };

export default {
  ...VMD,
  getRowDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getRowDataAccessor in VMD mock was called.")
    return new DataAccessorMock();
  }),
  getRowsDataAccessor: vi.fn().mockImplementation((schema, table) => {
    console.log("getRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock(table);
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
  getFunctionAccessor: vi.fn().mockImplementation((schema_name: string, function_name: string) => {
    console.log("getFunctionAccessor in VMD mock was called");
    return new FunctionAccessorMock(function_name);
  }),
  getViewRowDataAccessor: vi.fn().mockImplementation((schema_name: string,
    view_name: string,
    search_key: string[],
    search_key_value: string[]) => {
    console.log("getViewRowDataAccessor in VMD mock was called.")
    return new DataAccessorMock(view_name);
  }),
  getViewRowsDataAccessor: vi.fn().mockImplementation((schema_name: string,
    view_name: string,
    search_key: string[],
    search_key_value: string[]) => {
    console.log("getViewRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock(view_name);
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
  getUpsertRowDataAccessor: vi.fn().mockImplementation((schema_name: string, table_name: string, primary_keys: string[], params: { [key: string]: string },row: Row) => {
    console.log("getUpsertRowData in VMD mock was called");
    return new DataAccessorMock(table_name);
  }),
  refetchSchemas: vi.fn().mockImplementation(() => {
    console.log("refetchSchemas in VMD mock was called.")
  }),
  
  Table: Table,
  Column: Column,
  TableDisplayType: TableDisplayType,
  View: View,
};
