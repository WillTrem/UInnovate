import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Modal, Form } from "react-bootstrap";
import { ViewTypeEnum } from "../../../enums/ViewTypeEnum";
import { insertNewView } from "../../../virtualmodel/AdditionalViewsDataAccessor";
import vmd, { Table } from "../../../virtualmodel/VMD";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/Store";
import { AuthState } from "../../../redux/AuthSlice";
import Audits from "../../../virtualmodel/Audits";

interface AdditionalViewModalProp {
	show: boolean;
	setShow: (v: boolean) => void;
	refreshList: () => void;
}

const AdditionalViewModal = ({
	show,
	setShow,
	refreshList: updateList,
}: AdditionalViewModalProp) => {
	const [viewName, setViewName] = useState<string>("");
	const [viewType, setViewType] = useState<number>(1);
	const [tableName, setTableName] = useState<string>("");
	const [customCode, setCustomCode] = useState<string>("");
	const [tableList, setTableList] = useState<Table[]>([]);
	const [validated, setValidated] = useState(false);

	const schemaName = useSelector((state: RootState) => state.schema.value);
	const { user: loggedInUser }: AuthState = useSelector(
		(state: RootState) => state.auth
	);

	useEffect(() => {
		// Only show tables of the selected schema
		const tables = vmd.getSchema(schemaName)?.tables || [];
		setTableList(tables);
	}, [schemaName]);

	const resetForm = () => {
		setViewName("");
		setViewType(1);
		setTableName("");
		setValidated(false);
		const form = document.getElementById("AdditionalViewModalForm");
		form && form.reset();
	};
	const handleClose = () => {
		setShow(false);
		resetForm();
	};

	const handleFormSubmit = (e) => {
		const formName = "AdditionalViewModalForm";
		const form = document.getElementById(formName);

		setValidated(true);
		e.preventDefault();

		if (form.checkValidity() === false) {
			console.log("invalid form, redcheck data");
		} else {
			console.log("valid form, submitting");
			handleSubmit();
		}
	};

	const handleSubmit = (): void => {
		Audits.logAudits(
			loggedInUser || "",
			"Add view",
			"Added a new view with the following values: " +
				JSON.stringify(viewName) +
				", " +
				JSON.stringify(viewType) +
				", " +
				JSON.stringify(customCode),
			schemaName,
			tableName
		);

		insertNewView(schemaName, tableName, viewName, viewType, customCode);
		handleClose();
		updateList();
	};

	const handleFileChange = (e): void => {
		const [file] = e.target.files;
		const reader = new FileReader();
		reader.addEventListener(
			"load",
			() => {
				const text = reader.result;
				setCustomCode(text);
			},
			false
		);
		if (file) {
			reader.readAsText(file);
		}
	};
	return (
		<>
			<Modal show={show} onHide={handleClose} id='AdditionalViewModal'>
				<Modal.Header closeButton>
					<Modal.Title>Add New View</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						noValidate
						validated={validated}
						onSubmit={handleFormSubmit}
						id='AdditionalViewModalForm'>
						<Form.Group className='mb-3' controlId='viewName'>
							<Form.Label>View Name</Form.Label>
							<Form.Control
								required
								name='viewName'
								type='text'
								onChange={(e) => {
									setViewName(e.target.value);
								}}
								placeholder='Enter a view name'
							/>
							<Form.Control.Feedback type='invalid'>
								Please provide a valid name.
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className='mb-3' controlId='viewType'>
							<Form.Label>View Type</Form.Label>
							<Form.Select
								name='viewType'
								onChange={(e) => setViewType(parseInt(e.target.value))}>
								<option value={ViewTypeEnum.Calendar}>Calendar</option>
								<option value={ViewTypeEnum.Timeline}>Timeline</option>
								<option value={ViewTypeEnum.TreeView}>Tree View</option>
								<option value={ViewTypeEnum.Custom}>Custom</option>
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3' controlId='viewTable'>
							<Form.Label>Tables</Form.Label>
							<Form.Select onChange={(e) => setTableName(e.target.value)}>
								{tableList &&
									tableList.map((table) => (
										<option key={table.table_name} value={table.table_name}>
											{table.table_name}
										</option>
									))}
							</Form.Select>
						</Form.Group>
						{viewType === ViewTypeEnum.Custom && (
							<Form.Group className='mb-3' controlId='viewCustomCode'>
								<Form.Label>view custom code</Form.Label>
								<Form.Control
									required={viewType == ViewTypeEnum.Custom}
									type='file'
									accept='.ts, .tsx, ,js, .jsx, .txt'
									onChange={(e) => handleFileChange(e)}
								/>
							</Form.Group>
						)}
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button
						className='buttonStyle'
						variant='contained'
						onClick={handleClose}>
						Close
					</Button>
					<Button variant='contained' onClick={handleFormSubmit}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default AdditionalViewModal;
