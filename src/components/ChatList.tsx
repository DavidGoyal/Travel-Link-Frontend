import { Stack } from "@mui/material";
import ChatItem from "./ChatItem";
import React from "react";
import { ChatType } from "../types/types";

type props = {
	w?: string;
	chats?: ChatType[];
	chatId?: string;
	onlineUsers?: string[];
	newMessagesAlert?: {
		chatId: string;
		count: number;
	}[];
	handleDeleteChat?: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		_id: string
	) => void;
};

const ChatList = ({
	w = "100%",
	chats = [],
	chatId,
	onlineUsers = [],
	newMessagesAlert = [
		{
			chatId: "",
			count: 0,
		},
	],
	handleDeleteChat,
}: props) => {
	return (
		<Stack
			width={w}
			direction={"column"}
			overflow={"auto"}
			height={"100%"}
			sx={{ borderRight: { xs: "none", sm: "0.1px solid gray" } }}
			paddingTop={{ xs: "2.5rem", lg: 0 }}
		>
			{chats &&
				chats.map((data, index) => {
					const { _id, name, avatar, members }: ChatType = data;

					const newMessageAlert = newMessagesAlert?.find(
						(item) => item.chatId === _id
					);

					const isOnline = members?.some((member) =>
						onlineUsers.includes(member)
					);

					return (
						<ChatItem
							key={index}
							avatar={avatar[0]}
							name={name}
							_id={_id}
							index={index}
							newMessageAlert={newMessageAlert}
							isOnline={isOnline}
							sameSender={chatId === _id}
							handleDeleteChat={handleDeleteChat!}
						/>
					);
				})}
		</Stack>
	);
};

export default ChatList;
