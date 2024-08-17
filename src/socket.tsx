import io, { Socket } from "socket.io-client";
import { server } from "./constants/constants";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from "react";
import { addNewMessageAlert } from "./redux/reducers/chatReducer";
import { NEW_MESSAGE_ALERT } from "./constants/events";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { getOrSaveFromStorage } from "./lib/features";

type SocketContextType = Socket | undefined;

const SocketContext = createContext<SocketContextType>(undefined);

export const useSocket = (): Socket | undefined => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const socket = useMemo(() => io(`${server}`, { withCredentials: true }), []);

	const dispatch = useDispatch();
	const { newMessagesAlert } = useSelector((state: RootState) => state.chat);

	const newMessagesAlertHandler = useCallback(
		(data: { chatId: string }) => {
			dispatch(addNewMessageAlert(data.chatId));
		},
		[dispatch]
	);

	useEffect(() => {
		socket.on(NEW_MESSAGE_ALERT, newMessagesAlertHandler);

		return () => {
			socket.off(NEW_MESSAGE_ALERT, newMessagesAlertHandler);
		};
	}, [socket, newMessagesAlertHandler]);

	useEffect(() => {
		if (newMessagesAlert && newMessagesAlert[0]?.chatId) {
			getOrSaveFromStorage({
				key: NEW_MESSAGE_ALERT,
				value: newMessagesAlert,
				get: false,
			});
		}
	}, [newMessagesAlert]);

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};
