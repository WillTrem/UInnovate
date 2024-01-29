import { Row as Line, Tab } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import TableComponent from "react-bootstrap/Table";
import { IoLockClosed } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { PiNotePencilBold } from "react-icons/pi";
import { MdDelete } from "react-icons/md";


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

    const [languages, setLanguages] = useState<string[]>([]);
	
    const getTranslations = async () => {
        try {
            const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
                "meta",
                "i18n_translations"
            );
    
            const rows = await data_accessor.fetchRows();
            if (rows) {
                console.log("Fetched rows:", rows);
    
                const translationsWithIsDefault = rows.map(row => ({
                    ...row,
                    is_default: row.is_default || false,
                }));
    
                setTranslations(translationsWithIsDefault);
            }
        } catch (error) {
            console.error('Error fetching translations:', error);
        }
    };

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
        if (e.target.name === 'language_code') {
            setNewLanguageCode(e.target.value);
        } else if (e.target.name === 'language_name') {
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
                        language_code: newLanguageCode,
                        language_name: newLanguageName,
                    }
                );

                // Add the new language to the languages state
                setLanguages(prevLanguages => [...prevLanguages, newLanguageCode]);
    
                console.log("Adding language with data:", {
                    language_code: newLanguageCode,
                    language_name: newLanguageName,
                });
    
                await data_accessor?.addRow();
    
            } catch (error) {
                console.error('Error adding language:', error);
            }
        } else {
            console.error('Please provide valid language code and name.');
        }
    
        setShowModal(false);
    };

    const handleAddRowClick = async () => {
        try {
            // Prompt the user for a label name
            const labelName = window.prompt('Enter a label name:');
    
            if (labelName !== null) { 
                // Add a new row to i18n_keys with is_default set to false and the provided label name
                await vmd.getAddRowDataAccessor(
                    "meta",
                    "i18n_keys",
                    {
                        key_code: labelName.trim() || "New Label",
                        is_default: false, // Set is_default to false for user-added labels
                    }
                ).addRow();
    
                // Fetch the updated translations
                await getTranslations();
    
                console.log("Adding a new label...");
            }
        } catch (error) {
            console.error('Error adding a new label:', error);
        }
    };

    // TODO: Implement edit functionality to save directly to the database and reflect the changes in the UI
    const handleEdit = async (keyCode: string, editedValue: string) => {
        try {    
            console.log(`Editing label with keyCode ${keyCode} to value ${editedValue}`);
        } catch (error) {
            console.error("Error editing label:", error);
        }
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
                                name="language_name"
                                value={newLanguageName}
                                onChange={handleInputChange}

                            />
                            Associated Language Code
                            <Form.Control
                                type="text"
                                placeholder="Language Code (e.g. ENG)"
                                name="language_code"
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
                                {languages.map(language => (
                                    <th key={language}>{`LANG:${language}`}</th>
                                ))}
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
                                        is_default={translation["is_default"] as boolean}
                                        onEdit={handleEdit}
                                    />
                                        );
                                    }
                                    return <React.Fragment key={idx} />;
                            })}
                        </tbody>
                    </TableComponent>
                    <div>
                        <div
                            className="container"
                            style={{ display: "flex", justifyContent: "center" }}
                        >
                            <Button
                            variant="contained"
                            style={buttonStyle}
                            onClick={() => handleAddRowClick()}
                            >
                                <IoMdAddCircle className="button-icon" />
                            </Button>
                        </div>
                </div>
                </Tab.Content>
            </Line>
        </Tab.Container>
    </div>
);
};

interface TranslationTableRowProps {
	keyCode?: string,
	value?: string,
    is_default?: boolean,
    onEdit: (keyCode: string, newValue: string) => void;
}

const TranslationTableRow: React.FC<TranslationTableRowProps> = ({ keyCode, value, is_default, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value || "");

    const handleDoubleClick = () => {
        if (!is_default) {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        if (!is_default) {
            setIsEditing(false);
            saveChanges(); 
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedValue(e.target.value);
        // Automatically save changes when the input field is changed
        saveChanges();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setIsEditing(false);
            saveChanges(); // Save changes on Enter key press
        }
    };

    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT") {
            setIsEditing(false);
            saveChanges(); // Save changes when clicking outside the input field
        }
    };

    // TODO: Implement delete functionality
    const handleDelete = async (keyCode: string) => {
        try {
            console.log(`Deleted label with keyCode ${keyCode}`);
        } catch (error) {
            console.error('Error deleting label:', error);
        }
    };
    

    // TODO: Implement save changes functionality
    const saveChanges = async () => {
        try {
            if (value !== editedValue) {
                onEdit(keyCode || "", editedValue);
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); 

    return (
        <tr>
            <td onDoubleClick={handleDoubleClick}>
            <input
                value={isEditing ? editedValue : keyCode}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                readOnly={!isEditing}
                style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: isEditing ? '#f2f2f2' : 'transparent', 
                    borderRadius: '4px',  
                }}
            />
                {is_default ? <IoLockClosed /> : (
                    <>
                        <PiNotePencilBold
                            style={{ marginLeft: 5, cursor: 'pointer' }}
                            onClick={handleDoubleClick}
                        /> {/* Edit icon */}
                        <MdDelete onClick={handleDelete} style={{ marginLeft: 5, cursor: 'pointer' }} /> {/* Delete icon */}
                    </>
                )}
            </td>
        </tr>
    );
};

export default InternationalizationTab;