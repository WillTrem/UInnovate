import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { viewSelection } from "../pages/ObjectMenu";

interface AdditionalViewListState {
  value: Array<viewSelection>;
}
const selectViewsStorageKey = "objectMenu_selectedViews";

const sessionStoreVal = sessionStorage.getItem(selectViewsStorageKey) || "[]";
const initialState = { value: JSON.parse(sessionStoreVal) };

const additionalViewSlice = createSlice({
  name: "selectedViewList",
  initialState,
  reducers: {
    updateSelectedViewList: (
      state: AdditionalViewListState,
      action: PayloadAction<Array<viewSelection>>,
    ) => {
      state.value = action.payload;
      sessionStorage.setItem(
        selectViewsStorageKey,
        JSON.stringify(action.payload),
      );
    },
  },
});

export const { updateSelectedViewList } = additionalViewSlice.actions;
export default additionalViewSlice.reducer;
