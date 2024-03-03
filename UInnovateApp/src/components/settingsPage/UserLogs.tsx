import { useEffect, useState } from "react";
import axiosCustom from "../../api/AxiosCustom";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "timestamp", headerName: "Timestamp", width: 200 },
  { field: "user_id", headerName: "User", width: 200 },
  { field: "action", headerName: "Action", width: 150 },
  { field: "details", headerName: "Details", width: 200 },
  { field: "schema_name", headerName: "Schema Name", width: 150 },
  { field: "table_name", headerName: "Table Name", width: 150 },
];

export default function UserLogs() {
  const [logs, setLogs] = useState<GridRowId[]>([]);
  const [users, setUsers] = useState<Row[]>([]);

  const getLogs = async () => {
    try {
      const response = await axiosCustom.get("/settings/userlogs"); 
      const rows = response.data; 
      const userlogs: GridRowId[] = rows.map((row, index) => ({
        id: index,
        timestamp: row.timestamp,
        user_id: row.user_id,
        action: row.action,
        details: row.details,
        schema_name: row.schema_name,
        table_name: row.table_name,
      }));
      setLogs(userlogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const getUsers = async () => {
    try {
      const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
        "meta",
        "user_info"
      );
      const rows = await data_accessor.fetchRows();
      if (rows) {
        setUsers(rows);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
    getLogs();
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={logs} columns={columns} />
    </div>
  );
}