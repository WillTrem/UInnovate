import { vi } from "vitest";
import { Row } from "../DataAccessor";
import { ConfigProperty } from "../ConfigProperties";

export { Row };
export class DataAccessorMock {
  constructor() {}

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
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
  });

  upsert = vi.fn().mockImplementation(() => {
    console.log("upsert in DataAccessor mock was called");
    return Promise.resolve();
  });
}
