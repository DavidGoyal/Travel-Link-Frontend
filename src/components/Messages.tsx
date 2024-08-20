import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, Skeleton, Stack } from "@mui/material";
import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";
import { useGetChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { RootState } from "../redux/store";
import { useSocket } from "../socket";
import { InputBox } from "../styles/StyledComponents";
import { MessageType } from "../types/types";
import MessageComponent from "./MessageComponent";
import { useInfiniteScrollTop } from "6pp";
import { setFileMenu } from "../redux/reducers/miscReducer";
import FileMenu from "./FileMenu";
import { removeNewMessageAlert } from "../redux/reducers/chatReducer";
import { TypingLoader } from "./Loader";
import { Navigate } from "react-router-dom";
import img from "../assets/social-media-sketch-vector-seamless-600nw-1660950727.webp";

const Messages = ({ chatId }: { chatId: string }) => {
	const containerRef = useRef(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const fileRef = useRef(null);

	const dispatch = useDispatch();

	dispatch(removeNewMessageAlert(chatId));

	const socket = useSocket();

	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [page, setPage] = useState(1);

	const [IamTyping, setIamTyping] = useState(false);
	const [userTyping, setUserTyping] = useState(false);

	const typingTimeout = useRef<number>();

	const { data, isLoading, isError } = useGetChatDetailsQuery({
		chatId,
		skip: !chatId,
	});
	const oldMessagesChunk = useGetMessagesQuery({
		chatId,
		page,
	});

	const members = data?.chat.members;

	const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
		containerRef,
		oldMessagesChunk.data?.totalPages as number,
		page,
		setPage,
		oldMessagesChunk.data?.messages as MessageType[]
	);

	const { user } = useSelector((state: RootState) => state.user);

	const setMessageHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);

		if (!IamTyping) {
			setIamTyping(true);

			socket!.emit(START_TYPING, { chatId, members });
		}

		if (typingTimeout.current) {
			clearTimeout(typingTimeout.current);
		}

		typingTimeout.current = setTimeout(() => {
			socket!.emit(STOP_TYPING, { chatId, members });
			setIamTyping(false);
		}, 3000);
	};

	const submitHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!message.trim()) {
			return;
		}
		socket!.emit(NEW_MESSAGE, {
			message,
			chatId,
			members: data?.chat.members,
		});

		setMessage("");
	};

	const newMessagesHandler = useCallback(
		(data: { chatId: string; message: MessageType }) => {
			if (data.chatId !== chatId) return;
			setMessages((prev) => [...prev, data.message]);
		},
		[chatId]
	);

	const startTypingListener = useCallback(
		(data: { chatId: string }) => {
			if (data.chatId !== chatId) return;
			setUserTyping(true);
		},
		[chatId]
	);

	const stopTypingListener = useCallback(
		(data: { chatId: string }) => {
			if (data.chatId !== chatId) return;
			setUserTyping(false);
		},
		[chatId]
	);

	useEffect(() => {
		socket!.on(NEW_MESSAGE, newMessagesHandler);
		socket!.on(START_TYPING, startTypingListener);
		socket!.on(STOP_TYPING, stopTypingListener);

		return () => {
			socket!.off(NEW_MESSAGE, newMessagesHandler);
			socket!.off(START_TYPING, startTypingListener);
			socket!.off(STOP_TYPING, stopTypingListener);
		};
	}, [socket, newMessagesHandler, startTypingListener, stopTypingListener]);

	useEffect(() => {
		return () => {
			setMessages([]);
			setPage(1);
			setOldMessages([]);
			setMessage("");
		};
	}, [chatId]);

	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	if (isError) {
		toast.error("Invalid chat id");
		return <Navigate to="/chat" />;
	}
	if (oldMessagesChunk.isError) {
		toast.error("Invalid chat id");
		return <Navigate to="/chat" />;
	}

	const allMessages = [...oldMessages, ...messages];

	return isLoading ? (
		<Skeleton height={"100%"} width={"100%"} />
	) : (
		<>
			<Stack height={"90vh"} position={"relative"}>
				<Stack
					ref={containerRef}
					boxSizing={"border-box"}
					p={"1rem"}
					spacing={"1rem"}
					height={"100%"}
					width={"100%"}
					sx={{
						overflowX: "hidden",
						overflowY: "auto",
						backgroundImage: `url(${img})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 1,
					}}
				>
					<Stack
						boxSizing={"border-box"}
						sx={{
							height: "90%",
							width: { xs: "100%", sm: "58.33%", lg: "58.33%" },
							bgcolor: "gray",
							opacity: 0.4,
							position: "fixed",
							top: 0,
							right: 0,
							zIndex: 2,
							overflowY: "auto",
						}}
					/>

					<Stack
						sx={{
							position: "relative",
							zIndex: 3,
						}}
					>
						{allMessages.map((message) => (
							<MessageComponent
								key={message._id}
								message={message}
								user={user!}
							/>
						))}

						{userTyping && <TypingLoader />}

						<div ref={bottomRef} />
					</Stack>
				</Stack>
			</Stack>

			<form
				style={{
					height: "10vh",
					backgroundColor: "white",
					zIndex: 10,
				}}
				onSubmit={submitHandler}
			>
				<Stack
					direction={"row"}
					height={"100%"}
					p={"1rem"}
					alignItems={"center"}
					position={"relative"}
					bgcolor={"white"}
				>
					<IconButton
						sx={{ rotate: "30deg", position: "absolute", left: "1.5rem" }}
						ref={fileRef}
						onClick={() => dispatch(setFileMenu(true))}
					>
						<AttachFileIcon />
					</IconButton>

					<InputBox
						placeholder="Message"
						value={message}
						onChange={setMessageHandler}
					/>

					<IconButton
						type="submit"
						sx={{
							backgroundColor: "#ea7070",
							color: "white",
							marginLeft: "1rem",
							padding: "0.5rem",
							"&:hover": {
								backgroundColor: "error.dark",
							},
							position: "absolute",
							right: "1.3rem",
						}}
					>
						<SendIcon />
					</IconButton>
				</Stack>
			</form>
			<FileMenu anchorEl={fileRef.current!} chatId={chatId} />
		</>
	);
};

export default Messages;
