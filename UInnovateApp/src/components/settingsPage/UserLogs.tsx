//display the user logs, get data from user_logs table in db

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
  const [rows, setRows] = useState<GridRowId[]>([]);
  const [users, setUsers] = useState<Row[]>([]);

  const getUsers  = async () => {
    const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
			"meta",
			"user_info"
		);

		const rows = await data_accessor.fetchRows();
		if (rows) {
			setUsers(rows);
		}
  } 

  useEffect(() => {
    getUsers();
    axiosCustom.get("http://localhost:5173/api/logs").then((response) => {
      setRows(response.data);
    });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}
