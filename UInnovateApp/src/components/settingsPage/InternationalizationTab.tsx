import { Row as Line, Tab } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import TableComponent from "react-bootstrap/Table";


const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
    marginBottom: 10,
};


const InternationalizationTab = () => {
    // const schema = vmd.getSchema("meta");
    // const script_view = vmd.getTable("meta", "i18n_translation");
    // const columns = script_view?.getColumns();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [newScript, setNewScript] = useState<Row>({});

    const [translations, setTranslations] = useState<Row[]>([]);
	
    const getTranslations = async () => {
        const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
            "meta",
            "i18n_translations" 
        );
    
        const rows = await data_accessor.fetchRows();
        console.log("Fetched translations:", rows); // Add this line
        if (rows) {
            setTranslations(rows);
        }
    }

	useEffect(() => {
		getTranslations();
	}, [])

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
            <th>Translation</th>
        </tr>
        </thead>
        <tbody>
            {translations && translations.map((translation, idx) => {
                if (translation) {
                    return (
                        <TranslationTableRow
                            key={idx}
                            keyCode={translation["key_code"] as string}
                            value={translation["value"] as string}
                        />
                        );
                    }
                    return <React.Fragment key={idx} />;
            })}
        </tbody>
        </TableComponent>
            </Tab.Content>
        </Line>
    </Tab.Container>
    </div>
);
};

interface TranslationTableRowProps {
	keyCode?: string,
	value?: string
}
const TranslationTableRow: React.FC<TranslationTableRowProps> = ({ keyCode, value }) => {
	return <tr>
		<td>{keyCode}</td>
		<td>{value}</td>
	</tr >
}

export default InternationalizationTab;