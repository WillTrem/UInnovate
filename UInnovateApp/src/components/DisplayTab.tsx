import Button from "react-bootstrap/Button";
import { useTableVisibility } from "../contexts/TableVisibilityContext";
import { TableItem } from "./TableItem";
export const DisplayTab = () => {
	const { tableVisibility, setTableVisibility } = useTableVisibility();

	// Map over the table names and render TableItem components
	const tableItems = Object.keys(tableVisibility).map((tableName) => (
		<TableItem
			key={tableName}
			tableName={tableName}
			isVisible={tableVisibility[tableName]}
			toggleVisibility={setTableVisibility}
		/>
	));

	return (
		<div>
			<div className='customization-title'>Tables</div>
			<div className='table-list'>{tableItems}</div>
			<Button variant='primary' className='save-button'>
				Save Changes
			</Button>
		</div>
	);
};
