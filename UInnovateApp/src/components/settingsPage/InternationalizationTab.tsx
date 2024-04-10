import React, { useEffect, useState } from "react";
import { Row } from "../../virtualmodel/DataAccessor";
import { Modal, Form } from "react-bootstrap";
import { Button, SelectChangeEvent } from "@mui/material";
import TableComponent from "react-bootstrap/Table";
import { IoMdAddCircle } from "react-icons/io";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "../../styles/InternationalizationTab.css";
import isoLanguages from "iso-639-1";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { AuthState } from "../../redux/AuthSlice";
import Audits from "../../virtualmodel/Audits";
import TranslationTableRow from "./TranslationTableRow";
import {
  KEYS_TABLE_NAME,
  LANGUAGE_TABLE_NAME,
  TRANSLATIONS_VIEW_NAME,
  editKeyCode,
  getLanguagesProps,
  getTranslationsByLanguage,
  getTranslationsPropsByLanguage,
  saveLabel,
  saveLanguage,
} from "../../virtualmodel/I18nDataAccessor";

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

// const language_code_column_name = "language_code";
// const order_by_column = "translation_id";

const InternationalizationTab = () => {
  const [showModalAddLanguage, setshowModalAddLanguage] =
    useState<boolean>(false);
  const [showModalAddLabel, setshowModalAddLabel] = useState<boolean>(false);
  const [translations, setTranslations] = useState<Row[]>([]);
  const [newLanguageCode, setNewLanguageCode] = useState("");
  const [newLanguageName, setNewLanguageName] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  const [newLabelName, setNewLabelName] = useState<string>("");
  const { user: loggedInUser }: AuthState = useSelector(
    (state: RootState) => state.auth,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en"); // Default language is English

  // Return the list of language codes using the getLanguagesProps function
  const getLanguagesCodes = async () => {
    try {
      const languages = await getLanguagesProps();
      if (languages) {
        const languageCodes = languages.map(
          (language) => language.language_code,
        );
        setLanguages(languageCodes);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  useEffect(() => {
    // getTranslationsByLanguage(selectedLanguage);
    loadTranslations(selectedLanguage);
    getLanguagesCodes();
  }, []);

  const loadTranslations = (lang: string) => {
    const translations = getTranslationsByLanguage(lang);
    translations.then((data: any) => {
      setTranslations(data);
    });
  };

  const showAddLanguage = () => {
    setshowModalAddLanguage(true);
  };

  const handleClose = () => {
    setshowModalAddLanguage(false);
    setshowModalAddLabel(false);
    resetNewLanguage();
  };

  const resetNewLanguage = () => {
    setNewLanguageCode("");
    setNewLanguageName("");
  };

  const handleSaveLanguage = async () => {
    const setLang = saveLanguage(newLanguageCode, newLanguageName);
    setLang.then(() => {
      setLanguages([...languages, newLanguageCode]);
      resetNewLanguage();
    });

    setshowModalAddLanguage(false);
  };

  const handleAddRowClick = async () => {
    setshowModalAddLabel(true);
  };

  const handleSaveLabel = async (labelName: string) => {
    setshowModalAddLabel(false);
    const save = saveLabel(labelName);
    save.then(() => {
      loadTranslations(selectedLanguage);
    });

    Audits.logAudits(
      loggedInUser || "",
      "Add Label",
      "Added a new label with the following values: " +
        JSON.stringify(labelName),
      KEYS_TABLE_NAME,
      "",
    );
  };

  const handleEdit = async (keyCode: string, editedValue: string) => {
    const edit = editKeyCode(keyCode, editedValue);
    edit.then(() => {
      loadTranslations(selectedLanguage);
    });

    Audits.logAudits(
      loggedInUser || "",
      "Edit Label",
      "Edited a label with the following values: " +
        JSON.stringify(editedValue),
      KEYS_TABLE_NAME,
      "",
    );
  };

  const handleDropdownLanguages = async () => {
    await getLanguagesCodes();
  };

  const handleSelectedNewLanguage = (event: SelectChangeEvent<string>) => {
    setNewLanguageName(event.target.value as string);
    setNewLanguageCode(isoLanguages.getCode(event.target.value as string));

    // Audits
    Audits.logAudits(
      loggedInUser || "",
      "Add New Language",
      "Added language: " + '"' + event.target.value + '"',
      LANGUAGE_TABLE_NAME,
      "",
    );
  };

  const handleSelectedLanguage = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    setSelectedLanguage(language);
    loadTranslations(language);

    // Audits
    Audits.logAudits(
      loggedInUser || "",
      "Select Internationalization Language",
      "Selected language: " + '"' + language + '"',
      LANGUAGE_TABLE_NAME,
      "",
    );
  };

  const sortByMissingTranslations = async (selectedLanguage: string) => {
    try {
      const translations =
        await getTranslationsPropsByLanguage(selectedLanguage);
      if (translations) {
        const missingTranslations = translations.filter(
          (translation) =>
            translation.language_code === selectedLanguage &&
            !translation.value,
        );
        const otherTranslations = translations.filter(
          (translation) =>
            translation.language_code !== selectedLanguage || translation.value,
        );
        setTranslations([...missingTranslations, ...otherTranslations]);
      }
    } catch (error) {
      console.error("Error sorting by missing translations:", error);
    }

    // Audits
    Audits.logAudits(
      loggedInUser || "",
      "Sort by Missing Translations",
      "Sorted by missing translations for the language: " +
        '"' +
        selectedLanguage +
        '"',
      TRANSLATIONS_VIEW_NAME,
      "",
    );
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
          onClick={() => {
            loadTranslations(selectedLanguage);
          }}
        >
          Refresh
        </Button>
        <Button
          style={buttonStyle}
          variant="contained"
          data-testid="missing-translations-button"
          onClick={() => sortByMissingTranslations(selectedLanguage)}
        >
          Show Missing Translations
        </Button>
      </div>

      <div className="selected-language-input">
        <FormControl fullWidth>
          <InputLabel data-testid="selected-language-label">
            Selected Language
          </InputLabel>
          <Select
            labelId="selected-language-label"
            name="Selected Language"
            onChange={handleSelectedLanguage}
            onClick={handleDropdownLanguages}
            variant="outlined"
            label="Selected Language"
            defaultValue=""
          >
            {languages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div style={{ maxHeight: "700px", overflowY: "auto" }}>
        {" "}
        {/* Set max height and enable vertical scrolling */}
        <TableComponent bordered data-testid="table-component">
          <thead>
            <tr>
              <th>Label</th>
              <th>{`LANG:${selectedLanguage}`}</th>
            </tr>
          </thead>
          <tbody>
            {translations &&
              translations.map((translation, idx) => {
                if (translation) {
                  return (
                    <TranslationTableRow
                      getTranslationsByLanguage={loadTranslations}
                      key={idx}
                      keyCode={translation["key_code"] as string}
                      value={translation["value"] as string}
                      is_default={translation["is_default"] as boolean}
                      onEdit={handleEdit}
                      selectedLanguage={selectedLanguage}
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

      <Modal
        show={showModalAddLanguage}
        onHide={handleClose}
        data-testid="add-language-modal"
      >
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
                data-testid="language-select"
              >
                {isoLanguages.getAllNames().map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
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

      <Modal
        show={showModalAddLabel}
        onHide={handleClose}
        data-testid="add-label-modal"
      >
        <Modal.Header>
          <Modal.Title>Add New Label</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveLabel(newLabelName);
            }}
          >
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

export default InternationalizationTab;
