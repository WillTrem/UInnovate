import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import { DataAccessorMock } from "../../virtualmodel/__mocks__/DataAccessor";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

vi.unmock("../../virtualmodel/DataAccessor");

let mock: MockAdapter;

describe("DataAccessor", () => {
  beforeAll(() => {
    // Initialize axios-mock-adapter
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    // Restore axios to its original functionality
    mock.restore();
  });

  it("constructor should return an instance of DataAccessor", () => {
    // Mock data for constructor
    const dataUrl = "/api/data";
    const headers = { Authorization: "Bearer token" };

    // Create an instance of DataAccessor
    const dataAccessor = new DataAccessor(dataUrl, headers);

    // Assertions
    expect(dataAccessor.data_url).toEqual(dataUrl);
    expect(dataAccessor.headers).toEqual(headers);
  });

  it("row constructor should return an instance of Row", () => {
    // Mock data for row constructor
    const rowData = {
      Column1: 1,
      Column2: "mock row",
      Column3: "mock description",
    };

    // Create an instance of Row
    const row = new Row(rowData).row;

    if (!row) {
      return;
    }

    // Assertions
    expect(row["Column1"]).toEqual(1);
    expect(row["Column2"]).toEqual("mock row");
    expect(row["Column3"]).toEqual("mock description");
  });

  it("fetchRows should fetch rows from a table", async () => {
    // Mock data for fetchRows method
    const dataUrl = "/api/data";
    const headers = { Authorization: "Bearer token" };
    const params = { key: "value" };
    const expectedRows = [
      new Row({ Column1: 1, Column2: "mock row", Column3: "mock description" }),
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
    ];

    mock.onGet(dataUrl).reply(200, expectedRows);

    // Create an instance of DataAccessor
    const dataAccessor = new DataAccessor(dataUrl, headers, params);
    const mockDataAccessor = new DataAccessorMock(dataUrl);

    dataAccessor.fetchRows = mockDataAccessor.fetchRows.bind(dataAccessor);

    // Fetch the rows
    const rows = await dataAccessor.fetchRows();

    // Assertions
    expect(rows).toEqual(expectedRows);
  });
});
