import { vi } from "vitest";
import { Row } from "../DataAccessor";

export { Row };
export class DataAccessorMock {
  data_url: string | undefined = "";
  headers = {};
  params = {};
  values?: Row;

  constructor(data_url?: string, headers?: any) {
    this.data_url = data_url;
    this.headers = { Authorization: "Bearer token" };
  }

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
    if (this.data_url === "/api/data") {
      return Promise.resolve([
        new Row({
          Column1: 1,
          Column2: "mock row",
          Column3: "mock description",
        }),
        new Row({
          Column1: 2,
          Column2: "mock row 2",
          Column3: "mock description 2",
        }),
        new Row({
          Column1: 3,
          Column2: "mock row 3",
          Column3: "mock description 3",
        }),
      ]);
    } else {
      return Promise.resolve([]);
    }
  });

  upsert = vi.fn().mockImplementation(() => {
    console.log("upsert in DataAccessor mock was called");
    return Promise.resolve();
  });
}
