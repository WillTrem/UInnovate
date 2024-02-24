import { Tab, Row as Separator, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Nav, Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
import { IoLockClosed, IoLockOpen } from "react-icons/io5";
import { insertNewEnvVar, editEnvVar } from "../../virtualmodel/EnvVarAccessor";
import { EnvVarValueEditor } from "./EnvVarValueEditor";

export const EnvVarCreator = () => {
	const schema = vmd.getSchema("meta");
	const env_var_table = vmd.getTable("meta", "env_vars");
	const columns = env_var_table?.getColumns();

	const [envVar, setEnvVar] = useState<Row[] | undefined>([]);
	const [newEnvVar, setNewEnvVar] = useState<Row>({}); //expect valid type for the row
	const [showModal, setShowModal] = useState<boolean>(false);

	useEffect(() => {
		getEnvVars();
	},[]);
	const handleAddEnvVar = async () => {
		setShowModal(true);
	};
	const handleClose = () => {
		setShowModal(false);
	};
	const handleSave = async () => {
		insertNewEnvVar(newEnvVar.name, newEnvVar.value);
		getEnvVars();
		setNewEnvVar({}); // Reset form
		setShowModal(false);
	};

	//EDIT ENV VAR FEATURE:
	const [editMode, setEditMode] = useState(false);
	const handleEditClick = () => {
		setEditMode(!editMode);
	};

	const updateEnvVarInDatabase = (id: number | string, value: string) => {
		console.log("Updating env var in database");
		editEnvVar(`${id}`, value);
		getEnvVars();
	};

	const getEnvVars = async () => {
		if (!schema || !env_var_table) {
			return;
		}

		const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
			schema?.schema_name,
			env_var_table?.table_name
		);

		const env_var_rows = await data_accessor?.fetchRows();
		setEnvVar(env_var_rows);
	};

	return (
		<div>
			<Tab.Container>
				<Separator>
					<Col sm={5}>
						<h5>Environment Variables</h5>
						<Modal show={showModal} onHide={handleClose}>
							<Modal.Header>
								<Modal.Title>Add a New Environment Variable</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form>
									{/* Environment Variable Name Field */}
									<Form.Group>
										<Form.Label>Name</Form.Label>
										<Form.Control
											type='text'
											value={newEnvVar["name"] || ""}
											onChange={(e) => {
												setNewEnvVar({
													...newEnvVar,
													["name"]: e.target.value,
												});
											}}
										/>
									</Form.Group>

									{/* Environment Variable Value Field */}
									<Form.Group>
										<Form.Label>Value</Form.Label>
										<Form.Control
											type='text'
											value={newEnvVar["value"] || ""}
											onChange={(e) => {
												setNewEnvVar({
													...newEnvVar,
													["value"]: e.target.value,
												});
											}}
										/>
									</Form.Group>

									{/* misc breadcrumbs */}
									{columns?.map((column) => {
										if (
											column.column_name === "id" ||

										
											column.column_name === "table_name" ||
											column.column_name === "name" || // Exclude if already added
											column.column_name === "value" // Exclude if already added
										)
											return null;

									})}
								</Form>
							</Modal.Body>
							<Modal.Footer>
								<Button variant='contained' onClick={handleClose}>
									Cancel
								</Button>
								<Button variant='contained' onClick={handleSave}>
									Save
								</Button>
							</Modal.Footer>
						</Modal>
						<Button
							onClick={handleAddEnvVar}
							style={{
								fontSize: "12px",
								alignItems: "center",
								display: "flex",
								marginBottom: "10px",
								flexDirection: "row",
								backgroundColor: "#404040",
							}}
							variant='contained'>
							<IoMdAddCircle style={{ marginRight: "5px" }} />
							New Environment Variable
						</Button>
						<Tab.Content>
							<h5>Existing environment variables</h5>
							<Button onClick={handleEditClick}>
								{editMode ? <IoLockOpen /> : <IoLockClosed />}
								<h5>Click to edit</h5>
							</Button>

							{envVar?.map((envVarItem) => {
								return (
									<Nav.Item key={envVarItem.id}>
										<Nav.Link eventKey={envVarItem.name}>
											{editMode ? (
												<EnvVarValueEditor
													row={envVarItem}
													update={{ handleSubmit: updateEnvVarInDatabase }}
												/>
											) : (
												`${envVarItem.name}, ${envVarItem.value}`
											)}
										</Nav.Link>
									</Nav.Item>
								);
							})}
						</Tab.Content>
					</Col>
				</Separator>
			</Tab.Container>
		</div>
	);
};
