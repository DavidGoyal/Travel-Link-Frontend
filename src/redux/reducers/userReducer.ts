import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../../types/types";

type Props = {
	user: UserType | null;
	isLoading: boolean;
};

const initialState: Props = {
	user: null,
	isLoading: true,
};

export const userReducer = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.isLoading = true;
			state.user = action.payload;
			state.isLoading = false;
		},
	},
});

export const { setUser } = userReducer.actions;
