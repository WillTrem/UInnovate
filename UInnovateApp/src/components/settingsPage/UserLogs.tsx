import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { DataAccessor } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 50 },
  { field: "timestamp", headerName: "Timestamp", width: 200 },
  { field: "user_id", headerName: "User", width: 200 },
  { field: "action", headerName: "Action", width: 150 },
  { field: "details", headerName: "Details", width: 900 },
  { field: "schema_name", headerName: "Schema Name", width: 150 },
  { field: "table_name", headerName: "Table Name", width: 150 },
];

export default function UserLogs() {
  const [logs, setLogs] = useState<GridRowId[]>([]);

  const getLogs = async () => {
		const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
			"meta",
			"user_logs",
		);

		const rows = await data_accessor.fetchRows();
		if (rows) {
      const logsWithIds = rows.map((row, index) => ({ id: index + 1, ...row }));
			setLogs(logsWithIds as unknown as GridRowId[]);
		}
	}

	useEffect(() => {
		getLogs();
	}, [])

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <DataGrid rows={logs} columns={columns} />
    </div>
  );
  }