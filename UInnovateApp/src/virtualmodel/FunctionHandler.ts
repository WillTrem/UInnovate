import { DataAccessor, Row } from "./DataAccessor";
import vmd, { Table } from "./VMD";
import { callProcedure, ProcedureSchedulingParams} from './PlatformFunctions';

/* This class will be used to define methods that users can use to 
interact with a table in the list view page through custom scripts
*/
class FunctionHandler {
  private functions: Row;
  private schema_name: string | undefined;

  private table_data: Row[] | undefined = {} as Row[];
  private new_table_data: Row[] = {} as Row[];

  private table: Table = {} as Table;
  private accessor: DataAccessor = {} as DataAccessor;

  constructor(functions: Row) {
    this.functions = functions;
    this.schema_name = vmd.getTableSchema(functions["table_name"])?.schema_name;
    this.accessor = {} as DataAccessor;

    if (this.schema_name) {
      this.table = vmd.getTable(
        this.schema_name,
        functions["table_name"]
      ) as Table;
    }
  }

  async init() {
    if (this.table && this.schema_name) {
      this.accessor = vmd.getRowsDataAccessor(
        this.schema_name,
        this.table.table_name
      );

      try {
        this.table_data = await this.accessor.fetchRows();
      } catch (error) {
        throw new Error("Error fetching table data: " + error);
      }
    }
  }
  async executeFunction(){
    const params: ProcedureSchedulingParams = {
        functionName: this.functions["procedure"],
        schema: this.functions["schema"]
    };
    callProcedure(params)
        .then(() => {
            alert(this.functions["procedure"] + ' executed successfully');
        })
        .catch(error => {
            console.error('Error executing procedure:', error);
            alert('Error executing procedure: ' + error.message);
        });
};
}
export default FunctionHandler;
