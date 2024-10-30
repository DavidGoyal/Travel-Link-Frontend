import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import {
	Avatar,
	Dialog,
	DialogContent,
	IconButton,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
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
import {
	ANSWER,
	ICE_CANDIDATE,
	INIT_VIDEO_CALL,
	NEW_MESSAGE,
	OFFER,
	SEND_OFFER,
	START_TYPING,
	START_VIDEO_CALL,
	STOP_TYPING,
	STOP_VIDEO_CALL,
} from "../constants/events";
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
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";

const iceConfiguration: RTCConfiguration = {
	iceServers: [
		{ urls: "stun:stun.relay.metered.ca:80" },
		{
			urls: "turn:global.relay.metered.ca:80",
			username: "d490f11e657930dec32b831f",
			credential: "G7efsIWMm+8ZBttT",
		},
		{
			urls: "turn:global.relay.metered.ca:80?transport=tcp",
			username: "d490f11e657930dec32b831f",
			credential: "G7efsIWMm+8ZBttT",
		},
		{
			urls: "turn:global.relay.metered.ca:443",
			username: "d490f11e657930dec32b831f",
			credential: "G7efsIWMm+8ZBttT",
		},
		{
			urls: "turns:global.relay.metered.ca:443?transport=tcp",
			username: "d490f11e657930dec32b831f",
			credential: "G7efsIWMm+8ZBttT",
		},
	],
};

const Messages = ({
	chatId,
	onlineUsers,
}: {
	chatId: string;
	onlineUsers: string[];
}) => {
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

	const [incomingCall, setIncomingCall] = useState(false);
	const [outgoingCall, setOutgoingCall] = useState(false);
	const [videoCall, setVideoCall] = useState(false);
	const [callerName, setCallerName] = useState("");
	const outgoingVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const [localAudioTrack, setLocalAudioTrack] =
		useState<MediaStreamTrack | null>();
	const [localVideoTrack, setLocalVideoTrack] =
		useState<MediaStreamTrack | null>();
	const [localStream, setLocalStream] = useState<MediaStream | null>();
	const [remoteVideoTrack, setRemoteVideoTrack] =
		useState<MediaStreamTrack | null>();
	const [remoteAudioTrack, setRemoteAudioTrack] =
		useState<MediaStreamTrack | null>();
	const [remoteMediaStream, setRemoteMediaStream] =
		useState<MediaStream | null>();
	const [, setSendingPC] = useState<RTCPeerConnection | null>(null);
	const [, setReceivingPC] = useState<RTCPeerConnection | null>(null);

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

	const receiver = members?.filter((member) => member !== user!._id);
	const isOnline = onlineUsers?.includes(receiver?.[0] as string);

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

	const videoCallHandler = async () => {
		try {
			setOutgoingCall(true);
			const stream = await window.navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			const videoTracks = stream.getVideoTracks()[0];
			const audioTracks = stream.getAudioTracks()[0];
			setLocalStream(stream);
			setLocalAudioTrack(audioTracks);
			setLocalVideoTrack(videoTracks);
			if (outgoingVideoRef.current) {
				outgoingVideoRef.current.srcObject = new MediaStream([videoTracks]);
				outgoingVideoRef.current.play();
			}
			setCallerName(data?.chat.name as string);
			socket!.emit(START_VIDEO_CALL, { members: receiver, chatId });
		} catch {
			setOutgoingCall(false);
		}
	};

	const cutVideoCallHandler = () => {
		setOutgoingCall(false);
		setIncomingCall(false);
		setVideoCall(false);
		setCallerName("");
		localStream?.getTracks().forEach((track) => track.stop());
		remoteMediaStream?.getTracks().forEach((track) => track.stop());
		outgoingVideoRef.current!.pause();
		outgoingVideoRef.current!.srcObject = null;
		remoteVideoRef.current!.pause();
		remoteVideoRef.current!.srcObject = null;
		localAudioTrack?.stop();
		localVideoTrack?.stop();
		remoteAudioTrack?.stop();
		remoteVideoTrack?.stop();
		setLocalStream(null);
		setRemoteMediaStream(null);
		setRemoteAudioTrack(null);
		setRemoteVideoTrack(null);
		setLocalAudioTrack(null);
		setLocalVideoTrack(null);
		socket!.emit(STOP_VIDEO_CALL, { members: receiver });
	};

	const acceptVideoCallHandler = () => {
		setIncomingCall(false);
		setOutgoingCall(false);
		socket!.emit(INIT_VIDEO_CALL, { members });
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

	const startVideoCallHandler = useCallback(
		async ({ name, callChatId }: { name: string; callChatId: string }) => {
			try {
				if (callChatId !== data?.chat._id) {
					return;
				}
				setIncomingCall(true);
				const stream = await window.navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});
				const videoTracks = stream.getVideoTracks()[0];
				const audioTracks = stream.getAudioTracks()[0];
				setLocalStream(stream);
				setLocalAudioTrack(audioTracks);
				setLocalVideoTrack(videoTracks);
				if (outgoingVideoRef.current) {
					outgoingVideoRef.current.srcObject = new MediaStream([videoTracks]);
					outgoingVideoRef.current.play();
				}
				setCallerName(name);
			} catch {
				setIncomingCall(false);
			}
		},
		[data]
	);

	const stopVideoCallHandler = useCallback(() => {
		setIncomingCall(false);
		setOutgoingCall(false);
		setVideoCall(false);
		setCallerName("");
		outgoingVideoRef.current!.pause();
		outgoingVideoRef.current!.srcObject = null;
		remoteVideoRef.current!.pause();
		remoteVideoRef.current!.srcObject = null;
		localStream?.getTracks().forEach((track) => track.stop());
		remoteMediaStream?.getTracks().forEach((track) => track.stop());
		localAudioTrack?.stop();
		localVideoTrack?.stop();
		remoteAudioTrack?.stop();
		remoteVideoTrack?.stop();
		setLocalStream(null);
		setRemoteMediaStream(null);
		setRemoteAudioTrack(null);
		setRemoteVideoTrack(null);
		setLocalAudioTrack(null);
		setLocalVideoTrack(null);
	}, [
		localStream,
		remoteMediaStream,
		remoteAudioTrack,
		remoteVideoTrack,
		localAudioTrack,
		localVideoTrack,
	]);

	const sendOfferHandler = useCallback(() => {
		setIncomingCall(false);
		setOutgoingCall(false);
		setVideoCall(true);
		const pc = new RTCPeerConnection(iceConfiguration);
		setSendingPC(pc);

		pc.addTrack(localAudioTrack!);
		pc.addTrack(localVideoTrack!);

		pc.onnegotiationneeded = async () => {
			const sdp = await pc.createOffer();
			pc.setLocalDescription(sdp);
			socket!.emit(OFFER, {
				offer: sdp,
				members: receiver,
			});
		};

		pc.onicecandidate = async ({ candidate }) => {
			if (candidate) {
				socket!.emit(ICE_CANDIDATE, {
					candidate,
					members: receiver,
					type: "sender",
				});
			}
		};
	}, [localAudioTrack, localVideoTrack, socket, receiver]);

	const recieveOfferHandler = useCallback(
		async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
			const pc = new RTCPeerConnection(iceConfiguration);
			setReceivingPC(pc);

			const stream = new MediaStream();
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = stream;
			}

			setRemoteMediaStream(stream);

			pc.ontrack = (e) => {
				const { track, type } = e;
				if (type == "audio") {
					setRemoteAudioTrack(track);
					// @ts-ignore
					remoteVideoRef.current.srcObject.addTrack(track);
				} else {
					setRemoteVideoTrack(track);
					// @ts-ignore
					remoteVideoRef.current.srcObject.addTrack(track);
				}
				remoteVideoRef.current!.play();
			};

			pc.setRemoteDescription(offer);
			const answer = await pc.createAnswer();
			pc.setLocalDescription(answer);
			socket!.emit(ANSWER, {
				answer,
				members: receiver,
			});

			pc.onicecandidate = async ({ candidate }) => {
				if (candidate) {
					socket!.emit(ICE_CANDIDATE, {
						candidate,
						members: receiver,
						type: "receiver",
					});
				}
			};
			//@ts-ignore
			window.pcr = pc;
		},
		[receiver, socket]
	);

	const receiveAnswerHandler = useCallback(
		async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
			setSendingPC((pc) => {
				if (!pc) {
					return null;
				}
				pc.setRemoteDescription(answer);
				return pc;
			});
		},
		[]
	);

	const iceCandidateHandler = useCallback(
		async ({
			candidate,
			type,
		}: {
			candidate: RTCIceCandidate;
			type: "sender" | "receiver";
		}) => {
			if (type === "sender") {
				setReceivingPC((pc) => {
					if (!pc) {
						return null;
					}
					pc.addIceCandidate(candidate);
					return pc;
				});
			} else {
				setSendingPC((pc) => {
					if (!pc) {
						return null;
					}
					pc.addIceCandidate(candidate);
					return pc;
				});
			}
		},
		[]
	);

	useEffect(() => {
		socket!.on(NEW_MESSAGE, newMessagesHandler);
		socket!.on(START_TYPING, startTypingListener);
		socket!.on(STOP_TYPING, stopTypingListener);
		socket!.on(START_VIDEO_CALL, startVideoCallHandler);
		socket!.on(STOP_VIDEO_CALL, stopVideoCallHandler);
		socket!.on(SEND_OFFER, sendOfferHandler);
		socket!.on(OFFER, recieveOfferHandler);
		socket!.on(ANSWER, receiveAnswerHandler);
		socket!.on(ICE_CANDIDATE, iceCandidateHandler);

		return () => {
			socket!.off(NEW_MESSAGE, newMessagesHandler);
			socket!.off(START_TYPING, startTypingListener);
			socket!.off(STOP_TYPING, stopTypingListener);
			socket!.off(START_VIDEO_CALL, startVideoCallHandler);
			socket!.off(STOP_VIDEO_CALL, stopVideoCallHandler);
			socket!.off(SEND_OFFER, sendOfferHandler);
			socket!.off(OFFER, recieveOfferHandler);
			socket!.off(ANSWER, receiveAnswerHandler);
			socket!.off(ICE_CANDIDATE, iceCandidateHandler);
		};
	}, [
		socket,
		newMessagesHandler,
		startTypingListener,
		stopTypingListener,
		startVideoCallHandler,
		stopVideoCallHandler,
		recieveOfferHandler,
		sendOfferHandler,
		receiveAnswerHandler,
		iceCandidateHandler,
	]);

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

	useEffect(() => {
		if (outgoingCall) {
			setInterval(() => {
				setOutgoingCall(false);
				localStream?.getTracks().forEach((track) => track.stop());
			}, 30000);
		}
	}, [outgoingCall, localStream]);

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
		<div style={{ height: "100%", width: "100%" }}>
			<Dialog
				open={outgoingCall}
				sx={{
					position: "absolute",
					left: { xs: "10%", md: "30%" },
					borderRadius: "20px",
					height: "70vh",
					width: { xs: "80vw", md: "40vw" },
					boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.5)",
					padding: "0 !important",
					bgcolor: "white",
					transition: "all 0.3s ease",
					alignSelf: "center",
				}}
			>
				<DialogContent
					sx={{
						maxHeight: "100%",
						width: "100%",
						margin: "0",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						bgcolor: "#f8f9fa",
						borderRadius: "20px",
						position: "relative",
						padding: "1rem",
					}}
				>
					<Avatar
						src={data?.chat?.avatar[0] || ""}
						sx={{ width: 80, height: 80, marginBottom: 2 }}
					/>
					<Typography variant="h5" fontWeight="bold" color="black">
						{callerName}
					</Typography>
					<Typography variant="body1" color="textSecondary">
						Calling...
					</Typography>
					<video
						ref={outgoingVideoRef}
						height="50%"
						width="50%"
						style={{
							borderRadius: "15px",
							marginTop: "1rem",
							boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
						}}
					/>
					<IconButton
						sx={{
							backgroundColor: "#ea7070",
							color: "white",
							mt: "2rem",
							padding: "0.75rem",
							borderRadius: "50%",
							"&:hover": {
								backgroundColor: "error.dark",
								transform: "scale(1.1)",
								transition: "transform 0.2s ease-in-out",
							},
						}}
						onClick={cutVideoCallHandler}
					>
						<PhoneIcon sx={{ rotate: "135deg" }} />
					</IconButton>
				</DialogContent>
			</Dialog>

			<Dialog
				open={incomingCall}
				sx={{
					position: "absolute",
					left: { xs: "10%", md: "30%" },
					borderRadius: "20px",
					height: "60vh",
					width: { xs: "80vw", md: "40vw" },
					boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.5)",
					padding: "0 !important",
					bgcolor: "white",
					transition: "all 0.3s ease",
					alignSelf: "center",
					backgroundColor: "white",
				}}
			>
				<DialogContent
					sx={{
						height: { xs: "100vh", sm: "100%" },
						width: "100%",
						margin: "0",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						bgcolor: "#f8f9fa",
						position: "relative",
						padding: 0,
					}}
				>
					<video
						ref={outgoingVideoRef}
						height="100%"
						width="100%"
						style={{
							position: "relative",
							boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
						}}
					/>
					<Stack
						height="100%"
						width="100%"
						position="absolute"
						zIndex={10}
						sx={{
							justifyContent: "space-between",
							alignItems: "center",
							paddingY: { xs: "0", sm: "5rem" },
						}}
					>
						<Stack alignItems="center">
							<Typography variant="h5" fontWeight="bold" color="black">
								{callerName}
							</Typography>
							<Typography variant="body1" color="textSecondary">
								is calling you
							</Typography>
						</Stack>
						<Stack direction="row" gap="1rem">
							<IconButton
								sx={{
									backgroundColor: "#ea7070",
									color: "white",
									padding: "0.75rem",
									borderRadius: "50%",
									"&:hover": {
										backgroundColor: "error.dark",
										transform: "scale(1.1)",
										transition: "transform 0.2s ease-in-out",
									},
								}}
								onClick={cutVideoCallHandler}
							>
								<PhoneIcon sx={{ rotate: "135deg" }} />
							</IconButton>
							<IconButton
								sx={{
									backgroundColor: "green",
									color: "white",
									padding: "0.75rem",
									borderRadius: "50%",
									"&:hover": {
										backgroundColor: "darkgreen",
										transform: "scale(1.1)",
										transition: "transform 0.2s ease-in-out",
									},
								}}
								onClick={acceptVideoCallHandler}
							>
								<VideocamIcon />
							</IconButton>
						</Stack>
					</Stack>
				</DialogContent>
			</Dialog>

			<Dialog
				open={videoCall}
				sx={{
					position: "absolute",
					left: { xs: "10%", md: "30%" },
					borderRadius: "20px",
					height: "60vh",
					width: { xs: "80vw", md: "40vw" },
					boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.5)",
					padding: "0 !important",
					bgcolor: "white",
					transition: "all 0.3s ease",
					alignSelf: "center",
					backgroundColor: "white",
				}}
			>
				<DialogContent
					sx={{
						height: { xs: "100vh", sm: "100%" },
						width: "100%",
						margin: "0",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						bgcolor: "#f8f9fa",
						position: "relative",
						padding: 0,
					}}
				>
					<video
						ref={remoteVideoRef}
						height="100%"
						width="100%"
						style={{
							position: "relative",
							boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
						}}
					/>
					<Stack
						height="100%"
						width="100%"
						position="absolute"
						zIndex={10}
						sx={{
							justifyContent: "space-between",
							alignItems: "center",
							paddingY: { xs: "0", sm: "5rem" },
						}}
					>
						<Stack alignItems="center">
							<Typography variant="h5" fontWeight="bold" color="black">
								{callerName}
							</Typography>
						</Stack>

						<IconButton
							sx={{
								backgroundColor: "#ea7070",
								color: "white",
								padding: "0.75rem",
								borderRadius: "50%",
								"&:hover": {
									backgroundColor: "error.dark",
									transform: "scale(1.1)",
									transition: "transform 0.2s ease-in-out",
								},
							}}
							onClick={cutVideoCallHandler}
						>
							<PhoneIcon sx={{ rotate: "135deg" }} />
						</IconButton>
					</Stack>
				</DialogContent>
			</Dialog>

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
						sx={{ width: isOnline ? "92%" : "100%" }}
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
							right: isOnline ? "5.5rem" : "1.5rem",
						}}
					>
						<SendIcon />
					</IconButton>

					{isOnline && (
						<IconButton
							sx={{
								backgroundColor: "#ea7070",
								color: "white",
								marginLeft: "1rem",
								padding: "0.5rem",
								"&:hover": {
									backgroundColor: "error.dark",
								},
								position: "absolute",
								right: "1.5rem",
							}}
							onClick={videoCallHandler}
						>
							<VideoCallIcon />
						</IconButton>
					)}
				</Stack>
			</form>
			<FileMenu anchorEl={fileRef.current!} chatId={chatId} />
		</div>
	);
};

export default Messages;
