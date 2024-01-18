import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface LoadingState{
	loading: boolean // General loading of data throughout the application
}

/**
 * Manages the loading state of the application
 */
const loadingSlice = createSlice({
	name: 'loading',
	initialState: {loading: false},
	reducers:{
		setLoading: (state: LoadingState, action:PayloadAction<boolean>) => {
			state.loading = action.payload;
		}
	}
})

export const {setLoading} = loadingSlice.actions;

export default loadingSlice.reducer;