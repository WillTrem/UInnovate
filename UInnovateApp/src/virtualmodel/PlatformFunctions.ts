import vmd from "./VMD";
import { Row } from "./DataAccessor";

export interface ProcedureSchedulingParams {
    functionName: string;
    stored_procedure: string;
    cron_schedule?: string;
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
