import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { AuthState } from "../../redux/AuthSlice";
import { Modal } from "react-bootstrap";
import Audits from "../../virtualmodel/Audits";
import { IoLockClosed } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import "../../styles/InternationalizationTab.css";
import { Button } from "@mui/material";
import {
  KEYS_TABLE_NAME,
  deleteKey,
  upsertTranslation,
} from "../../virtualmodel/I18nDataAccessor";

const buttonStyle = {
  marginRight: 10,
  backgroundColor: "#404040",
  marginBottom: 10,
};

interface TranslationTableRowProps {
  getTranslationsByLanguage: (language: string) => void;
  keyCode?: string;
  value?: string;
  is_default?: boolean;
  onEdit: (keyCode: string, newValue: string) => void;
  selectedLanguage: string;
}

const TranslationTableRow: React.FC<TranslationTableRowProps> = ({
  getTranslationsByLanguage,
  keyCode,
  value,
  is_default,
  onEdit,
  selectedLanguage,
}) => {
  const [showModalDeleteLabel, setshowModalDeleteLabel] =
    useState<boolean>(false);
  const [isEditingLabel, setisEditingLabel] = useState(false);
  const [editedValue, setEditedValue] = useState(keyCode);
  const { user: loggedInUser }: AuthState = useSelector(
    (state: RootState) => state.auth,
  );

  const [editedTranslation, setEditedTranslation] = useState(value);
  const [isEditingTranslation, setisEditingTranslation] = useState(false);

  const handleDoubleClickLabel = () => {
    if (!is_default && !isEditingLabel) {
      setisEditingLabel(true);
    }
  };
  const handleDoubleClickTranslation = () => {
    if (!isEditingTranslation) {
      setisEditingTranslation(true);
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!is_default && isEditingLabel) {
      setEditedValue(e.target.value);
    }
  };

  const handleTranslationCellChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedTranslation(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isEditingLabel) {
      e.preventDefault();
      setisEditingLabel(false);
      saveChangesLabel();
    }
  };

  const handleTranslationKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setisEditingTranslation(false);
      saveChangesTranslation();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== "INPUT" && isEditingLabel) {
      setisEditingLabel(false);
      saveChangesLabel(); // Save changes when clicking outside the input field
    } else if (target.tagName !== "INPUT" && isEditingTranslation) {
      setisEditingTranslation(false);
      saveChangesTranslation(); // Save changes when clicking outside the input field
    }
  };

  // Delete functionality using the deleteRow method from DataAccessor
  const handleDelete = async (keyCode: string) => {
    const removeKey = deleteKey(keyCode);
    removeKey.then(() => {
      getTranslationsByLanguage(selectedLanguage);
      handleClose();
    });

    Audits.logAudits(
      loggedInUser || "",
      "Delete Label",
      "Deleted a label with the following values: " + JSON.stringify(keyCode),
      KEYS_TABLE_NAME,
      "",
    );
  };

  const saveChangesLabel = async () => {
    try {
      if (keyCode !== editedValue) {
        onEdit(keyCode || "", editedValue || "");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const saveChangesTranslation = async () => {
    try {
      if (value !== editedTranslation) {
        upsertTranslation(
          selectedLanguage,
          keyCode || "",
          editedTranslation || "",
        );
        //Audits
        Audits.logAudits(
          loggedInUser || "",
          "Upsert Translation",
          "Upserted a translation with the following value: " +
            JSON.stringify(editedTranslation) +
            ", for the language: " +
            '"' +
            selectedLanguage +
            '"' +
            ", and the label: " +
            '"' +
            keyCode +
            '"',
          "i18n_values",
          "",
        );
      }
    } catch (error) {
      console.error("Error saving changes:", error);
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
  }, [value]);

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
            border: "none",
            outline: "none",
            backgroundColor: isEditingLabel ? "#f2f2f2" : "transparent",
            borderRadius: "4px",
          }}
          data-testid="label-input"
        />
        {is_default ? (
          <IoLockClosed className="icon-lock" />
        ) : (
          <>
            <MdDelete
              onClick={showModalDelete}
              className="icon-delete"
              data-testid="delete-label-icon"
            />
          </>
        )}
        <Modal
          show={showModalDeleteLabel}
          onHide={handleClose}
          data-testid="delete-label-modal"
        >
          <Modal.Header>
            <Modal.Title data-testid="delete-label-title">
              Delete Label
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to delete the label <b>{keyCode}</b>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <Button
                onClick={() => handleDelete(keyCode || "")}
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

      <td
        onDoubleClick={() => handleDoubleClickTranslation()}
        data-testid="translation-element"
      >
        <input
          value={editedTranslation}
          onChange={handleTranslationCellChange}
          onBlur={handleTranslationBlur}
          onKeyDown={handleTranslationKeyDown}
          readOnly={!isEditingTranslation}
          style={{
            border: "none",
            outline: "none",
            backgroundColor: isEditingTranslation ? "#f2f2f2" : "transparent",
            borderRadius: "4px",
          }}
          data-testid="translation-input"
        />
      </td>
    </tr>
  );
};

export default TranslationTableRow;
