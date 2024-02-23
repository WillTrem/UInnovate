import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axiosCustom from "../api/AxiosCustom";
import vmd from "../virtualmodel/VMD";

export const LOGIN_BYPASS = import.meta.env.VITE_LOGIN_BYPASS === "true";

export interface AuthState {
	user: string | null;
	token: string | null;
	role: string | null;
	schema_access: string[];
}

interface DecodedToken {
	role: string;
	email: string;
	schema_access: string[];
	exp: string;
}

export enum Role {
	ADMIN = "administrator",
	CONFIG = "configurator",
	USER = "user",
}

const authSlice = createSlice({
	name: "auth",
	initialState: { user: null, token: null, role: null, schema_access: [] } as AuthState,
	reducers: {
		logIn: (state: AuthState, action: PayloadAction<string>) => {
			const token = action.payload;
			state.token = token;

			// Obtains the role & email from the "role" and "email" claims of the JWT token
			const decodedToken = jwtDecode(token) as DecodedToken;
			state.role = decodedToken.role;
			state.user = decodedToken.email;
			state.schema_access = decodedToken.schema_access || [];
			console.log(state.schema_access)

			axiosCustom.defaults.headers.common["Authorization"] = `bearer ${token}`;
		},
		logOut: (state: AuthState, action: PayloadAction) => {
			state.user = null;
			state.token = null;
			state.role = null;
			state.schema_access = [];

			axiosCustom.defaults.headers.common["Authorization"] = undefined;

			const logoutFuncAccessor = vmd.getFunctionAccessor("meta", "logout");
			logoutFuncAccessor.executeFunction({ withCredentials: true });
		},
		updateSchemaAccess: (state: AuthState, action: PayloadAction<string[]>) => {
			const newSchemaAccess = action.payload;
			state.schema_access = newSchemaAccess;
		}
	},
});

export const { logIn, logOut, updateSchemaAccess } = authSlice.actions;

export default authSlice.reducer;
