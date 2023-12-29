import { vi } from "vitest";

export class FunctionAccessorMock {
  constructor() {}

  setBody = vi.fn().mockImplementation(() => {
    console.log("setBody in FunctionAccessor mock was called");
  });

  executeFunction = vi.fn().mockImplementation(() => {
    console.log("executeFunction in FunctionAccessor mock was called");
    return Promise.resolve();
  });

}
