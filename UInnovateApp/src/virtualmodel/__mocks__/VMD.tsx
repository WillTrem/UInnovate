import { vi } from "vitest";
import { DataAccessorMock } from "./DataAccessor";
import VMD, { Table, Schema, Column, TableDisplayType } from "../VMD";

export { Table, Schema, Column };

export default {
  ...VMD,
  getRowsDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getUpsertDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getUpsertDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getSchemas: vi.fn().mockImplementation(() => {
    console.log("getSchemas in VMD mock was called");
    return [
      { schema_name: "mock schema name" },
      { schema_name: "mock schema name 2" },
    ];
  }),
  getTableSchema: vi.fn().mockImplementation(() => {
    console.log("getTableSchema in VMD mock was called");
    return new Schema("mock schema name");
  }),
  getAllTables: vi.fn().mockImplementation(() => {
    return [new Table("mock1"), new Table("mock2"), new Table("mock3")];
  }),
  Table: Table,
  Column: Column,
  TableDisplayType: TableDisplayType,
};