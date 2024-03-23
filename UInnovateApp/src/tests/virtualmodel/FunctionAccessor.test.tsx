import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { FunctionAccessor } from "../../virtualmodel/FunctionAccessor";
import { Row } from "../../virtualmodel/DataAccessor";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let mock: MockAdapter;

describe("FunctionAccessor", () => {
  beforeAll(() => {
    // Initialize axios-mock-adapter
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    // Restore axios to its original functionality
    mock.restore();
  });

  it("setBody should set the body of the function API call", () => {
    // Mock data for setBody method
    const functionUrl = "/api/function";
    const headers = { Authorization: "Bearer token" };
    const params = { key: "value" };
    const body = new Row({ column1: "value1" });

    // Mock the POST request with the expected data
    mock
      .onPost("/api/function", body, { headers, params })
      .reply(200 /* mock response data for executeFunction */);

    // Create an instance of FunctionAccessor
    const functionAccessor = new FunctionAccessor(functionUrl, headers, params);

    // Set the body
    functionAccessor.setBody(body);

    // Assertions
    expect(functionAccessor.values).toEqual(body);
  });
});
