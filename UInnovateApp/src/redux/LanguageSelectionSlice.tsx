import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface LanguageSelectionState {
  value: string;
}
const LanguageStorageKey = "PG_Lang";

const sessionStoreVal = sessionStorage.getItem(LanguageStorageKey) || "en";
const initialState = { value: sessionStoreVal };

const languageSelectionSlice = createSlice({
  name: "languageSelection",
  initialState,
  reducers: {
    updateLang: (
      state: LanguageSelectionState,
      action: PayloadAction<string>,
    ) => {
      state.value = action.payload;
      sessionStorage.setItem(LanguageStorageKey, action.payload);
      //   console.log("updated lang to :", action.payload);
    },
  },
});

export const { updateLang } = languageSelectionSlice.actions;
export default languageSelectionSlice.reducer;
