import { Row } from "../virtualmodel/DataAccessor";
import vmd, { Table, Schema } from "../virtualmodel/VMD";
import {
  ScriptErrorPopup,
  ScriptSuccessPopup,
} from "../components/ScriptPopup";

/* This class will be used to define methods that users can use to 
interact with a table in the list view page through custom scripts
*/
class ScriptHandler {
  public script: Row;
  public table: Table = new Table("");

  private readonly schema: Schema;
  private readonly primary_key: string = this.table.getPrimaryKey()
    ?.column_name as string;

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
  // We need to refetch schemas to dynamically update the display of the table
  public addRow(row: Row) {
    const accessor = vmd.getAddRowDataAccessor(
      this.schema.schema_name,
      this.table.table_name,
      row
    );

    try {
      accessor.addRow();
    } catch (error) {
      ScriptErrorPopup({ onClose: () => {}, error: error as string | Error });
      return;
    }

    vmd.refetchSchemas();
    return ScriptSuccessPopup({ onClose: () => {} });
  }

  // This method will be used to remove a row from the table
  // Controversial method, we need to discuss how to implement this
  public removeRow(row: Row) {
    const accessor = vmd.getRemoveRowAccessor(
      this.schema.schema_name,
      this.table.table_name,
      this.primary_key,
      row[this.primary_key]
    );

    try {
      accessor.deleteRow();
    } catch (error) {
      ScriptErrorPopup({ onClose: () => {}, error: error as string | Error });
      return;
    }

    vmd.refetchSchemas();
    ScriptSuccessPopup({ onClose: () => {} });
  }

  // This method will be used to update a row in the table
  public updateRow(row: Row) {
    const accessor = vmd.getUpdateRowDataAccessor(
      this.schema.schema_name,
      this.table.table_name,
      row
    );

    try {
      accessor.updateRow();
    } catch (error) {
      ScriptErrorPopup({ onClose: () => {}, error: error as string | Error });
      return;
    }

    vmd.refetchSchemas();
    ScriptSuccessPopup({ onClose: () => {} });
  }

  // This method will be used to get all rows from the table
  public getAllRows() {
    const accessor = vmd.getRowsDataAccessor(
      this.schema.schema_name,
      this.table.table_name
    );

    try {
      return accessor.fetchRows();
    } catch (error) {
      ScriptErrorPopup({ onClose: () => {}, error: error as string | Error });
      return;
    }
  }

  // This method will be used to get one column from a table
  public getColumn(columnName: string) {
    return this.table.getColumn(columnName);
  }

  // This method will be used to get all columns from the table
  public getAllColumns() {
    return this.table.getColumns();
  }
}

export default ScriptHandler;
