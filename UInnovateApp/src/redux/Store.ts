import { configureStore } from "@reduxjs/toolkit";
import schemaReducer from "./SchemaSlice";
import authReducer from './AuthSlice';
import loadingReducer from './LoadingSlice';
import userDataReducer from './UserDataSlice';
import notificationReducer from './NotificationSlice';
import selectedViewListReducer from './AdditionalViewSlice';
import languageSelectionReducer from './LanguageSelectionSlice';

// App state store
const Store = configureStore({
  reducer: {
    schema: schemaReducer,
    auth: authReducer,
    loading: loadingReducer,
    userData: userDataReducer,
    notification: notificationReducer,
    languageSelection: languageSelectionReducer,
    selectedViewList:  selectedViewListReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;
export default Store;
