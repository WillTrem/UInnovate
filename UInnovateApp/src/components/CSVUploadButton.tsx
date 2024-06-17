import { UploadFile } from "@mui/icons-material"
import { Box, Button } from "@mui/material"
import { VisuallyHiddenInput } from "./VisuallyHiddenInput"
import React, { useState } from "react"
import VMD, { Table } from "../virtualmodel/VMD";
import { loadCSVToDB, validateCSV } from "../helper/CSVHelper";
import { parse } from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { displayError, displayNotification } from "../redux/NotificationSlice";
import Logger from "../virtualmodel/Logger";
import { RootState } from "../redux/Store";

interface CSVUploadButtonProps {
	table: Table;
	getRows: () => Promise<void>;
}

export const CSVUploadButton: React.FC<CSVUploadButtonProps> = ({ table, getRows }) => {
	const dispatch = useDispatch();
	const loggedInUser = useSelector((state: RootState) => state.auth.user);
	function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event?.target?.files?.[0];
		if (file) {
			if (file.type !== 'text/csv') {
				dispatch(displayError(`ERROR: '${file.name}' is not in CSV format.`))
			}
			else {
				parse(file, {
					header: true, skipEmptyLines: true, complete: async (result) => {
						console.log(result);
						try {
							validateCSV(result, table);
							await loadCSVToDB(result, table);
							dispatch(displayNotification(`Succesfully loaded ${file.name} in table ${table.table_name}`));
							const schema = VMD.getTableSchema(table.table_name);
							Logger.logUserAction(
								loggedInUser || "",
								"Loaded CSV data",
								`Loaded CSV data from ${file.name} (${result.data.length} rows)`,
								schema?.schema_name || "",
								table.table_name
							);
							getRows();
						}
						catch (error: any) {
							if (error.response) {
								dispatch(displayError(`ERROR: ${error.response.data.message}`))
							}
							else if (error instanceof Error) {
								dispatch(displayError(`ERROR: ${error.message}`))
							}
							// Reset the value of the file input
						}
					}
				})
			}
			event.target.value = '';
		}
	}
	return <Button
		component="label"
		role={undefined}
		variant="contained"
		tabIndex={-1}
		endIcon={<UploadFile fontSize="small" />}
		style={{
			backgroundColor: "#404040",
			width: "fit-content",
			height: "fit-content",
			marginTop: "",
			display: "flex",
			flexDirection: "row",
			alignItems: "start"
		}}
	>
		Upload CSV
		<VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileUpload} />
	</Button>
}