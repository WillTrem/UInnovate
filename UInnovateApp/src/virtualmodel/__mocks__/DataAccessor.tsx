import { vi } from "vitest";
import { Row } from "../DataAccessor";
import { ConfigProperty } from "../ConfigProperties";

export { Row };
let mock_schema_name = "";
let mock_table_name = "";
export class DataAccessorMock {
  constructor(schema_name?, table_name?) {
    mock_schema_name = schema_name;
    mock_table_name = table_name;
  }

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
    if (mock_schema_name == "meta" && mock_table_name == "appconfig_values") {
      return Promise.resolve([
        {
          column: "Column1",
          table: "Table1",
          property: ConfigProperty.COLUMN_DISPLAY_TYPE,
          value: "datetime",
        },
        {
          column: "Column2",
          table: "Table1",
          property: ConfigProperty.COLUMN_DISPLAY_TYPE,
          value: "date",
        },
        {
          column: "Column3",
          table: "Table1",
          property: ConfigProperty.COLUMN_DISPLAY_TYPE,
          value: "categories",
        },
      ]);
    }
    return Promise.resolve([]);
  });

  upsert = vi.fn().mockImplementation(() => {
    console.log("upsert in DataAccessor mock was called");
    return Promise.resolve();
  });
}
