import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface LoadingState{
	loading: boolean // General loading of data throughout the application
}

/**
 * Manages the loading state of the application
 */
const loadingSlice = createSlice({
	name: 'loading',
	initialState: {loading: true}, // Initially set to true so the app doesn't render until authentication has been verified
	reducers:{
		setLoading: (state: LoadingState, action:PayloadAction<boolean>) => {
			state.loading = action.payload;
		}
	}
})

export const {setLoading} = loadingSlice.actions;

export default loadingSlice.reducer;