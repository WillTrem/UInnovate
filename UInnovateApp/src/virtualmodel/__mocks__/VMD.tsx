import { vi } from "vitest";
import { DataAccessorMock, Row } from "./DataAccessor";
import { FunctionAccessorMock } from "./FunctionAccessor.tsx";
import VMD, { Table, Schema, Column, TableDisplayType, View } from "../VMD";

export default {
  ...VMD,
  getRowDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getRowDataAccessor in VMD mock was called.");
    return new DataAccessorMock("/api/data");
  }),
  getRowsDataAccessor: vi.fn().mockImplementation((schema, table) => {
    console.log("getRowsDataAccessor in VMD mock was called");
    if(table){
      return new DataAccessorMock(table);
    }
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
  getFunctionAccessor: vi
    .fn()
    .mockImplementation((schema_name: string, function_name: string) => {
      console.log("getFunctionAccessor in VMD mock was called");
      return new FunctionAccessorMock(function_name);
    }),

  getTableDisplayField: vi.fn().mockImplementation(() => {
    console.log("getTableDisplayField in VMD mock was called");
    return "display_field";
  }),

  getViewRowDataAccessor: vi
    .fn()
    .mockImplementation(
      (
        schema_name: string,
        view_name: string,
        search_key: string[],
        search_key_value: string[]
      ) => {
        console.log("getViewRowDataAccessor in VMD mock was called.");
        return new DataAccessorMock(view_name);
      }
    ),
  getViewRowsDataAccessor: vi
    .fn()
    .mockImplementation(
      (
        schema_name: string,
        view_name: string,
        search_key: string[],
        search_key_value: string[]
      ) => {
        console.log("getViewRowsDataAccessor in VMD mock was called");
        return new DataAccessorMock(view_name);
      }
    ),
  getRemoveRowAccessor: vi.fn().mockImplementation((schemaName, tableName) => {
    console.log("getRemoveRowAccessor in VMD mock was called");
    return new DataAccessorMock(tableName);
  }),
  getAddRowDataAccessor: vi.fn().mockImplementation(() => {
    console.log("getAddRowDataAccessor in VMD mock was called");
    return new DataAccessorMock();
  }),
  getRowsDataAccessorForLookUpTable: vi.fn().mockImplementation(() => {
    console.log("getRowsDataAccessorForLookUpTable in VMD mock was called");
    return new DataAccessorMock();
  }),
  getUpsertRowDataAccessor: vi
    .fn()
    .mockImplementation(
      (
        schema_name: string,
        table_name: string,
        primary_keys: string[],
        params: { [key: string]: string },
        row: Row
      ) => {
        console.log("getUpsertRowData in VMD mock was called");
        return new DataAccessorMock(table_name);
      }
    ),
  refetchSchemas: vi.fn().mockImplementation(() => {
    console.log("refetchSchemas in VMD mock was called.");
  }),

  TableDisplayType: TableDisplayType,
  View: View,
};

export class TableMock extends Table {
  constructor(name: string) {
    super(name);
  }
  addColumn = vi
    .fn()
    .mockImplementation(
      (
        column: Column,
        references_table: string,
        is_editable: boolean,
        references_by: string,
        referenced_table: string,
        referenced_by: string
      ) => {
        console.log("addColumn in Table mock was called");
        super.addColumn(
          column,
          references_table,
          is_editable,
          references_by,
          referenced_table,
          referenced_by
        );
      }
    );
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
  setLookupTables = vi.fn().mockImplementation((lookupTables: string) => {
    console.log("setLookupTables in Table mock was called");
    super.setLookupTables(lookupTables);
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
  getReferencesTable = vi.fn().mockImplementation(() => {
    console.log("getReferencesTable in Column mock was called");
    return "references_table";
  });
  setReferencesTable = vi.fn().mockImplementation((references_table: string) => {
    console.log("setReferencesTable in Column mock was called");
    super.setReferenceTable(references_table);
  });
  getReferencesBy = vi.fn().mockImplementation(() => {
    console.log("getReferencesBy in Column mock was called");
    return "references_by";
  });
  setReferencesBy = vi.fn().mockImplementation((references_by: string) => {
    console.log("setReferencesBy in Column mock was called");
    super.setReferencesBy(references_by);
  });

}
