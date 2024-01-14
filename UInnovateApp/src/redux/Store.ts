import { configureStore } from "@reduxjs/toolkit";
import schemaReducer from "./SchemaSlice";
import authReducer from './AuthSlice'

// App state store
const Store = configureStore({
  reducer: {
    schema: schemaReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;
export default Store;
