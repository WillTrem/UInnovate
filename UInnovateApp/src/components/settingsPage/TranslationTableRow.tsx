import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { AuthState } from '../../redux/AuthSlice';
import { Button, Modal } from 'react-bootstrap';
import { DataAccessor } from '../../virtualmodel/DataAccessor';
import vmd from '../../virtualmodel/VMD';
import  Audits  from "../../virtualmodel/Audits";
import { IoLockClosed } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

const buttonStyle = {
    marginRight: 10,
    backgroundColor: "#404040",
    marginBottom: 10,
};


interface TranslationTableRowProps {
    getTranslationsByLanguage: (language: string) => void,
    keyCode?: string,
    value?: string,
    is_default?: boolean,
    onEdit: (keyCode: string, newValue: string) => void;
    getLanguageId: (languageCode: string) => void;
    getKeyId: (keyCode: string) => void;
    selectedLanguage: string;
}

const TranslationTableRow: React.FC<TranslationTableRowProps> = ({ getTranslationsByLanguage, keyCode, value, is_default, onEdit, getLanguageId, getKeyId, selectedLanguage}) => {
    const [showModalDeleteLabel, setshowModalDeleteLabel] = useState<boolean>(false);
    const [isEditingLabel, setisEditingLabel] = useState(false);
    const [editedValue, setEditedValue] = useState(keyCode);
    const {user: loggedInUser }: AuthState = useSelector((state: RootState) => state.auth);

    const [editedTranslation, setEditedTranslation] = useState(value);
    const [isEditingTranslation, setisEditingTranslation] = useState(false);

    const handleUpsertTranslation = async (languageCode: string, keyCode: string, newTranslation: string) => {
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

                //Audits
                Audits.logAudits(
                    loggedInUser || "",
                    "Upsert Translation",
                    "Upserted a translation with the following value: " + JSON.stringify(newTranslation) + ", for the language: "+ "\"" + languageCode + "\"" + ", and the label: " + "\""+ keyCode + "\"",
                    "i18n_values",
                    ""
                );
            }
        } catch (error) {
            console.error(`Error upserting translation: ${newTranslation}`, error);
        }


    }
    
    const handleDoubleClickLabel = () => {
        if (!is_default && !isEditingLabel) {
            setisEditingLabel(true);
        }
    };
    const handleDoubleClickTranslation = () => {
        if  (!isEditingTranslation) {
            setisEditingTranslation(true);
        }
    };

    const handleBlur = () => {
        if (!is_default && isEditingLabel) {
            setisEditingLabel(false);
            saveChangesLabel(); 
        }
    };

    const   handleTranslationBlur = () => {
        setisEditingTranslation(false);
        saveChangesTranslation();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!is_default && isEditingLabel) {
            setEditedValue(e.target.value);
        }
    };

    const handleTranslationCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTranslation(e.target.value);
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
    }, []);

    useEffect(() => {
        setEditedTranslation(value);
    }, [value])

    return (
        <tr>
            <td onDoubleClick={handleDoubleClickLabel} className="container-labels">
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
                    data-testid="label-element"
                />
                {is_default ? <IoLockClosed className="icon-lock" data-testid="lock-label-icon"/> : (
                    <>
                        <MdDelete onClick={showModalDelete} className="icon-delete" data-testid="delete-label-icon" /> 
                    </>
                )} 
                <Modal show={showModalDeleteLabel} onHide={handleClose} data-testid="delete-label-modal">
                    <Modal.Header>
                        <Modal.Title data-testid="delete-label-title">Delete Label</Modal.Title>
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
                                data-testid="delete-label-button"
                            >
                                Delete
                            </Button>
                            <Button
                                onClick={handleClose}
                                style={buttonStyle}
                                variant="contained"
                                data-testid="cancel-label-button"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </td>

            <td onDoubleClick= {() => handleDoubleClickTranslation()} data-testid="translation-element">                
                <input
                    value={editedTranslation}
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
                    data-testid="translation-cell"
                />
            </td>
        </tr> 
    
    );
};

export default TranslationTableRow;