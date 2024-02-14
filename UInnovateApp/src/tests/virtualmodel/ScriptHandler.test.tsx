import { describe, it, expect, beforeAll, afterAll, Mock } from "vitest";
import { Table } from "../../virtualmodel/VMD";
import ScriptHandler from "../../virtualmodel/ScriptHandler";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";

import { ScriptHandlerMock } from "../../virtualmodel/__mocks__/ScriptHandler";
import * as VMDMock from "../../virtualmodel/__mocks__/VMD";

import axios from "axios";
import MockAdapter from "axios-mock-adapter";

vi.unmock("../../virtualmodel/VMD");
vi.unmock("../../virtualmodel/DataAccessor");

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

  const wrongMockScript = {
    id: 1,
    description: "mock description",
    content: "mock content",
    table_name: "wrong scripts",
  };

  it("should return an instance of ScriptHandler", () => {
    // Create an instance of ScriptHandler
    const scriptHandler = new ScriptHandler(mockScript);

    // Assertions
    expect(scriptHandler).toBeInstanceOf(ScriptHandler);
  });

  it("should initialize schema_name, table, script based on the script's table_name", () => {
    const scriptHandler: ScriptHandler = new ScriptHandlerMock(mockScript);

    expect(scriptHandler.getSchemaName()).toEqual("mock schema name");
    expect(scriptHandler.getTable().table_name).toEqual("mock table name");
    expect(scriptHandler.getScript()).toEqual(mockScript);
  });

  it("should have an undefined table if schema name is undefined", () => {
    VMDMock.default.getTableSchema = vi.fn().mockReturnValue(undefined);

    const mockedHandler: ScriptHandler = new ScriptHandlerMock(wrongMockScript);

    expect(mockedHandler.getTable()).toEqual({});
  });

  it("should initialize accessor and fetch table data if table and schema name exist", async () => {
    const mockedHandler: ScriptHandler = new ScriptHandlerMock(mockScript);

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

    expect(mockedHandler.getAccessor().data_url).toEqual("/api/data");
    expect(mockedHandler.getTableData()).toEqual(expectedRows);
  });

  it("should have an empty data accessor if no table or schema name exist", async () => {
    VMDMock.default.getTableSchema = vi.fn().mockReturnValue(undefined);

    const mockedHandler: ScriptHandler = new ScriptHandlerMock(mockScript);

    await mockedHandler.init();

    expect(mockedHandler.getAccessor().data_url).toEqual(undefined);
  });

  it("init should fail if fetching rows has an error", async () => {
    const mockedHandler: ScriptHandler = new ScriptHandlerMock(mockScript);

    mockedHandler.getAccessor().fetchRows = vi.fn().mockRejectedValue("error");

    try {
      await mockedHandler.init();
    } catch (error) {
      expect(error).toEqual(new Error("Error fetching data: error"));
    }
  });

  it("all gets should return the correct values", async () => {
    const mockedHandler = new ScriptHandlerMock(mockScript);

    expect(mockedHandler.getScript()).toEqual(mockScript);
    expect(mockedHandler.getTableData()).toEqual(mockedHandler.getTableData());
    expect(mockedHandler.getNewTableData()).toEqual(
      mockedHandler.getNewTableData()
    );
    expect(mockedHandler.getTable()).toEqual(mockedHandler.getTable());
    expect(mockedHandler.getAccessor()).toEqual(mockedHandler.getAccessor());
    expect(mockedHandler.getSchemaName()).toEqual(
      mockedHandler.getSchemaName()
    );
  });

  it("all sets should set the correct values", async () => {
    const mockedHandler: ScriptHandler = new ScriptHandlerMock(mockScript);

    const newScript = {
      id: 2,
      description: "new mock description",
      content: "new mock content",
      table_name: "new scripts",
    };

    const newTableData = [
      new Row({
        Column1: 1,
        Column2: "new mock row",
        Column3: "new mock description",
      }),
      new Row({
        Column1: 2,
        Column2: "new mock row 2",
        Column3: "new mock description 2",
      }),
      new Row({
        Column1: 3,
        Column2: "new mock row 3",
        Column3: "new mock description 3",
      }),
    ];

    const newTable = new Table("new mock table name") as Table;

    const newAccessor = new DataAccessor("/api/new-data", {});

    const newSchemaName = "new mock schema name";

    mockedHandler.setScript(newScript);
    mockedHandler.setTableData(newTableData);
    mockedHandler.setNewTableData(newTableData);
    mockedHandler.setTable(newTable);
    mockedHandler.setAccessor(newAccessor);
    mockedHandler.setSchemaName(newSchemaName);

    expect(mockedHandler.getScript()).toEqual(newScript);
    expect(mockedHandler.getTableData()).toEqual(newTableData);
    expect(mockedHandler.getNewTableData()).toEqual(newTableData);
    expect(mockedHandler.getTable()).toEqual(newTable);
    expect(mockedHandler.getAccessor()).toEqual(newAccessor);
    expect(mockedHandler.getSchemaName()).toEqual(newSchemaName);
  });
});
