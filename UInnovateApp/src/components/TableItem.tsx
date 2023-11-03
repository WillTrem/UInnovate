import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Switch from "@mui/material/Switch";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'
import Card from "react-bootstrap/Card";

import { TableVisibilityType } from "../contexts/TableVisibilityContext"; // Adjust the import path as necessary
import { TableDisplayType } from "../virtualmodel/Tables";

import "../styles/TableItem.css"

interface TableItemProps {
	tableName: string;
	isVisible: boolean;
	toggleVisibility: (
		updateFn: (prevState: TableVisibilityType) => TableVisibilityType
	) => void;
}

export const TableItem: React.FC<TableItemProps> = ({
	tableName,
	isVisible,
	toggleVisibility,
}) => {
	const [hideCheckbox, setShowCheckbox] = useState(false); // Local state to manage checkbox display
	const [displayType, setDisplayType] = useState<string>(TableDisplayType.listView); // Local state keeping the display type value selected
	// Handle the change event for the checkbox
	const handleToggle = () => {
		toggleVisibility((prevVisibility) => ({
			...prevVisibility,
			[tableName]: !isVisible,
		}));
	};

	// Toggle the display of the checkbox
	const handleItemClick = () => {
		setShowCheckbox(!hideCheckbox);
	};

	const handleDisplayTypeSelect = (event: SelectChangeEvent<string>) => {
		setDisplayType(event.target.value);
	}

	return (<>
		{/* Table Specific Pane  */}
		<Card>
			<Card.Body>
				<Card.Title>Table specific settings - {tableName} </Card.Title>
					<div className="table-settings-pane-content">
						<FormControlLabel value="Visible" control={<Switch defaultChecked={isVisible} onChange={handleToggle}/>} label="Visible" labelPlacement="start"/>
						<FormControl size="small">
							<h6>Display Type</h6>
							<Select
							value={displayType}
							onChange={handleDisplayTypeSelect}
							displayEmpty>
							<MenuItem value={TableDisplayType.listView}>List View</MenuItem>
							<MenuItem value={TableDisplayType.enumView}>Enum View</MenuItem>
						</Select>
							<FormHelperText>To customize the default layout of the table</FormHelperText>
						</FormControl>
					</div>
			</Card.Body>
		</Card>
		<div className='table-item' /*onClick={handleItemClick}*/>
			<div className='text-table'>{tableName}</div>
			{!hideCheckbox && (
				<>
					<label className='switch'>
						<input
							type='checkbox'
							checked={isVisible}
							onChange={handleToggle}
						/>
						<span className='slider round'></span>
					</label>
					<Form.Select
						className='form-select'
						aria-label='Default select example'>
						<option value='1'>List View</option>
						<option value='2'>Enumeration View</option>
					</Form.Select>
				</>
			)}
		</div>
	</>
	);
};
