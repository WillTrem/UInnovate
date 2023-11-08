import { Table } from "react-bootstrap";
import { useTableAttributes } from "../../contexts/TablesContext"
import { useState } from "react";
import Switch from "@mui/material/Switch";
import "../../styles/TableItem.css"
import { ConfigValueType, useConfig } from "../../contexts/ConfigContext";
import ConfigProperty from "../../virtualmodel/ConfigProperties";

interface ColumnConfigProps{
	tableName: string
}

interface ColumnConfigRowProps{
	columnName: string,
	tableName: string,
	isVisible?: boolean,
}

export const ColumnConfig: React.FC<ColumnConfigProps> = ({tableName}: ColumnConfigProps) => {
  const attributes = useTableAttributes(tableName);
  const configProperties  = ["Visible"]; // Add more configuration properties for columns here 

	return <table className="column-config-table">
		<thead>
			<tr>
			<td></td>
			{configProperties.map((property) => {
			return <td key={property} >{property}</td>
			})}
			</tr>
		</thead>
		<tbody>
			{attributes && attributes.map((attribute) => {
			  return <ColumnConfigRow tableName={tableName} columnName={attribute} key={attribute}/>
			})}
		</tbody>
	</table>
}

const ColumnConfigRow: React.FC<ColumnConfigRowProps> = ({columnName, isVisible = true, tableName}: ColumnConfigRowProps) => {
	const [visible, setVisible] = useState(isVisible);
	const {config, updateConfig} = useConfig();
	
	// Updates the local configuration with a column-specific configuration value 
	function updateColumnConfig(property: ConfigProperty, value: string){
		const newConfigValue: ConfigValueType = {
			property,
			table: tableName,
			column: columnName,
			value
		  };
		  updateConfig(newConfigValue);
	}

	function handleToggle(){
		setVisible(!visible);
		updateColumnConfig(ConfigProperty.VISIBLE, (!visible).toString());
	}
	
	return <tr>
		<td className="semi-bold">{columnName}</td>
		<td><Switch defaultChecked={isVisible} onChange={handleToggle}/></td>
		{/* Add more configuration properties for columns here as <td> */}
	</tr>
}