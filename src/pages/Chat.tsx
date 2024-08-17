import {
	Drawer,
	Grid,
	IconButton,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ChatList from "../components/ChatList";
import Header from "../components/Header";
import {
	NEW_MESSAGE_ALERT,
	ONLINE_USERS,
	REFETCH_CHATS,
} from "../constants/events";
import { useMyChatsQuery } from "../redux/api/api";
import { addNewMessageAlert } from "../redux/reducers/chatReducer";
import { RootState } from "../redux/store";
import { useSocket } from "../socket";
import { ChatType } from "../types/types";
import img from "../assets/social-media-sketch-vector-seamless-600nw-1660950727.webp";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import MenuIcon from "@mui/icons-material/Menu";
import SEO from "../components/Seo";

const Chat = () => {
	const dispatch = useDispatch();
	const { data, isLoading, isError, refetch } = useMyChatsQuery();

	const { isDrawerOpen } = useSelector((state: RootState) => state.misc);
	const { newMessagesAlert } = useSelector((state: RootState) => state.chat);

	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

	const socket = useSocket();
	socket!.emit(ONLINE_USERS);

	const newMessagesAlertHandler = useCallback(
		(data: { chatId: string }) => {
			dispatch(addNewMessageAlert(data.chatId));
		},
		[dispatch]
	);

	const onlineUsersHandler = useCallback((data: string[]) => {
		setOnlineUsers(data);
	}, []);

	const refetchChatsHandler = useCallback(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		socket!.on(NEW_MESSAGE_ALERT, newMessagesAlertHandler);
		socket!.on(REFETCH_CHATS, refetchChatsHandler);
		socket!.on(ONLINE_USERS, onlineUsersHandler);

		return () => {
			socket!.off(NEW_MESSAGE_ALERT, newMessagesAlertHandler);
			socket!.off(REFETCH_CHATS, refetchChatsHandler);
			socket!.off(ONLINE_USERS, onlineUsersHandler);
		};
	}, [
		socket,
		newMessagesAlertHandler,
		refetchChatsHandler,
		onlineUsersHandler,
	]);

	if (isError) {
		return toast.error("Failed to load chats");
	}
	return (
		<>
			<SEO
				title="Chat with Travel Partners | Travel Link"
				description="Chat with your travel partners on Travel Link and stay connected while planning your next adventure. Exchange messages, share trip details, and build meaningful connections with fellow travelers. Start your conversation and collaborate with like-minded adventurers on Travel Link."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Grid container height={"100vh"} width={"100vw"} position={"relative"}>
				<IconButton
					sx={{
						display: { xs: "block", lg: "none" },
						position: "absolute",
						top: 4,
						left: 2,
					}}
					onClick={() => dispatch(setIsDrawerOpen(true))}
				>
					<MenuIcon />
				</IconButton>
				<Grid
					item
					height={"100%"}
					xs={0}
					lg={2}
					sx={{ display: { xs: "none", lg: "block" } }}
				>
					<Header />
				</Grid>
				<Drawer
					open={isDrawerOpen}
					sx={{ display: { xs: "block", lg: "none" } }}
					onClose={() => dispatch(setIsDrawerOpen(false))}
				>
					<Header />
				</Drawer>
				<Grid item height={"100%"} xs={12} sm={5} lg={3} bgcolor={"whitesmoke"}>
					{isLoading ? (
						<Skeleton sx={{ height: "100%", width: "100%" }} />
					) : (
						<ChatList
							chats={data?.chats as ChatType[]}
							newMessagesAlert={newMessagesAlert}
							onlineUsers={onlineUsers}
						/>
					)}
				</Grid>

				<Grid
					item
					height={"100%"}
					xs={0}
					sm={7}
					lg={7}
					bgcolor={"whitesmoke"}
					sx={{
						display: { xs: "none", sm: "block" },
						position: "relative",
					}}
				>
					<Stack
						sx={{
							backgroundImage: `url(${img})`,
							backgroundSize: "cover",
							backgroundRepeat: "no-repeat",
							position: "absolute",
							top: 0,
							left: 0,
							height: "100%",
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Stack
							sx={{
								height: "100%",
								width: "100%",
								bgcolor: "gray",
								opacity: 0.4,
								position: "absolute",
								top: 0,
								left: 0,
							}}
						/>
						<Typography
							textAlign={"center"}
							fontSize={"1.5rem"}
							fontWeight={600}
						>
							Select a chat to start messaging
						</Typography>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
};

export default Chat;