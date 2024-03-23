import { vi } from "vitest";
import { Row } from "../DataAccessor";

export class FunctionAccessorMock {
  function_name: string = "";
  body?: Row;
  constructor(function_name?: string) {
    if (function_name) {
      this.function_name = function_name;
    }
  }

  setBody = vi.fn().mockImplementation((body: Row) => {
    console.log("setBody in FunctionAccessor mock was called");
    this.body = body;
  });

  executeFunction = vi.fn().mockImplementation(() => {
    console.log("executeFunction in FunctionAccessor mock was called");

    switch (this.function_name) {
      case "verify_signup": if (this.body && this.body["email"] === "noregister@test.com") {
        return Promise.resolve({ status: 400, data: { code: "01000" } })
      }
      else { return Promise.resolve({ status: 200 }) };

      case "login": if (this.body && this.body["password"] === 'valid_password') {
        return Promise.resolve({ status: 200, data: { token: "valid_token" } });
      } else { return Promise.reject() }

      default: return Promise.resolve();
    }
  });

}
