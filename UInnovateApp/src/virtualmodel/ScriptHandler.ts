import { Row, DataAccessor } from "../virtualmodel/DataAccessor";
import vmd, { Table, Schema } from "../virtualmodel/VMD";

/* This class will be used to define methods that users can use to 
interact with a table in the list view page through custom scripts
*/

class ScriptHandler {
  public script: Row;
  public table: Table;

  private readonly schema: Schema;

  // This constructor will be used to initialize the script handler
  constructor(script: Row, table: Table) {
    this.script = script;
    this.table = table;

    const schema = vmd.getTableSchema(this.table.table_name);

    if (!schema) {
      throw new Error("Table schema not found");
    }
    this.schema = schema;
  }

  // This method will be used to add a row to the table
  public addRow() {}

  // This method will be used to remove a row from the table
  public removeRow() {}

  // This method will be used to update a row in the table
  public updateRow() {}

  // This method will be used to get a row from the table
  public getRow() {}

  // This method will be used to get all rows from the table
  public getAllRows() {}

  // This method will be used to get a column from the table
  public getColumn() {}

  // This method will be used to get all columns from the table
  public getAllColumns() {}
}

export default ScriptHandler;
