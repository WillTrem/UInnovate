import { DataAccessor } from "../virtualmodel/DataAccessor";
import vmd from "./VMD";

export default class Logger {
  static async logUserAction(
    userID: string,
    action: string,
    details: string,
    schemaName: string,
    tableName: string
  ) {
    const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
      "meta",
      "user_logs",
     {
        timestamp: new Date().toISOString(),
        user_id: userID,
        action: action,
        details: details,
        schema_name: schemaName,
        table_name: tableName,
      }
    );
    await data_accessor.addRow();
  }
}
