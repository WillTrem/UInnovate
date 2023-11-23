import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import vmd from "../virtualmodel/VMD";

interface SchemaState {
  value: string;
}

const sessionStoreVal =
  sessionStorage.getItem("selectedSchema") || vmd.getSchemas()[0].schema_name;
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
