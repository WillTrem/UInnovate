import { Nav } from "react-bootstrap";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { IoMdAddCircle } from "react-icons/io";

export const EnvVarCreator = () => {
	const schema = vmd.getSchema("meta");
	const env_var_table = vmd.getTable("meta", "env_vars");
	const columns = env_var_table?.getColumns();

	const [envVar, setEnvVar] = useState<Row[] | undefined>([]);
	const [newEnvVar, setNewEnvVar] = useState<Row>({}); //expect valid type for the row
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
			const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
				"meta", // schema name
				"env_vars", // table name
				//new row data:
				{
					name: newEnvVar.name,
					value: newEnvVar.value,
				}
			);

			// Use data accessor to add the new row woop woop
			await data_accessor.addRow();
			getEnvVars();
			setNewEnvVar({}); // Reset form
			setShowModal(false);
			alert("Environment variable saved successfully."); // Let user know it worked yay
		} catch (error) {
			console.error("Error in upserting environment variable:", error);
			alert("Failed to save environment variable."); // User sad :(
		}
	};

	return (
		<div>
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
				New Environment Variable
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
		</div>
	);
};
