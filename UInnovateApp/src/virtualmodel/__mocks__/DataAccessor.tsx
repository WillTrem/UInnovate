import { vi } from "vitest";
import { Row } from "../DataAccessor";

export { Row };
export class DataAccessorMock {
  constructor() {}

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
    return Promise.resolve([]);
  });

  upsert = vi.fn().mockImplementation(() => {
    console.log("upsert in DataAccessor mock was called");
    return Promise.resolve();
  });
}
