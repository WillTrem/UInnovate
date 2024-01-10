import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState{
	user: string | null, 
	token: string | null
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {user: null, token: null},
	reducers:{
		logIn: (state: AuthState, action: PayloadAction<{email: string, token: string}>) => {
			const {email, token} = action.payload;
			state.user = email;
			state.token = token;
			axios.defaults.headers["Authorization"] = `bearer ${token}`;
		},
		logOut: (state: AuthState, action: PayloadAction) => {
			state.user = null;
			state.token = null;
			axios.defaults.headers.common["Authorization"] = undefined;
		}
	}
})

export const {logIn, logOut} = authSlice.actions;

export default authSlice.reducer;