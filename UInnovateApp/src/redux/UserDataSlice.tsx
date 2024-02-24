import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import vmd, { UserData } from "../virtualmodel/VMD";


interface UserDataState {
	users: UserData[]
}

// Global state that keeps in memory the user info data 
const userDataSlice = createSlice({
	name: "userData",
	initialState: { users: [] },
	reducers: {
		setUserData: (state: UserDataState, action: PayloadAction<UserData[]>) => {
			state.users = action.payload;
		},
		updateUserData: (state: UserDataState, action: PayloadAction<UserData>) => {
			let found = false;
			const updatedUser = action.payload;
			const newUserData = state.users.map((user) => {
				if (user.email === updatedUser.email) {
					found = true;
					return {...user, ...updatedUser}
				}
				else{
					return user;
				}
			});
			if(!found){
				newUserData.push(updatedUser)
			}
			state.users = newUserData;
		},
		saveUserDataToDB: (state: UserDataState) => {
			const updateUserDataFA = vmd.getFunctionAccessor('meta', 'update_user_data');
			updateUserDataFA.setBody(state);
			updateUserDataFA.executeFunction();
		}
	},
});

export const { setUserData, updateUserData, saveUserDataToDB } = userDataSlice.actions;

export default userDataSlice.reducer;