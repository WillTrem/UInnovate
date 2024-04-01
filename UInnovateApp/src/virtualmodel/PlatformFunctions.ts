import vmd from "./VMD";
import { Row } from "./DataAccessor";
import axiosCustom from "../api/AxiosCustom";

const API_BASE_URL = "http://localhost:3000/"; // Base URL of your PostgREST API

export interface ProcedureSchedulingParams {
  functionName: string;
  stored_procedure?: string;
  cron_schedule?: string;
  schema?: string;
}

export async function fetchFunctionNames(schema: string) {
  try {
    const response = await axiosCustom.get(`${API_BASE_URL}`, {
      headers: { "Accept-Profile": `${schema}` },
    });
    const swaggerDoc = response.data;

    const rpcFunctions = Object.keys(swaggerDoc.paths)
      .filter((path) => path.startsWith("/rpc/"))
      .map((path) => path.substring(5)); // Removes '/rpc/' to get the function name

    return rpcFunctions;
  } catch (error) {
    console.error("Error fetching or parsing Swagger documentation:", error);
    return [];
  }
}
export async function fetchProcedureNamesWithNoArgs(schema: string) {
  try {
    const func = await vmd.getFunctionAccessor(
      "meta" || "",
      "get_procedures_with_no_args"
    );
    const input = new Row();
    input.p_schema = schema;

    func.setBody(input);
    const response = await func.executeFunction();
    return response.data.map(row => row.function_name);
  } catch (error) {
    console.error("Error fetching procedures with no arguments:", error);
    return [];
  }
}
export async function fetchProcedureSource(
  schema: string,
  functionName: string
): Promise<{ source_code: string; arg_count: number }> {
  const func = await vmd.getFunctionAccessor(
    "meta" || "",
    "get_function_source_code_and_arg_count"
  );
  const input = new Row();
  input.p_schema_name = schema;
  input.p_function_name = functionName;

  func.setBody(input);
  const response = await func.executeFunction();
  return {
    source_code: response?.data[0].source_code,
    arg_count: response?.data[0].arg_count,
  };
}

export async function callProcedure(
  params: ProcedureSchedulingParams
): Promise<void> {
  if (params.schema === undefined) {
    return;
  }
  const func = await vmd.getFunctionAccessor(
    params.schema || "",
    params.functionName
  );
  const input = new Row();
  // TODO: Add input parameters to the input row

  func.setBody(input);
  await func.executeFunction();
}

export async function scheduleProcedure(
  params: ProcedureSchedulingParams
): Promise<void> {
  // 1. Ask VMD to give schema for cron
  const schema = await vmd.getSchema("cron");

  // 2. Get function accessor for schedule job by name
  const func = await vmd.getFunctionAccessor(
    schema?.schema_name || "",
    params.functionName
  );
  const input = new Row();
  input.stored_procedure = params.stored_procedure;
  input.cron_schedule = params.cron_schedule;
  func.setBody(input);
  // 3. Call the function accessor with the schedule
  await func.executeFunction();
}

export async function unscheduleProcedure(
  params: ProcedureSchedulingParams
): Promise<void> {
  // 1. Ask VMD to give schema for cron
  const schema = await vmd.getSchema("cron");
  // 2. Get function accessor for unschedule job by name
  const func = await vmd.getFunctionAccessor(
    schema?.schema_name || "",
    params.functionName
  );
  const input = new Row();
  input.stored_procedure = params.stored_procedure;
  func.setBody(input);
  // 3. Call the function accessor with the schedule
  await func.executeFunction();
}
