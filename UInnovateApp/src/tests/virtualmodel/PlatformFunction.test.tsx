import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  fetchFunctionNames,
  fetchProcedureSource,
  callProcedure,
  scheduleProcedure,
  unscheduleProcedure,
} from "../../virtualmodel/PlatformFunctions";
import VMD from "../../virtualmodel/__mocks__/VMD";
import { Row } from "../../virtualmodel/DataAccessor";

let mock: MockAdapter;

beforeAll(() => {
  mock = new MockAdapter(axios);
});

afterAll(() => {
  mock.restore();
});

describe("PlatformFunction", () => {
  it("should return function names from Swagger documentation", async () => {
    const schema = "meta";
    const mockResponse = {
      paths: {
        "/rpc/signup": {},
        "/rpc/update_default_role": {},
        "/rpc/update_user_data": {},
        "/rpc/export_appconfig_to_json": {},
        "/rpc/export_scripts_to_json": {},
        "/rpc/token_refresh": {},
        "/rpc/verify_signup": {},
        "/rpc/import_appconfig_from_json": {},
        "/rpc/login": {},
        "/rpc/export_i18n_to_json": {},
        "/rpc/insert_custom_view": {},
        "/rpc/import_i18n_from_json": {},
        "/rpc/create_user": {},
        "/rpc/get_function_source_code_and_arg_count": {},
        "/rpc/import_env_vars_from_json": {},
        "/rpc/logout": {},
        "/rpc/import_scripts_from_json": {},
        "/rpc/export_env_vars_to_json": {},
      },
    };

    mock.onGet("http://localhost:3000/").reply(200, mockResponse);

    const result = await fetchFunctionNames(schema);

    expect(result).toEqual([
      "signup",
      "update_default_role",
      "update_user_data",
      "export_appconfig_to_json",
      "export_scripts_to_json",
      "token_refresh",
      "verify_signup",
      "import_appconfig_from_json",
      "login",
      "export_i18n_to_json",
      "insert_custom_view",
      "import_i18n_from_json",
      "create_user",
      "get_function_source_code_and_arg_count",
      "import_env_vars_from_json",
      "logout",
      "import_scripts_from_json",
      "export_env_vars_to_json",
    ]);
  });
  it("should return source code and argument count", async () => {
    // Arrange
    const schema = "your-schema";
    const functionName = "your-function-name";
    const mockResponse = {
      data: [
        {
          source_code: "your-source-code",
          arg_count: 1,
        },
      ],
    };

    // Mock vmd.getFunctionAccessor
    const mockFunc = {
      setBody: vi.fn(),
      executeFunction: vi.fn().mockResolvedValue(mockResponse),
    };
    vi.spyOn(VMD, "getFunctionAccessor").mockResolvedValue(mockFunc);

    // Act
    const result = await fetchProcedureSource(schema, functionName);

    // Assert
    expect(result).toEqual({
      source_code: "your-source-code",
      arg_count: 1,
    });

    // Verify that vmd.getFunctionAccessor was called with the correct arguments
    expect(VMD.getFunctionAccessor).toHaveBeenCalledWith(
      "meta",
      "get_function_source_code_and_arg_count"
    );

    // Verify that func.setBody was called with the correct arguments
    expect(mockFunc.setBody).toHaveBeenCalledWith({
      p_schema_name: schema,
      p_function_name: functionName,
    });

    // Verify that func.executeFunction was called
    expect(mockFunc.executeFunction).toHaveBeenCalled();
  });

  it("should call the procedure with the given parameters", async () => {
    // Arrange
    const params = {
      schema: "your-schema",
      functionName: "your-function-name",
      // TODO: Add other parameters if needed
    };

    // Mock vmd.getFunctionAccessor
    const mockFunc = {
      setBody: vi.fn(),
      executeFunction: vi.fn(),
    };
    vi.spyOn(VMD, "getFunctionAccessor").mockResolvedValue(mockFunc);

    // Act
    await callProcedure(params);

    // Assert
    // Verify that vmd.getFunctionAccessor was called with the correct arguments
    expect(VMD.getFunctionAccessor).toHaveBeenCalledWith(
      params.schema,
      params.functionName
    );

    // Verify that func.setBody was called with the correct arguments
    expect(mockFunc.setBody).toHaveBeenCalledWith(new Row()); // Replace with the expected input row

    // Verify that func.executeFunction was called
    expect(mockFunc.executeFunction).toHaveBeenCalled();
  });

  it("should not call the procedure if schema is undefined", async () => {
    // Arrange
    const params = {
      schema: undefined,
      functionName: "your-function-name",
      // TODO: Add other parameters if needed
    };

    // Mock vmd.getFunctionAccessor
    const mockFunc = {
      setBody: vi.fn(),
      executeFunction: vi.fn(),
    };
    vi.spyOn(VMD, "getFunctionAccessor").mockResolvedValue(mockFunc);

    // Act
    await callProcedure(params);

    // Assert
    // Verify that vmd.getFunctionAccessor was not called
    expect(VMD.getFunctionAccessor).not.toHaveBeenCalled();

    // Verify that func.setBody was not called
    expect(mockFunc.setBody).not.toHaveBeenCalled();

    // Verify that func.executeFunction was not called
    expect(mockFunc.executeFunction).not.toHaveBeenCalled();
  });

  it("should schedule the procedure with the given parameters", async () => {
    // Arrange
    const params = {
      functionName: "your-function-name",
      stored_procedure: "your-stored-procedure",
      cron_schedule: "your-cron-schedule",
      // TODO: Add other parameters if needed
    };
    const mockSchema = { schema_name: "your-schema" };

    // Mock vmd.getSchema and vmd.getFunctionAccessor
    vi.spyOn(VMD, "getSchema").mockResolvedValue(mockSchema);
    const mockFunc = {
      setBody: vi.fn(),
      executeFunction: vi.fn(),
    };
    vi.spyOn(VMD, "getFunctionAccessor").mockResolvedValue(mockFunc);

    // Act
    await scheduleProcedure(params);

    // Assert
    // Verify that vmd.getSchema was called with the correct arguments
    expect(VMD.getSchema).toHaveBeenCalledWith("cron");

    // Verify that vmd.getFunctionAccessor was called with the correct arguments
    expect(VMD.getFunctionAccessor).toHaveBeenCalledWith(
      mockSchema.schema_name,
      params.functionName
    );

    // Verify that func.setBody was called with the correct arguments
    expect(mockFunc.setBody).toHaveBeenCalledWith({
      stored_procedure: params.stored_procedure,
      cron_schedule: params.cron_schedule,
    });

    // Verify that func.executeFunction was called
    expect(mockFunc.executeFunction).toHaveBeenCalled();
  });

  it("should unschedule the procedure with the given parameters", async () => {
    // Arrange
    const params = {
      functionName: "your-function-name",
      stored_procedure: "your-stored-procedure",
      // TODO: Add other parameters if needed
    };
    const mockSchema = { schema_name: "your-schema" };

    // Mock vmd.getSchema and vmd.getFunctionAccessor
    vi.spyOn(VMD, "getSchema").mockResolvedValue(mockSchema);
    const mockFunc = {
      setBody: vi.fn(),
      executeFunction: vi.fn(),
    };
    vi.spyOn(VMD, "getFunctionAccessor").mockResolvedValue(mockFunc);

    // Act
    await unscheduleProcedure(params);

    // Assert
    // Verify that vmd.getSchema was called with the correct arguments
    expect(VMD.getSchema).toHaveBeenCalledWith("cron");

    // Verify that vmd.getFunctionAccessor was called with the correct arguments
    expect(VMD.getFunctionAccessor).toHaveBeenCalledWith(
      mockSchema.schema_name,
      params.functionName
    );

    // Verify that func.setBody was called with the correct arguments
    expect(mockFunc.setBody).toHaveBeenCalledWith({
      stored_procedure: params.stored_procedure,
    });

    // Verify that func.executeFunction was called
    expect(mockFunc.executeFunction).toHaveBeenCalled();
  });
});
