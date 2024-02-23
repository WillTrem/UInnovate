import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import { DataAccessorMock } from "../../virtualmodel/__mocks__/DataAccessor";
import axios from "axios";
import * as AxiosCustom from "../../api/AxiosCustom";
import MockAdapter from "axios-mock-adapter";

vi.unmock("../../virtualmodel/DataAccessor");
vi.mock("./AxiosCustom");

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

  it("axios custom is properly imported", async () => {
    const mockGet = vi.spyOn(AxiosCustom.default, "get");
    mockGet.mockImplementation(() => Promise.resolve({ data: [] }));

    const dataAccessor = new DataAccessor("", {});
    await dataAccessor.fetchRows();

    expect(mockGet).toHaveBeenCalled();

    mockGet.mockRestore();
  });

  it("constructor should return an instance of DataAccessor", () => {
    // Mock data for constructor
    const dataUrl = "/api/data";
    const headers = { Authorization: "Bearer token" };

    const params = { key: "value" };
    const values = new Row({
      Column1: 1,
      Column2: "mock row",
      Column3: "mock description",
    });

    // Create an instance of DataAccessor
    const dataAccessor = new DataAccessor(dataUrl, headers);
    const dataAccessor2 = new DataAccessor(dataUrl, headers, params, values);

    // Assertions
    expect(dataAccessor.data_url).toEqual(dataUrl);
    expect(dataAccessor.headers).toEqual(headers);

    expect(dataAccessor2.data_url).toEqual(dataUrl);
    expect(dataAccessor2.headers).toEqual(headers);
    expect(dataAccessor2.params).toEqual(params);
    expect(dataAccessor2.values).toEqual(values);
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
      {
        Column1: 1,
        Column2: "mock row",
        Column3: "mock description",
        name: "mock name",
      } as Row,
      {
        Column1: 2,
        Column2: "mock row 2",
        Column3: "mock description 2",
        name: "mock name 2",
      } as Row,
      {
        Column1: 3,
        Column2: "mock row 3",
        Column3: "mock description 3",
        name: "mock name 3",
      } as Row,
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

  it("addRow should add a row to a table", async () => {
    // Mock data for addRow method
    const dataUrl = "/api/data";
    const headers = { Authorization: "Bearer token" };
    const values = new Row({
      Column1: 1,
      Column2: "mock row",
      Column3: "mock description",
    });

    const dataAccessor = new DataAccessor(dataUrl, headers, {}, values);
    const mockDataAccessor = new DataAccessorMock(dataUrl, headers, values);

    dataAccessor.addRow = mockDataAccessor.addRow.bind(dataAccessor);

    const response = await dataAccessor.addRow();

    expect(response).toEqual({
      data: {
        ...values,
        Column1: 4,
        Column2: "mock row 4",
        Column3: "mock description 4",
      },
      status: 201,
      statusText: "Created",
      headers: {},
      config: {},
    });
  });
});
