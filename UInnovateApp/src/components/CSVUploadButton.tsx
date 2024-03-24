import { CloudUpload } from "@mui/icons-material"
import { Box, Button } from "@mui/material"
import { VisuallyHiddenInput } from "./VisuallyHiddenInput"
import React, { useState } from "react"
import { Table } from "../virtualmodel/VMD";
import { validateCSV } from "../helper/CSVHelper";
import { parse } from "papaparse";

interface CSVUploadButtonProps {
	table: Table;
}

export const CSVUploadButton: React.FC<CSVUploadButtonProps> = ({table}) => {
	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>){
		const file = e?.target?.files?.[0];
		if(file){
			parse(file, {header: true, skipEmptyLines: true, complete: (result) => {
				console.log(result);
				validateCSV(result, table);
				
			}}) 
			
		}
	}
	return <Button
		component="label"
		role={undefined}
		variant="contained"
		tabIndex={-1}
		startIcon={<CloudUpload />}
		style={{
			backgroundColor: "#404040",
			width: "fit-content",
			marginTop: "",
			display: "flex",
			flexDirection: "row"
		}}
	>
		Upload CSV
		<VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileUpload} />
	</Button>
}