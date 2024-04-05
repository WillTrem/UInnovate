import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import * as AxiosCustom from "../../api/AxiosCustom";
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
    // Arrange
    const schema = "cron";
    const mockResponse = {
      paths: {
        "/rpc/function1": {},
        "/rpc/function2": {},
        "/not-rpc/function3": {},
      },
    };

    const mockGet = vi.spyOn(AxiosCustom.default, "get");
    mockGet.mockImplementation(() => Promise.resolve({ data: mockResponse }));

    // Act
    const result = await fetchFunctionNames(schema);

    // Assert
    expect(result).toEqual(["function1", "function2"]);
  });

  it("should return an empty array when an error occurs", async () => {
    // Arrange
    const schema = "cron";

    const mockGet = vi.spyOn(AxiosCustom.default, "get");
    mockGet.mockImplementation(() =>
      Promise.reject(new Error("Network error"))
    );

    // Act
    const result = await fetchFunctionNames(schema);

    // Assert
    expect(result).toEqual([]);
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
      "meta",
      "execute_procedure"
    );

    // Verify that func.setBody was called with the correct arguments
    expect(mockFunc.setBody).toHaveBeenCalledWith({
      schema_name: "your-schema",
      procedure_name: "your-function-name",
      // Add other properties if needed
    }); // Replace with the expected input row

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
      schema: "your-schema",
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
      params.functionName,
    );
    // Verify that func.setBody was called with the correct arguments
    expect(mockFunc.setBody).toHaveBeenCalledWith({
      stored_procedure: `${params.schema}.${params.stored_procedure}`,
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
      schema: "your-schema",
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
      stored_procedure: `${params.schema}.${params.stored_procedure}`,
    });

    // Verify that func.executeFunction was called
    expect(mockFunc.executeFunction).toHaveBeenCalled();
  });
});
