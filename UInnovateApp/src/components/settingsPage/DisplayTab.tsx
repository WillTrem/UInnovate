import Button from "react-bootstrap/Button";
import { useTableVisibility } from "../../contexts/TableVisibilityContext";
import { TableItem } from "./TableConfigTab";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
			<Tab.Container>
				<Row>
					<Col sm={3}>
						<Nav variant='pills' className="flex-column">
							{Object.keys(tableVisibility).map((tableName) => {
							  return (
							  <Nav.Item key={tableName}>
								<Nav.Link eventKey={tableName}>{tableName}</Nav.Link>
							  </Nav.Item>)
							})}
						</Nav>
					</Col>
					<Col sm = {9}>
					<Tab.Content>
						{tableItems.map((tableItem) => {
							const tableName = tableItem.props.tableName;
						  return(
							<Tab.Pane key = {tableName} eventKey={tableName}>
								{tableItem}
							</Tab.Pane>
						  )
						})}
					</Tab.Content>
					</Col>
				</Row>
			</Tab.Container>
			{/* <div className='table-list'>{tableItems}</div> */}
			<Button variant='primary' className='save-button'>
				Save Changes
			</Button>
		</div>
	);
};
