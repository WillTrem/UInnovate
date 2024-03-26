import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NotificationSliceState{
	showSnackbar: boolean;
	message: string;
	isError: boolean;
}

const initialNotificationState = {
	showSnackbar: false,
	message: '',
	isError: false
}

const notificationSlice = createSlice({
	name: "notification",
	initialState: initialNotificationState,
	reducers: {
		displayNotification: (state: NotificationSliceState, action: PayloadAction<string>) =>{
			state.message = action.payload;
			state.isError = false;
			state.showSnackbar = true;
		} ,
		displayError: (state: NotificationSliceState, action: PayloadAction<string>) =>{
			state.message = action.payload;
			state.isError = true;
			state.showSnackbar = true;
		} ,
		closeNotification: (state: NotificationSliceState) => {
			state.showSnackbar = false;
		}
	}
} )

export const {displayNotification, displayError, closeNotification} = notificationSlice.actions;
export default notificationSlice.reducer;