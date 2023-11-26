import { vi } from "vitest";
import { DataAccessorMock } from "./DataAccessor";
import VMD, { Table, Schema, Column } from "../VMD";

export { Table, Schema, Column }


export default {
  ...VMD,
  getRowsDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getSchemas: vi.fn().mockImplementation(() => {
    console.log("getSchemas in VMD mock was called");
    return [
      { schema_name: "mock schema name" },
      { schema_name: "mock schema name 2" },
    ];
  }),
};
