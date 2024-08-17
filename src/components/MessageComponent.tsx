import { Box, Typography } from "@mui/material";
import { memo } from "react";
import moment from "moment";
import { fileFormat } from "../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
import { MessageType, UserType } from "../types/types";

const MessageComponent = ({
	message,
	user,
}: {
	message: MessageType;
	user: UserType;
}) => {
	const { sender, content, attachments = [], createdAt } = message;

	const sameSender = sender?._id === user?._id;

	const timeago = moment(createdAt).fromNow();

	return (
		<motion.div
			initial={{ opacity: 0, x: "-100%" }}
			whileInView={{ opacity: 1, x: "0%" }}
			style={{
				alignSelf: sameSender ? "flex-end" : "flex-start",
				backgroundColor: "white",
				color: "black",
				borderRadius: "5px",
				padding: "0.5rem",
				width: "fit-content",
				zIndex: 50,
				shadow: "0 0 10px rgba(0, 0, 0, 0.5)",
				marginBottom: "0.2rem",
			}}
		>
			{!sameSender && (
				<Typography color={"#2694ab"} fontWeight={"600"} variant="caption">
					{sender.name}
				</Typography>
			)}

			{content && <Typography>{content}</Typography>}

			{attachments.length > 0 &&
				attachments.map((attachment, index) => {
					const url = attachment.url;
					const file = fileFormat(url);

					return (
						<Box key={index}>
							<a href={url} target="_blank" download style={{ color: "black" }}>
								<RenderAttachment file={file} url={url} />
							</a>
						</Box>
					);
				})}

			<Typography variant="caption" color={"text.secondary"}>
				{timeago}
			</Typography>
		</motion.div>
	);
};

export default memo(MessageComponent);
