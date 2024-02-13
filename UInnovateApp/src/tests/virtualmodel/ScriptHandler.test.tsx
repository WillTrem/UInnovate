import { describe, it, expect, beforeAll, afterAll, Mock } from "vitest";
import ScriptHandler from "../../virtualmodel/ScriptHandler";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";

import { ScriptHandlerMock } from "../../virtualmodel/__mocks__/ScriptHandler";
import * as VMDMock from "../../virtualmodel/__mocks__/VMD";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

vi.unmock("../../virtualmodel/VMD");
vi.unmock("../../virtualmodel/VMD");

let mock: MockAdapter;
let originalImplementation: Mock;

describe("ScriptHandler", () => {
  beforeAll(() => {
    // Initialize axios-mock-adapter
    mock = new MockAdapter(axios);
  });

  beforeEach(() => {
    originalImplementation = VMDMock.default.getTableSchema;
  });

  afterEach(() => {
    VMDMock.default.getTableSchema = originalImplementation;
  });

  afterAll(() => {
    // Restore axios to its original functionality
    mock.restore();
  });

  const mockScript = {
    id: 1,
    description: "mock description",
    content: "mock content",
    table_name: "scripts",
  };

  it("should return an instance of ScriptHandler", () => {
    // Create an instance of ScriptHandler
    const scriptHandler = new ScriptHandler(mockScript);

    // Assertions
    expect(scriptHandler).toBeInstanceOf(ScriptHandler);
  });

  it("should initialize schema_name, table, script based on the script's table_name", () => {
    const mockedHandler = new ScriptHandlerMock(mockScript);

    expect(mockedHandler.schema_name).toEqual("mock schema name");
    expect(mockedHandler.table.table_name).toEqual("mock table name");
    expect(mockedHandler.script).toEqual(mockScript);
  });

  it("should have an undefined table if schema name is undefined", () => {
    VMDMock.default.getTableSchema = vi.fn().mockReturnValue(undefined);

    const mockedHandler = new ScriptHandlerMock(mockScript);

    expect(mockedHandler.table).toEqual({});
  });

  it("should initialize accessor and fetch table data if table and schema name exist", async () => {
    const mockedHandler = new ScriptHandlerMock(mockScript);

    await mockedHandler.init();

    const expectedRows = [
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
    ];

    expect(mockedHandler.accessor.data_url).toEqual("/api/data");
    expect(mockedHandler.table_data).toEqual(expectedRows);
  });

  it("should have an empty data accessor if no table or schema name exist", async () => {
    VMDMock.default.getTableSchema = vi.fn().mockReturnValue(undefined);

    const mockedHandler = new ScriptHandlerMock(mockScript);

    await mockedHandler.init();

    expect(mockedHandler.accessor.data_url).toEqual(undefined);
  });

  it("init should fail if fetching rows has an error", async () => {
    const mockedHandler = new ScriptHandlerMock(mockScript);

    mockedHandler.accessor.fetchRows = vi.fn().mockRejectedValue("error");

    try {
      await mockedHandler.init();
    } catch (error) {
      expect(error).toEqual(new Error("Error fetching data: error"));
    }
  });
});
