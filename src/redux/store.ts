import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { api } from "./api/api";
import { miscReducer } from "./reducers/miscReducer";
import { chatReducer } from "./reducers/chatReducer";

export const store = configureStore({
	reducer: {
		[userReducer.name]: userReducer.reducer,
		[miscReducer.name]: miscReducer.reducer,
		[chatReducer.name]: chatReducer.reducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
