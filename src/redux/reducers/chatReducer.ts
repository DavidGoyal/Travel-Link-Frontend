import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

type Props = {
	newMessagesAlert: {
		chatId: string;
		count: number;
	}[];
};

const initialState: Props = {
	newMessagesAlert: getOrSaveFromStorage({
		key: NEW_MESSAGE_ALERT,
		get: true,
	}) || [
		{
			chatId: "",
			count: 0,
		},
	],
};

export const chatReducer = createSlice({
	name: "chat",
	initialState,
	reducers: {
		addNewMessageAlert: (state, action) => {
			const chatId = action.payload;
			const chatIndex = state.newMessagesAlert.findIndex(
				(chat) => chat.chatId === chatId
			);

			if (chatIndex !== -1) {
				state.newMessagesAlert[chatIndex].count++;
			} else {
				state.newMessagesAlert.push({ chatId, count: 1 });
			}
		},
		removeNewMessageAlert: (state, action) => {
			const chatId = action.payload;
			const chatIndex = state.newMessagesAlert.findIndex(
				(chat) => chat.chatId === chatId
			);

			if (chatIndex !== -1) {
				state.newMessagesAlert.splice(chatIndex, 1);
			}
		},
	},
});

export const { addNewMessageAlert, removeNewMessageAlert } =
	chatReducer.actions;
