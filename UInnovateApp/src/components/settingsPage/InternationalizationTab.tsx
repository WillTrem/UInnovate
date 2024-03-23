import React, { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button, SelectChangeEvent } from "@mui/material";
import TableComponent from "react-bootstrap/Table";
import { IoLockClosed } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io"; 
import { MdDelete } from "react-icons/md";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "../../styles/InternationalizationTab.css";
import isoLanguages from 'iso-639-1';
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { AuthState } from '../../redux/AuthSlice';
import  Audits  from "../../virtualmodel/Audits";

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
    const {user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

    // Key Object
    interface KeyProps {
        id: number,
        key_code: string
    }

    // Language Object
    interface LanguageProps {
        id: number,
        language_code: string,
        language_name: string
    }

    // Value Object
    interface ValueProps {
        id: number,
        value: string
    }

    const getTranslationsByLanguage = async (chosenLanguage: string) => {
        try {
            const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
                "meta",
                "i18n_translations"
            );
            const rows = await data_accessor.fetchRowsByColumnValues(language_code_column_name, chosenLanguage, order_by_column);
            if (rows) {
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

    const getKeyProps = async () => {
        try {
            const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
                "meta",
                "i18n_keys"
            );

            const rows = await data_accessor.fetchRows();
            if (rows) {
                const keys: KeyProps[] = rows.map(row => ({
                    id: row.id,  // Assuming 'id' is the primary key of the table
                    key_code: row.key_code as string
                }));

                return keys;
            }
        } catch (error) {
            console.error('Error fetching keys:', error);
        }
    }

    // Get the key_id of the selected key using the getKeyProps function
    const getKeyId = async (keyCode: string) => {
        try {
            const keys = await getKeyProps();
            if (keys) {
                const keyId = keys.find
                (key => key.key_code === keyCode);
                return keyId?.id;
            }
        } catch (error) {
            console.error('Error fetching key_id:', error);
        }
    }

    const getLanguagesProps = async () => {
        try {
            const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
                "meta",
                "i18n_languages"
            );
    
            // Fetch the list of language names for the dropdown using the LanguageProps interface
            const rows = await data_accessor.fetchRows();
            if (rows) {
                // Process the rows to extract language codes and names
                const languages: LanguageProps[] = rows.map(row => ({
                    id: row.id,  // Assuming 'id' is the primary key of the table
                    language_code: row.language_code as string,
                    language_name: row.language_name as string
                }));
    
                // Return the list of languages_codes
                return languages;
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    }

    // Return the list of language codes using the getLanguagesProps function
    const getLanguagesCodes = async () => {
        try {
            const languages = await getLanguagesProps();
            if (languages) {
                const languageCodes = languages.map(language => language.language_code);
                setLanguages(languageCodes);
            }
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    }

    // Get the language_id of the selected language from the i18n_languages table using the LanguageProps interface. Return only the language_id, hence the id attribute
    const getLanguageId = async (languageCode: string) => {
        try {
            const languages = await getLanguagesProps();
            if (languages) {
                const languageId = languages.find
                (language => language.language_code === languageCode);
                return languageId?.id;
            }
        }
        catch (error) {
            console.error('Error fetching language_id:', error);
        }
    }

    const getValuesProps = async () => {
        try {
            const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
                "meta",
                "i18n_values"
            );
    
            // Fetch the list of values for the dropdown using the ValueProps interface
            const rows = await data_accessor.fetchRows();
            if (rows) {
                // Process the rows to extract values
                const values: ValueProps[] = rows.map(row => ({
                    id: row.id,  // Assuming 'id' is the primary key of the table
                    value: row.value as string
                }));
    
                // Return the list of values
                return values;
            }
        } catch (error) {
            console.error('Error fetching values:', error);
        }
    
    }


    useEffect(() => {
        getTranslationsByLanguage(selectedLanguage);
        getLanguagesCodes();
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

            // await getTranslations();
            await getTranslationsByLanguage(selectedLanguage);
        } catch (error) {
            console.error('Error adding a new label:', error);
        }

        Audits.logAudits(
            loggedInUser || "",
            "Add Label",
            "Added a new label with the following values: " + JSON.stringify(labelName),
            "i18n_keys",
            ""
        );
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
                await getTranslationsByLanguage(selectedLanguage);
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

        Audits.logAudits(
            loggedInUser || "",
            "Edit Label",
            "Edited a label with the following values: " + JSON.stringify(editedValue),
            "i18n_keys",
            ""
        );
    };

    const handleDropdownLanguages = async () => {
        await getLanguagesCodes();
    };

    const handleSelectedNewLanguage = (event: SelectChangeEvent<string>) => {
        setNewLanguageName(event.target.value as string);
        setNewLanguageCode(isoLanguages.getCode(event.target.value as string));
    };

    const handleSelectedLanguage = (event: SelectChangeEvent<string>) => {
        const language = event.target.value as string;
        setSelectedLanguage(language);
        getTranslationsByLanguage(language);

        // clear the previous translations
        setTranslations([]);
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
                                        // getTranslations={getTranslations}
                                        getTranslationsByLanguage={getTranslationsByLanguage}
                                        key={idx}
                                        keyCode={translation["key_code"] as string}
                                        value={translation["value"] as string}
                                        is_default={translation["is_default"] as boolean}
                                        onEdit={handleEdit}
                                        getLanguageId={getLanguageId}
                                        getKeyId={getKeyId}
                                        selectedLanguage={selectedLanguage}
                                        getValuesProps={getValuesProps}
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
    // getTranslations: () => void,
    getTranslationsByLanguage: (language: string) => void,
    keyCode?: string,
    value?: string,
    is_default?: boolean,
    onEdit: (keyCode: string, newValue: string) => void;
    getLanguageId: (languageCode: string) => void;
    getKeyId: (keyCode: string) => void;
    selectedLanguage: string;
    getValuesProps?: () => void;
}

const TranslationTableRow: React.FC<TranslationTableRowProps> = ({ getTranslationsByLanguage, keyCode, value, is_default, onEdit, getLanguageId, getKeyId, selectedLanguage, getValuesProps}) => {
    const [showModalDeleteLabel, setshowModalDeleteLabel] = useState<boolean>(false);
    const [isEditingLabel, setisEditingLabel] = useState(false);
    const [editedValue, setEditedValue] = useState(keyCode);
    const {user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);

    const [editedTranslation, setEditedTranslation] = useState(value);
    const [isEditingTranslation, setisEditingTranslation] = useState(false);

    const handleUpsertTranslation = async (languageCode: string, keyCode: string, newTranslation: string) => {
        setisEditingTranslation(true);
        try {
            // Get the language and key IDs
            const languageId = await getLanguageId(languageCode);
            const keyId = await getKeyId(keyCode);
    
            // Get the data accessor for upsert operation
            const dataAccessor = vmd.getUpsertDataAccessor(
                "meta",
                "i18n_values",
                {
                    columns: "language_id, key_id, value",
                    on_conflict: "language_id, key_id",
                }, 
                {
                    language_id: languageId,
                    key_id: keyId,
                    value: newTranslation,
                }
            );

            // if the value is not empty and null, perform the upsert operation
            if (newTranslation !== "" && newTranslation !== null) {
                await dataAccessor.upsert();
            }
        } catch (error) {
            console.error(`Error upserting translation: ${newTranslation}`, error);
        }
    }
    
    const handleDoubleClick = () => {
        if (!is_default && !isEditingLabel) {
            setisEditingLabel(true);
        }
    };

    const handleBlur = () => {
        if (!is_default && isEditingLabel) {
            setisEditingLabel(false);
            saveChangesLabel(); 
        }
    };

    const handleTranslationBlur = () => {
        setisEditingTranslation(false);
        saveChangesTranslation();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!is_default && isEditingLabel) {
            setEditedValue(e.target.value);
            saveChangesLabel();
        }
    };

    const handleTranslationCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTranslation(e.target.value);
        saveChangesTranslation();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && isEditingLabel) {
            e.preventDefault();
            setisEditingLabel(false);
            saveChangesLabel(); 
        }
    };

    const handleTranslationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setisEditingTranslation(false);
            saveChangesTranslation(); 
        }
    }

    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && isEditingLabel) {
            setisEditingLabel(false);
            saveChangesLabel(); // Save changes when clicking outside the input field
        }
        else if (target.tagName !== "INPUT" && isEditingTranslation) {
            setisEditingTranslation(false);
            saveChangesTranslation(); // Save changes when clicking outside the input field
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
                await getTranslationsByLanguage(selectedLanguage);
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

        Audits.logAudits(
            loggedInUser || "",
            "Delete Label",
            "Deleted a label with the following values: " + JSON.stringify(keyCode),
            "i18n_keys",
            ""
        );
    };

    const saveChangesLabel = async () => {
        try {
            if (keyCode !== editedValue) {
                onEdit(keyCode || "", editedValue || "");
            }

        } catch (error) {
            console.error('Error saving changes:', error);
        }

    };

    const saveChangesTranslation = async () => {
        try {
            if (value !== editedTranslation) {
                handleUpsertTranslation(selectedLanguage, keyCode || "", editedTranslation || "");
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const showModalDelete = () => {
        setshowModalDeleteLabel(true);
    };

    const handleClose = () => {
        setshowModalDeleteLabel(false);
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
                    value={isEditingLabel ? editedValue : keyCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    readOnly={!isEditingLabel}
                    style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: isEditingLabel ? '#f2f2f2' : 'transparent',
                        borderRadius: '4px',
                    }}
                />
                {is_default ? <IoLockClosed className="icon-lock" /> : (
                    <>
                        <MdDelete onClick={showModalDelete} className="icon-delete" /> 
                    </>
                )} 
                <Modal show={showModalDeleteLabel} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Delete Label</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete the label <b>{keyCode}</b>?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <div>
                            <Button
                                onClick={() => handleDelete(keyCode || '')}
                                style={buttonStyle}
                                variant="contained"
                            >
                                Delete
                            </Button>
                            <Button
                                onClick={handleClose}
                                style={buttonStyle}
                                variant="contained"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </td>

            <td onDoubleClick= {() => handleUpsertTranslation(selectedLanguage, keyCode || "", editedTranslation || "")}>                
                <input
                    value={isEditingTranslation ? editedTranslation : value}
                    onChange={handleTranslationCellChange}  
                    onBlur={handleTranslationBlur}
                    onKeyDown={handleTranslationKeyDown}
                    readOnly={!isEditingTranslation}
                    style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: isEditingTranslation ? '#f2f2f2' : 'transparent',
                        borderRadius: '4px',
                    }}
                />
            </td>
        </tr> 
    
    );
};

export default InternationalizationTab;