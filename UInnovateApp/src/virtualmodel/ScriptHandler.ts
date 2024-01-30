import { Row } from "../virtualmodel/DataAccessor";
import { Table } from "../virtualmodel/VMD";
import vmd from "./VMD";

/* This class will be used to define methods that users can use to 
interact with a table in the list view page through custom scripts
*/

class ScriptHandler {
  public script: Row;
  public table: Table;

  // This constructor will be used to initialize the script handler
  constructor(script: Row, table: Table) {
    this.script = script;
    this.table = table;
  }

  public addRow() {}

  // This method will be used to remove a row from the table
  public removeRow() {
    // Remove a row from the table
  }

  // This method will be used to update a row in the table
  public updateRow() {
    // Update a row in the table
  }

  // This method will be used to get a row from the table
  public getRow() {
    // Get a row from the table
  }

  // This method will be used to get all rows from the table
  public getAllRows() {
    // Get all rows from the table
  }

  // This method will be used to get a column from the table
  public getColumn() {
    // Get a column from the table
  }

  // This method will be used to get all columns from the table
  public getAllColumns() {
    // Get all columns from the table
  }
}

export default ScriptHandler;
