import { DataAccessor } from "../virtualmodel/DataAccessor";
import vmd from "./VMD";

export default class Audits {
  static async logAudits(
    userID: string,
    action: string,
    details: string,
    schemaName: string,
    tableName: string
  ) {
    const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
      "meta",
      "audit_trails",
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