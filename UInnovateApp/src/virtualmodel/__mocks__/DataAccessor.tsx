import { vi } from "vitest";
export class DataAccessorMock {
  constructor() {}

  fetchRows = vi.fn().mockImplementation(() => {
    console.log("fetchRows in DataAccessor mock was called");
    return Promise.resolve([]);
  });

  // Add any other methods that you want to mock
}
