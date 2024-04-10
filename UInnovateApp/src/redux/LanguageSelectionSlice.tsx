import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { I18n } from "../helper/i18nHelpers";
import {
  getLanguagesProps,
  i18nTranslationsProps,
} from "../virtualmodel/I18nDataAccessor";

export interface translation {
  languageCode: string;
  values: i18nTranslationsProps[];
}

export interface i18nState {
  lang: string; //global language state
  translations: translation[]; //all translations
}
const LanguageStorageKey = "PG_Lang";

const sessionStoreVal = sessionStorage.getItem(LanguageStorageKey) || "en";

let translation: translation = { languageCode: sessionStoreVal, values: [] };

const initialState: i18nState = {
  lang: sessionStoreVal,
  translations: [translation],
};
const languageSelectionSlice = createSlice({
  name: "languageSelection",
  initialState,
  reducers: {
    updateLang: (state: i18nState, action: PayloadAction<string>) => {
      state.lang = action.payload;
      sessionStorage.setItem(LanguageStorageKey, action.payload);
    },
    updateTranslation(state: i18nState, action: PayloadAction<translation[]>) {
      state.translations = action.payload;
    },
  },
});

export const { updateLang, updateTranslation } = languageSelectionSlice.actions;
export default languageSelectionSlice.reducer;
