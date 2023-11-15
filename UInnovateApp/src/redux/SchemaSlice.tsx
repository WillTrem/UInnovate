import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import attr from "../virtualmodel/Tables";

interface SchemaState {
  value: string;
}

const sessionStoreVal =
  sessionStorage.getItem("selectedSchema") || attr[0].schema;
const initialState = { value: sessionStoreVal };

//aitomagic way to update the state without making a copy of the original state before.
const schemaSlice = createSlice({
  name: "schema",
  initialState,
  reducers: {
    updateSelectedSchema: (
      state: SchemaState,
      action: PayloadAction<string>
    ) => {
      console.log(`updating value to ${action.payload}`);
      state.value = action.payload;
      sessionStorage.setItem("selectedSchema", action.payload);
    },
  },
});

export const { updateSelectedSchema } = schemaSlice.actions;
export default schemaSlice.reducer;
