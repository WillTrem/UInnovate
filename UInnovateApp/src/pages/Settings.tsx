import { NavBar } from "../components/NavBar";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import "../styles/settings.css";
import attr from "../virtualmodel/Tables";
// import { TableVisibilityProvider } from "../TableVisibilityContext";
import { useTableVisibility } from "../TableVisibilityContext";

export function Settings() {
	const { tableVisibility, setTableVisibility } = useTableVisibility();
	const tableNames = Array.from(new Set(attr.map((table) => table.table_name)));
	// Toggle the visibility of a table
	const handleToggleVisibility = (tableName: string) => {
		setTableVisibility((prevState) => ({
			...prevState,
			[tableName]: !prevState[tableName],
		}));
	};

	return (
		<>
			<NavBar />
			<div className='page-layout'>
				<h1 className='title'> Settings</h1>
				<Tab.Container id='left-tabs-example' defaultActiveKey='first'>
					<Row>
						<Col sm={3}>
							<Nav variant='pills' className='flex-column'>
								<Nav.Item>
									<Nav.Link eventKey='first'>General</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey='second'>Display</Nav.Link>
								</Nav.Item>
							</Nav>
						</Col>
						<Col sm={9}>
							<Tab.Content>
								<Tab.Pane eventKey='first'>
									<Card>
										<ListGroup variant='flush'>
											<ListGroup.Item>
												<div className='customization-title'>
													Layout Personalization
												</div>
											</ListGroup.Item>
											<ListGroup.Item>
												<div className='customization-title'>
													Color Customization
												</div>
											</ListGroup.Item>
										</ListGroup>
									</Card>
								</Tab.Pane>
								<Tab.Pane eventKey='second'>
									<div className='customization-title'>Tables</div>
									<div className='table-list'>
										{tableNames.map((tableName: string) => {
											return (
												<div key={tableName} className='table-item'>
													<div className='text-table'>{tableName}</div>
													<label>
														<input
															type='checkbox'
															checked={tableVisibility[tableName] || false}
															onChange={() => handleToggleVisibility(tableName)}
														/>
														{tableName}
													</label>
													<Form.Select
														className='form-select'
														aria-label='Default select example'>
														<option value='1'>List View</option>
														<option value='2'>Enumeration View</option>
													</Form.Select>
												</div>
											);
										})}
									</div>
								</Tab.Pane>
							</Tab.Content>
						</Col>
					</Row>
				</Tab.Container>
			</div>
		</>
	);
}
