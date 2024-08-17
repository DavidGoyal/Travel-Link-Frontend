import { createSlice } from "@reduxjs/toolkit";

type Props = {
	isTravelStatusOpen: boolean;
	isFileMenu: boolean;
	isUploadingLoader: boolean;
	isDrawerOpen: boolean;
};

const initialState: Props = {
	isTravelStatusOpen: false,
	isFileMenu: false,
	isUploadingLoader: false,
	isDrawerOpen: false,
};

export const miscReducer = createSlice({
	name: "misc",
	initialState,
	reducers: {
		setTravelStatus: (state, action) => {
			state.isTravelStatusOpen = action.payload;
		},
		setFileMenu: (state, action) => {
			state.isFileMenu = action.payload;
		},
		setIsUploadingLoader: (state, action) => {
			state.isUploadingLoader = action.payload;
		},
		setIsDrawerOpen: (state, action) => {
			state.isDrawerOpen = action.payload;
		},
	},
});

export const {
	setTravelStatus,
	setFileMenu,
	setIsUploadingLoader,
	setIsDrawerOpen,
} = miscReducer.actions;
