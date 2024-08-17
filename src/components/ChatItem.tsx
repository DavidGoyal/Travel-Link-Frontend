import { Avatar, Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { LinkComponent } from "../styles/StyledComponents";

type Props = {
	avatar: string;
	name: string;
	_id: string;
	sameSender: boolean;
	isOnline: boolean;
	newMessageAlert?: {
		chatId: string;
		count: number;
	};
	index: number;
	handleDeleteChat: (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		_id: string
	) => void;
};

const ChatItem = ({
	avatar,
	name,
	_id,
	sameSender,
	isOnline,
	newMessageAlert,
	index = 0,
	handleDeleteChat,
}: Props) => {
	return (
		<LinkComponent
			to={`/chat/${_id}`}
			onContextMenu={(e) => handleDeleteChat(e, _id)}
			sx={{ padding: "0" }}
		>
			<motion.div
				initial={{ opacity: 0, y: "-100%" }}
				whileInView={{ opacity: 1, y: "0%" }}
				transition={{ delay: index * 0.1 }}
				style={{
					display: "flex",
					alignItems: "center",
					gap: "1rem",
					padding: "1rem",
					backgroundColor: sameSender ? "gray" : "unset",
					color: sameSender ? "white" : "unset",
					position: "relative",
				}}
			>
				<Avatar
					src={avatar}
					alt={`Avatar ${index}`}
					sx={{
						width: "3rem",
						height: "3rem",
					}}
				/>

				<Stack>
					<Typography>{name}</Typography>
					{newMessageAlert && (
						<Typography>{newMessageAlert.count} New Message</Typography>
					)}
				</Stack>

				{isOnline && (
					<Box
						sx={{
							width: "10px",
							height: "10px",
							borderRadius: "50%",
							backgroundColor: "green",
							position: "absolute",
							top: "50%",
							right: "1rem",
							transform: "translateY(-50%)",
						}}
					></Box>
				)}
			</motion.div>
		</LinkComponent>
	);
};

export default memo(ChatItem);
