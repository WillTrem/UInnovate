import { Nav } from "react-bootstrap";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
// import { ScriptEditor } from "./ScriptEditor";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";
// import axios from "axios";
// import { use } from "chai";

export const EnvVarCreator = () => {
	const schema = vmd.getSchema("meta");
	const env_var_table = vmd.getTable("meta", "env_vars");
	const columns = env_var_table?.getColumns();

	const [envVar, setEnvVar] = useState<Row[] | undefined>([]);
	const [newEnvVar, setNewEnvVar] = useState<Row>({}); //expect valid type for the row
	// const [envVarValue, setEnvVarValue] = useState<Row[] | undefined>([]);
	const [showModal, setShowModal] = useState<boolean>(false);

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
	useEffect(() => {
		getEnvVars();
	});
	const handleAddEnvVar = async () => {
		setShowModal(true);
	};
	const handleClose = () => {
		setShowModal(false);
	};
	const handleSave = async () => {
		try {
			// Get upsert data accessor
			const data_accessor: DataAccessor = vmd.getUpsertDataAccessor(
				"meta", // schema name
				"env_vars", // table name
				{}, // params
				newEnvVar // row data
			);

			// Upsert
			const env_var_rows = await data_accessor.upsert();
			setNewEnvVar(env_var_rows);
			// Assuming the response contains the updated data or some confirmation

			// Fetch the updated environment variables and reset the form
			getEnvVars();
			setNewEnvVar({}); // Reset the form
			setShowModal(false);
		} catch (error) {
			console.error("Error in upserting environment variable:", error);
			// Handle the error appropriately
		}
	};
	const handleUpdate = async () => {
		//update the env var with that name
		const data_accessor = vmd.getUpdateRowDataAccessor(
			"meta",
			"env_vars",
			newEnvVar
		);

		await data_accessor?.updateRow();
		getEnvVars();
		setShowModal(false);
	};

	return (
		<div>
			<Modal show={showModal} onHide={handleClose}>
				<Modal.Header>
					<Modal.Title>Add New Env Var</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{/* Environment Variable Name Field */}
						<Form.Group>
							<Form.Label>Variable Name</Form.Label>
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
							<Form.Label>Variable Value</Form.Label>
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

						{/* Additional Fields based on columns */}
						{columns?.map((column) => {
							if (
								column.column_name === "id"
								// column.column_name === "table_name" ||
								// column.column_name === "name" || // Exclude if already added
								// column.column_name === "value" // Exclude if already added
							)
								return null;
							return (
								<Form.Group key={column.column_name}>
									<Form.Label>{column.column_name}</Form.Label>
									<Form.Control
										type='text'
										value={newEnvVar[column.column_name] || ""}
										onChange={(e) => {
											setNewEnvVar({
												...newEnvVar,
												[column.column_name]: e.target.value,
											});
										}}
									/>
								</Form.Group>
							);
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
				style={{ marginBottom: "10px" }}
				variant='contained'>
				<IoMdAddCircle style={{ marginRight: "5px" }} />
				Add A New Environment Variable
			</Button>
			<Box>
				{envVar?.map((envVar) => {
					const envVar_name = envVar["name"];
					return (
						<Nav.Item key={envVar_name}>
							<Nav.Link eventKey={envVar_name}>{envVar_name}</Nav.Link>
						</Nav.Item>
					);
				})}
			</Box>
			<button onClick={handleSave}>Save Environment Variable</button>
		</div>
	);
};
