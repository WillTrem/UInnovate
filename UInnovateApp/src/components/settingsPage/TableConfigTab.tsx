import React, { useState } from "react";
import Switch from "@mui/material/Switch";
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem'
import Card from "react-bootstrap/Card";

import { TableVisibilityType } from "../../contexts/TableVisibilityContext"; // Adjust the import path as necessary
import { TableDisplayType } from "../../virtualmodel/Tables";

import "../../styles/TableItem.css"
import { ColumnConfig } from "./ColumnConfig";
import { useConfig } from "../../contexts/ConfigContext";
import ConfigProperty from "../../virtualmodel/ConfigProperties";
import { ConfigValueType } from "../../contexts/ConfigContext";

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
	const [displayType, setDisplayType] = useState<string>(TableDisplayType.listView); // Local state keeping the display type value selected
	const {config, updateConfig} = useConfig();
	
	// Updates the local configuration with a table-specific configuration value 
	const updateTableConfig = (property: ConfigProperty, value: string) => {
	  const newConfigValue: ConfigValueType = {
		property,
		table: tableName,
		value
	  }
	  updateConfig(newConfigValue);
	}

	// Handle the change event for the toggle switch
	const handleToggle = () => {
		toggleVisibility((prevVisibility) => ({
			...prevVisibility,
			[tableName]: !isVisible,
		}));
		updateTableConfig(ConfigProperty.TABLE_VISIBLE, (!isVisible).toString())
	};

	const handleDisplayTypeSelect = (event: SelectChangeEvent<string>) => {
		const newDisplayType = event.target.value;
		setDisplayType(newDisplayType);
		updateTableConfig(ConfigProperty.TABLE_VIEW, newDisplayType);
	}

	return (<>
		{/* Table Specific Pane  */}
			<Card>
				<Card.Body>
					<Card.Title>Table specific configuration </Card.Title>
						<div className="config-pane">
							<div className="d-flex flex-row align-items-center">
								<span className="px-3">Visible</span>
								<Switch defaultChecked={isVisible} onChange={handleToggle}/>
							</div>
							<FormControl size="small">
								<h6>Display Type</h6>
								<Select
							data-testid="display-type-table-config"
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
			<br />
			{/* Column Specific configuration pane */}
			<Card>
				<Card.Body>
					<Card.Title>Column specific configuration</Card.Title>
					<div>
						<ColumnConfig tableName={tableName}/>
					</div>
				</Card.Body>
			</Card>
	</>
	);
};
