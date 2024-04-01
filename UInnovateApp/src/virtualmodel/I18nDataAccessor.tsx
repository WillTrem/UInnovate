import { DataAccessor, Row } from "../virtualmodel/DataAccessor";
import vmd from "./VMD";

const SCHEMA_NAME = "meta";
export const TRANSLATIONS_TABLE_NAME = "i18n_translations";
export const LANGUAGE_TABLE_NAME = "i18n_languages";
export const KEYS_TABLE_NAME = "i18n_keys";
export const VALUES_TABLE_NAME = "i18n_values";
export const LANGUAGE_CODE_COLUMN_NAME = "language_code";
export const ORDER_BY_COLUMN = "translation_id";

// Key Object
export interface KeyProps {
  id: number;
  key_code: string;
}

// Language Object
export interface LanguageProps {
  id: number;
  language_code: string;
  language_name: string;
}

// i18n_translations Object
export interface i18nTranslationsProps {
  translation_id: number;
  language_code: string;
  key_code: string;
  value: string;
  is_default: boolean;
}

export const getTranslationsByLanguage = async (chosenLanguage: string) => {
  try {
    const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
      SCHEMA_NAME,
      TRANSLATIONS_TABLE_NAME,
    );
    const rows = await data_accessor.fetchRowsByColumnValues(
      LANGUAGE_CODE_COLUMN_NAME,
      chosenLanguage,
      ORDER_BY_COLUMN,
    );
    if (rows) {
      const translationsWithIsDefault = rows.map((row) => ({
        ...row,
        is_default: row.is_default || false,
      }));
      console.log("data retreived...");
      return translationsWithIsDefault;
    }
  } catch (error) {
    console.error("Error fetching translations:", error);
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

export const getKeyProps = async () => {
  try {
    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      SCHEMA_NAME,
      KEYS_TABLE_NAME,
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

export const getLanguagesProps = async () => {
  try {
    const data_accessor: DataAccessor = vmd.getRowsDataAccessor(
      SCHEMA_NAME,
      LANGUAGE_TABLE_NAME,
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

export const editKeyCode = async (keyCode: string, editedValue: string) => {
  try {
    const data_accessor: DataAccessor = vmd.getUpdateRowDataAccessorView(
      SCHEMA_NAME,
      KEYS_TABLE_NAME,
      {
        key_code: editedValue,
      },
      "key_code",
      keyCode,
    );

    // Verify if update response is successful
    const response = await data_accessor.updateRow();

    if (response && response.status >= 200 && response.status < 300) {
      return; // await getTranslationsByLanguage(selectedLanguage);
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
};

export const getTranslationsPropsByLanguage = async (
  selectedLanguage: string,
) => {
  try {
    const data_accessor: DataAccessor = vmd.getViewRowsDataAccessor(
      SCHEMA_NAME,
      TRANSLATIONS_TABLE_NAME,
    );

    const rows = await data_accessor.fetchRowsByColumnValues(
      LANGUAGE_CODE_COLUMN_NAME,
      selectedLanguage,
      ORDER_BY_COLUMN,
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

export const saveLanguage = async (
  newLanguageCode: string,
  newLanguageName: string,
) => {
  if (newLanguageCode && newLanguageName) {
    try {
      const schema = vmd.getTableSchema(LANGUAGE_TABLE_NAME);
      if (!schema) {
        console.error("Could not find schema for table ", LANGUAGE_TABLE_NAME);
        return;
      }

      const data_accessor: DataAccessor = vmd.getAddRowDataAccessor(
        SCHEMA_NAME,
        LANGUAGE_TABLE_NAME,
        {
          language_code: newLanguageCode,
          language_name: newLanguageName,
        },
      );

      // setLanguages((prevLanguages) => [...prevLanguages, newLanguageCode]);
      await data_accessor?.addRow();
      // resetNewLanguage();
    } catch (error) {
      console.error("Error adding language:", error);
    }
  } else {
    console.error("Please provide valid language code and name.");
  }
};

export const saveLabel = async (labelName: string) => {
  try {
    await vmd
      .getAddRowDataAccessor(SCHEMA_NAME, KEYS_TABLE_NAME, {
        key_code: labelName.trim() || "New Label",
        is_default: false, // Set is_default to false for user-added labels
      })
      .addRow();
  } catch (error) {
    console.error("Error adding a new label:", error);
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

export const upsertTranslation = async (
  languageCode: string,
  keyCode: string,
  newTranslation: string,
) => {
  try {
    // Get the language and key IDs
    const languageId = await getLanguageId(languageCode);
    const keyId = await getKeyId(keyCode);

    // Get the data accessor for upsert operation
    const dataAccessor = vmd.getUpsertDataAccessor(
      SCHEMA_NAME,
      "i18n_values",
      {
        columns: "language_id, key_id, value",
        on_conflict: "language_id, key_id",
      },
      {
        language_id: languageId,
        key_id: keyId,
        value: newTranslation,
      },
    );

    // if the value is not empty and null, perform the upsert operation
    if (newTranslation !== "" && newTranslation !== null) {
      await dataAccessor.upsert();
    }
  } catch (error) {
    console.error(`Error upserting translation: ${newTranslation}`, error);
  }
};

export const deleteKey = async (keyCode: string) => {
  try {
    const primaryKeyName = "key_code"; // Assuming "key_code" is the primary key of the table
    const data_accessor: DataAccessor = vmd.getRemoveRowAccessor(
      SCHEMA_NAME,
      KEYS_TABLE_NAME,
      primaryKeyName,
      keyCode,
    );

    // Call the deleteRow method of the DataAccessor instance
    const response = await data_accessor.deleteRow();

    // Check if the deletion was successful
    if (response && response.status >= 200 && response.status < 300) {
    } else {
      // Handle error responses
      console.error(`Failed to delete row with keyCode ${keyCode}`);
      if (response) {
        console.error(`Error status: ${response.status}`);
        console.error(`Error message: ${response.data}`);
      }
    }
  } catch (error) {
    console.error("Error deleting row:", error);
  }
};
