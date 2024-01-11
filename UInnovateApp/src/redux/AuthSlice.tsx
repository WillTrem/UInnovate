import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode'
import axios from "axios";

interface AuthState{
	user: string | null, 
	token: string | null,
	role: string | null
}

interface DecodedToken{
	role: string,
	email: string,
	exp: string
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {user: null, token: null, role: null},
	reducers:{
		logIn: (state: AuthState, action: PayloadAction<string>) => {
			const token = action.payload;
			state.token = token;
			// Obtains the role & email from the "role" and "email" claims of the JWT token
			const decodedToken = jwtDecode(token) as DecodedToken;
			state.role = decodedToken.role;
			state.user = decodedToken.email;
			console.log(`Role: ${decodedToken.role}`);

			axios.defaults.headers["Authorization"] = `bearer ${token}`;
		},
		logOut: (state: AuthState, action: PayloadAction) => {
			state.user = null;
			state.token = null;
			state.role = null;

			axios.defaults.headers.common["Authorization"] = undefined;
		}
	}
})

export const {logIn, logOut} = authSlice.actions;

export default authSlice.reducer;