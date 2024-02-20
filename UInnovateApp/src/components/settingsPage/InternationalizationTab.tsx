import React, { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button, SelectChangeEvent } from "@mui/material";
import TableComponent from "react-bootstrap/Table";
import { IoLockClosed } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io"; 
import { PiNotePencilBold } from "react-icons/pi";
import { MdDelete } from "react-icons/md";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "../../styles/InternationalizationTab.css";
import isoLanguages from 'iso-639-1';

const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
    marginBottom: 10,
};

const addLabelButtonStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    
};

const language_code_column_name = "language_code";
const order_by_column = "translation_id";

const InternationalizationTab = () => {
    const [showModalAddLanguage, setshowModalAddLanguage] = useState<boolean>(false);
    const [showModalAddLabel, setshowModalAddLabel] = useState<boolean>(false);
    const [translations, setTranslations] = useState<Row[]>([]);
    const [newLanguageCode, setNewLanguageCode] = useState('');
    const [newLanguageName, setNewLanguageName] = useState('');
    const [languages, setLanguages] = useState<string[]>([]); 

    const [newLabelName, setNewLabelName] = useState<string>(''); 

    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
    
    const getTranslations = async () => {
        try {
            const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
                "meta",
                "i18n_translations"
            );
            const rows = await data_accessor.fetchRowsByColumnValues(language_code_column_name, selectedLanguage, order_by_column);
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

    const getLanguages = async () => {
        try {
            const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
                "meta",
                "i18n_languages"
            );

            // Fetch the list of language names for the dropdown
            const rows = await data_accessor.fetchRows();
            if (rows) {
                const languageCodes = rows.map(row => row.language_code as string);
                setLanguages(languageCodes);
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    }

    useEffect(() => {
        getTranslations();
        getLanguages();
    }, []);

    const showAddLanguage = () => {
        setshowModalAddLanguage(true);
    };

    const handleClose = () => {
        setshowModalAddLanguage(false);
        setshowModalAddLabel(false);
        resetNewLanguage();
    };

    const resetNewLanguage = () => {
        setNewLanguageCode('');
        setNewLanguageName('');
    };

    const handleSaveLanguage = async () => {
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

                setLanguages(prevLanguages => [...prevLanguages, newLanguageCode]);

                console.log("Adding language with data:", {
                    language_code: newLanguageCode,
                    language_name: newLanguageName,
                });

                await data_accessor?.addRow();
                resetNewLanguage();

            } catch (error) {
                console.error('Error adding language:', error);
            }
        } else {
            console.error('Please provide valid language code and name.');
        }

        setshowModalAddLanguage(false);
    };

    const handleAddRowClick = async () => {
        setshowModalAddLabel(true);
    };

    const handleSaveLabel = async (labelName: string) => {
        setshowModalAddLabel(false);
        try {
            await vmd.getAddRowDataAccessor(
                "meta",
                "i18n_keys",
                {
                    key_code: labelName.trim() || "New Label",
                    is_default: false, // Set is_default to false for user-added labels
                }
            ).addRow();

            await getTranslations();

            console.log("Adding a new label...");
        } catch (error) {
            console.error('Error adding a new label:', error);
        }
    };

    const handleEdit = async (keyCode: string, editedValue: string) => {
        try {
            const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
                "meta",
                "i18n_keys",
                {
                    key_code: editedValue,
                },
                "key_code",
                keyCode
            );

            // Verify if update response is successful
            const response = await data_accessor.updateRow();

            if (response && response.status >= 200 && response.status < 300) {
                console.log(`Successfully updated label with keyCode ${keyCode} to value ${editedValue}`);
                await getTranslations();
            } else {
                console.error(`Failed to update label with keyCode ${keyCode} to value ${editedValue}`);
                if (response) {
                    console.error(`Error status: ${response.status}`);
                    console.error(`Error message: ${response.data}`);
                }
            }
        } catch (error) {
            console.error("Error editing label:", error);
        }
    };

    const handleDropdownLanguages = async () => {
        await getLanguages();
    };

    const handleSelectedNewLanguage = (event: SelectChangeEvent<string>) => {
        setNewLanguageName(event.target.value as string);
        setNewLanguageCode(isoLanguages.getCode(event.target.value as string));
    };

    const handleSelectedLanguage = (event: SelectChangeEvent<string>) => {
        setSelectedLanguage(event.target.value as string);
    };

    return (
        <div>
            <div>
            <Button
                data-testid="add-language-button" 
                onClick={showAddLanguage}
                style={buttonStyle}
                variant="contained"
            >
                    Add Language
                </Button>
                <Button
                    style={buttonStyle}
                    variant="contained"
                    data-testid="refresh-button"
                >
                    Refresh
                </Button>
            </div>

            <div className="default-language-input">

                <FormControl fullWidth>
                    <InputLabel id="default-language-label">Default Language</InputLabel>
                    <Select
                        labelId="default-language-label"
                        name="Default Language"
                        onChange={handleSelectedLanguage}
                        onClick={handleDropdownLanguages}
                        variant="outlined"
                        label="Default Language"
                        defaultValue=''
                    >
                        {languages.map(language => (
                            <MenuItem key={language} value={language}>{language}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div style={{ maxHeight: '700px', overflowY: 'auto' }}> {/* Set max height and enable vertical scrolling */}
                <TableComponent bordered data-testid="table-component">
                    <thead>
                        <tr>
                            <th>Label</th>
                            <th>{`LANG:${selectedLanguage}`}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {translations && translations.map((translation, idx) => {
                            if (translation) {
                                return (
                                    <TranslationTableRow
                                        getTranslations={getTranslations}
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
            </div>

            <div style={addLabelButtonStyle}>
                <Button
                    variant="contained"
                    style={buttonStyle}
                    onClick={handleAddRowClick} 
                    data-testid="add-label-button"
                >
                    <IoMdAddCircle className="button-icon" /> 
                </Button>
            </div>

            <Modal show={showModalAddLanguage} onHide={handleClose} data-testid="add-language-modal">
                <Modal.Header>
                    <Modal.Title>Add New Language</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormControl fullWidth>
                        <InputLabel id="add-language">Choose language</InputLabel>
                            <Select
                                labelId="add-language"
                                value={newLanguageName}
                                onChange={handleSelectedNewLanguage}
                                variant="outlined"
                                label="Add Language"
                            >
                                {isoLanguages.getAllNames().map(language => (
                                    <MenuItem key={language} value={language}>{language}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                            onClick={handleSaveLanguage}
                            style={buttonStyle}
                            variant="contained"
                        >
                            Save
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalAddLabel} onHide={handleClose} data-testid="add-label-modal">
                <Modal.Header>
                    <Modal.Title>Add New Label</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            type="text"
                            placeholder="Label Name"
                            onChange={(e) => setNewLabelName(e.target.value)}
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
                            onClick={() => handleSaveLabel(newLabelName)}
                            style={buttonStyle}
                            variant="contained"
                        >
                            Save
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

interface TranslationTableRowProps {
    getTranslations: () => void,
    keyCode?: string,
    value?: string,
    is_default?: boolean,
    onEdit: (keyCode: string, newValue: string) => void;
}

const TranslationTableRow: React.FC<TranslationTableRowProps> = ({ getTranslations, keyCode, value, is_default, onEdit }) => {
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

    // Delete functionality using the deleteRow method from DataAccessor
    const handleDelete = async (keyCode: string) => {
        try {    
            const primaryKeyName = "key_code"; // Assuming "key_code" is the primary key of the table
            const data_accessor: DataAccessor = vmd.getRemoveRowAccessor(
                "meta",
                "i18n_keys",
                primaryKeyName,
                keyCode
            );
    
            // Call the deleteRow method of the DataAccessor instance
            const response = await data_accessor.deleteRow();
    
            // Check if the deletion was successful
            if (response && response.status >= 200 && response.status < 300) {
                // Remove the deleted row from the UI or update the UI accordingly
                console.log(`Successfully deleted row with keyCode ${keyCode}`);
                // Refresh translations after deleting a row
                await getTranslations();
            } else {
                // Handle error responses
                console.error(`Failed to delete row with keyCode ${keyCode}`);
                if (response) {
                    console.error(`Error status: ${response.status}`);
                    console.error(`Error message: ${response.data}`);
                }
            }
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const saveChanges = async () => {
        try {
            if (value !== editedValue) {
                // Console log the changes
                console.log(`Changes detected: ${value} -> ${editedValue}`);
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
            <td onDoubleClick={handleDoubleClick} className="container-labels">
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
                {is_default ? <IoLockClosed className="icon-lock" /> : (
                    <>
                        <PiNotePencilBold
                            style={{ marginLeft: 5, cursor: 'pointer' }}
                            onClick={handleDoubleClick}
                        /> {/* Edit icon */}
                        <MdDelete onClick={() => handleDelete(keyCode || '')}  style={{ marginLeft: 5, cursor: 'pointer' }} /> {/* Delete icon */}
                    </>
                )}
            </td>
        </tr>
    );
};

export default InternationalizationTab;