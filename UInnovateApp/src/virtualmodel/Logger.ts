// Purpose: log user action to the database
// logs timestamp, userid, action, details, schema, and table
// userid are from the user that is logged in
// action is the action that the user performed
import axiosCustom from "../api/AxiosCustom";

export default class Logger {
  static logUserAction(
    userID: string,
    action: string,
    details: string,
    schemaName: string,
    tableName: string
  ) {
    axiosCustom.post("/api/logs", {
      timestamp: new Date().toISOString(),
      user: userID,
      action,
      details,
      schema: schemaName,
      table: tableName,
    });
  }
}