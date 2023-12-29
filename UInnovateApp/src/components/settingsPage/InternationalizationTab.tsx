import { Col, Row as Line, Tab, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { ScriptEditor } from "./ScriptEditor";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import TableComponent from "react-bootstrap/Table";

const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
    marginBottom: 10,
};


const InternationalizationTab = () => {
    const schema = vmd.getSchema("meta");
    const script_view = vmd.getTable("meta", "i18n_translation");
    const columns = script_view?.getColumns();

    const [scripts, setScripts] = useState<Row[] | undefined>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newScript, setNewScript] = useState<Row>({});

    // TODO: Properly fetch the view from the data accessor. Currently, the view is hardcoded.
    const getScripts = async () => {
    if (!schema || !script_view) {
        return;
    }

    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        schema?.schema_name,
        script_view?.table_name
        
    );

    const scripts_rows = await data_accessor?.fetchRows();
    setScripts(scripts_rows);
    };

    useEffect(() => {
        getScripts();
    });

    const handleAddLanguage = async () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleSave = async () => {
        const data_accessor = vmd.getAddRowDataAccessor(
            "meta",
            "scripts",
            newScript
        );

        await data_accessor?.addRow();
        getScripts();
        setShowModal(false);
    };
    return (
    <div>
    <Tab.Container>
        <Line>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Add New Language</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        Pick a language from the dropdown of possible languages
                        <Form.Select>
                            <option>English</option>
                            <option>French</option>
                            <option>Spanish</option>
                            <option>German</option>
                            <option>Chinese</option>
                        </Form.Select>
                        Associated language code
                        <Form.Control
                            type="text"
                            placeholder="ENG"    
                        />

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button
                            onClick={handleClose}
                            style={buttonStyle}
                            variant="contained"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleSave}
                            style={buttonStyle}
                            variant="contained"
                        >
                            Save
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
   
        
            <Tab.Content>
            <h4>Internationalization</h4>

            <div className="flex-column">
                <Button
                onClick={handleAddLanguage}
                style={buttonStyle}
                variant="contained"
                >
                    Add Language
                </Button>
                <Button
                style={buttonStyle}
                variant="contained"
                >
                    Refresh
                </Button>
            </div>
                <TableComponent bordered>
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>Lang:ENG</th>
                            <th>Lang:FR</th>
                        </tr>
                        <tr>
                            <th>label 1</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>label 2</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>label 3</th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th>label 4</th>
                            <th></th>
                            <th></th>
                        </tr>

                    </thead>
                    <tbody>
                    </tbody>
				</TableComponent>
                
            </Tab.Content>
        
        </Line>
    </Tab.Container>
    </div>
);
};

export default InternationalizationTab;