import { Row as Line, Tab } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import TableComponent from "react-bootstrap/Table";
import { IoLockClosed } from "react-icons/io5";


const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
    marginBottom: 10,
};


const InternationalizationTab = () => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const [translations, setTranslations] = useState<Row[]>([]);

    const [newLanguageCode, setNewLanguageCode] = useState('');
    const [newLanguageName, setNewLanguageName] = useState('');

	
    const getTranslations = async () => {
        const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
            "meta",
            "i18n_translations" 
        );
    
        const rows = await data_accessor.fetchRows();
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
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'languageCode') {
            setNewLanguageCode(e.target.value);
        } else if (e.target.name === 'languageName') {
            setNewLanguageName(e.target.value);
        }
    }
    const handleSave = async () => {
        if (newLanguageCode && newLanguageName) {
            try {
                const schema = vmd.getTableSchema("i18n_languages");
                if (!schema) {
                    console.error("Could not find schema for table ", "i18n_languages");
                    return;
                }
    
                const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
                    "meta",
                    "i18n_languages",
                    {
                        languageCode: newLanguageCode,
                        languageName: newLanguageName,
                    }
                );
    
                console.log("Adding language with data:", {
                    languageCode: newLanguageCode,
                    languageName: newLanguageName,
                });
    
                const response = await data_accessor?.addRow();
                console.log("Add language response:", response);
    
            } catch (error) {
                console.error('Error adding language:', error);
            }
        } else {
            console.error('Please provide valid language code and name.');
        }
    
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
                            Language Name
                            <Form.Control
                                type="text"
                                placeholder="Language Name (e.g. English)"
                                name="languageName"
                                value={newLanguageName}
                                onChange={handleInputChange}

                            />
                            Associated Language Code
                            <Form.Control
                                type="text"
                                placeholder="Language Code (e.g. ENG)"
                                name="languageCode"
                                value={newLanguageCode}
                                onChange={handleInputChange}  
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
		<td>{keyCode} <IoLockClosed /></td>
		<td>{value}</td>
	</tr >
}
export default InternationalizationTab;