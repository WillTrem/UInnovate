import vmd from "./VMD";
import { Row } from "./DataAccessor";
import axiosCustom from "../api/AxiosCustom";

const API_BASE_URL = 'http://localhost:3000/'; // Base URL of your PostgREST API

export interface ProcedureSchedulingParams {
    functionName: string;
    stored_procedure: string;
    cron_schedule?: string;
}

export async function fetchFunctionNames(schema: string) {
    try {
      const response = await axiosCustom.get(`${API_BASE_URL}`, {
        headers: { "Accept-Profile": `${schema}` },
      });
      const swaggerDoc = response.data;
  
      const rpcFunctions = Object.keys(swaggerDoc.paths)
        .filter(path => path.startsWith('/rpc/'))
        .map(path => path.substring(5)); // Removes '/rpc/' to get the function name
  
      return rpcFunctions;
    } catch (error) {
      console.error('Error fetching or parsing Swagger documentation:', error);
      return [];
    }
  }

export async function scheduleProcedure(params: ProcedureSchedulingParams): Promise<void> {
    // TODO: 
    // 1. Ask VMD to give schema for cron
    const schema = await vmd.getSchema('cron');
    // 2. Ask to give all functions inside the schema
    
    // 3. Get function accessor for schedule job by name
    const func = await vmd.getFunctionAccessor(schema?.schema_name || '', params.functionName);
    const input = new Row();
    input.stored_procedure = params.stored_procedure;
    input.cron_schedule = params.cron_schedule;
    func.setBody(input);
    await func.executeFunction();

    // 4. Call the function accessor with the schedule
}

export async function unscheduleProcedure(params: ProcedureSchedulingParams): Promise<void> {
    // TODO: 
    // 1. Ask VMD to give schema for cron
    const schema = await vmd.getSchema('cron');
    // 2. Ask to give all functions inside the schema
    // 3. Get function accessor for unschedule job by name
    const func = await vmd.getFunctionAccessor(schema?.schema_name || '', params.functionName);
    const input = new Row();
    input.stored_procedure = params.stored_procedure;

    func.setBody(input);
    await func.executeFunction();
    // 4. Call the function accessor with the schedule
}
