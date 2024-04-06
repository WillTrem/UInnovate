import React, { useEffect, useState } from "react";
import { DataAccessor, Row } from "../../virtualmodel/DataAccessor";
import vmd from "../../virtualmodel/VMD";
import { Modal, Form } from "react-bootstrap";
import { Button, SelectChangeEvent } from "@mui/material";
import TableComponent from "react-bootstrap/Table";
import { IoMdAddCircle } from "react-icons/io"; 
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "../../styles/InternationalizationTab.css";
import isoLanguages from "iso-639-1";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { AuthState } from '../../redux/AuthSlice';
import  Audits  from "../../virtualmodel/Audits";
import TranslationTableRow from "./TranslationTableRow";

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

  // Key Object
  interface KeyProps {
    id: number;
    key_code: string;
  }

  // Language Object
  interface LanguageProps {
    id: number;
    language_code: string;
    language_name: string;
  }

  // i18n_translations Object
  interface i18nTranslationsProps {
    translation_id: number;
    language_code: string;
    key_code: string;
    value: string;
    is_default: boolean;
  }

  const getTranslationsByLanguage = async (chosenLanguage: string) => {
    try {
      const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
        "meta",
        "i18n_translations",
      );
      const rows = await data_accessor.fetchRowsByColumnValues(
        language_code_column_name,
        chosenLanguage,
        order_by_column,
      );
      if (rows) {
        const translationsWithIsDefault = rows.map((row) => ({
          ...row,
          is_default: row.is_default || false,
        }));
        setTranslations(translationsWithIsDefault);
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  };

  const getKeyProps = async () => {
    try {
      const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        "meta",
        "i18n_keys",
      );

      const rows = await data_accessor.fetchRows();
      if (rows) {
        const keys: KeyProps[] = rows.map((row) => ({
          id: row.id, // Assuming 'id' is the primary key of the table
          key_code: row.key_code as string,
        }));

        return keys;
      }
    } catch (error) {
      console.error("Error fetching keys:", error);
    }
  };

  // Get the key_id of the selected key using the getKeyProps function
  const getKeyId = async (keyCode: string) => {
    try {
      const keys = await getKeyProps();
      if (keys) {
        const keyId = keys.find((key) => key.key_code === keyCode);
        return keyId?.id;
      }
    } catch (error) {
      console.error("Error fetching key_id:", error);
    }
  };

  const getLanguagesProps = async () => {
    try {
      const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
        "meta",
        "i18n_languages",
      );

      // Fetch the list of language names for the dropdown using the LanguageProps interface
      const rows = await data_accessor.fetchRows();
      if (rows) {
        // Process the rows to extract language codes and names
        const languages: LanguageProps[] = rows.map((row) => ({
          id: row.id, // Assuming 'id' is the primary key of the table
          language_code: row.language_code as string,
          language_name: row.language_name as string,
        }));

        // Return the list of languages_codes
        return languages;
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

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

  // Get the language_id of the selected language from the i18n_languages table using the LanguageProps interface. Return only the language_id, hence the id attribute
  const getLanguageId = async (languageCode: string) => {
    try {
      const languages = await getLanguagesProps();
      if (languages) {
        const languageId = languages.find(
          (language) => language.language_code === languageCode,
        );
        return languageId?.id;
      }
    } catch (error) {
      console.error("Error fetching language_id:", error);
    }
  };

  const getTranslationsPropsByLanguage = async (selectedLanguage: string) => {
    try {
      const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
        "meta",
        "i18n_translations",
      );

      const rows = await data_accessor.fetchRowsByColumnValues(
        language_code_column_name,
        selectedLanguage,
        order_by_column,
      );
      if (rows) {
        const translations: i18nTranslationsProps[] = rows.map((row) => ({
          translation_id: row.translation_id as number,
          language_code: row.language_code as string,
          key_code: row.key_code as string,
          value: row.value as string,
          is_default: row.is_default as boolean,
        }));

        return translations;
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  };

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
    setNewLanguageCode("");
    setNewLanguageName("");
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
          },
        );

        setLanguages((prevLanguages) => [...prevLanguages, newLanguageCode]);
        await data_accessor?.addRow();
        resetNewLanguage();
      } catch (error) {
        console.error("Error adding language:", error);
      }
    } else {
      console.error("Please provide valid language code and name.");
    }

    setshowModalAddLanguage(false);
  };

  const handleAddRowClick = async () => {
    setshowModalAddLabel(true);
  };

  const handleSaveLabel = async (labelName: string) => {
    setshowModalAddLabel(false);
    try {
      await vmd
        .getAddRowDataAccessor("meta", "i18n_keys", {
          key_code: labelName.trim() || "New Label",
          is_default: false, // Set is_default to false for user-added labels
        })
        .addRow();

      await getTranslationsByLanguage(selectedLanguage);
    } catch (error) {
      console.error("Error adding a new label:", error);
    }

    Audits.logAudits(
      loggedInUser || "",
      "Add Label",
      "Added a new label with the following values: " +
        JSON.stringify(labelName),
      "i18n_keys",
      "",
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
        keyCode,
      );

      // Verify if update response is successful
      const response = await data_accessor.updateRow();

      if (response && response.status >= 200 && response.status < 300) {
        await getTranslationsByLanguage(selectedLanguage);
      } else {
        console.error(
          `Failed to update label with keyCode ${keyCode} to value ${editedValue}`,
        );
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
      "Edited a label with the following values: " +
        JSON.stringify(editedValue),
      "i18n_keys",
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
      "i18n_languages",
      "",
    );
  };

  const handleSelectedLanguage = (event: SelectChangeEvent<string>) => {
    const language = event.target.value as string;
    setSelectedLanguage(language);
    getTranslationsByLanguage(language);

    // Audits
    Audits.logAudits(
      loggedInUser || "",
      "Select Internationalization Language",
      "Selected language: " + '"' + language + '"',
      "i18n_languages",
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
      "i18n_translations",
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
                    <InputLabel data-testid="selected-language-label">Selected Language</InputLabel>
                    <Select
                        labelId="selected-language-label"
                        name="Selected Language"
                        onChange={handleSelectedLanguage}
                        onClick={handleDropdownLanguages}
                        variant="outlined"
                        label="Selected Language"
                        defaultValue=''
                    >
                        {languages.map(language => (
                            <MenuItem key={language} value={language}>{language}</MenuItem>
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
                      getTranslationsByLanguage={getTranslationsByLanguage}
                      key={idx}
                      keyCode={translation["key_code"] as string}
                      value={translation["value"] as string}
                      is_default={translation["is_default"] as boolean}
                      onEdit={handleEdit}
                      getLanguageId={getLanguageId}
                      getKeyId={getKeyId}
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