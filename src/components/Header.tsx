import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ExploreIcon from "@mui/icons-material/Explore";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Person2Icon from "@mui/icons-material/Person2";
import SearchIcon from "@mui/icons-material/Search";
import {
	Avatar,
	Badge,
	Button,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
	useGetUnreadCountQuery,
	useLazyLogoutUserQuery,
} from "../redux/api/api";
import { setUser } from "../redux/reducers/userReducer";
import { RootState } from "../redux/store";
import { ErrorResponse } from "../types/apiTypes";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";

const Header = () => {
	const { user } = useSelector((state: RootState) => state.user);
	const { newMessagesAlert } = useSelector((state: RootState) => state.chat);
	const [logout] = useLazyLogoutUserQuery();
	const { data, isLoading, isError } = useGetUnreadCountQuery();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loading, setIsLoading] = useState(false);

	const logoutHandler = async () => {
		setIsLoading(true);
		const id = toast.loading("Logging Out");
		dispatch(setIsDrawerOpen(false));

		try {
			const res = await logout();

			if ("data" in res) {
				toast.success(res.data!.message, { id });
				dispatch(setUser(null));
				navigate("/");
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = error.data as ErrorResponse;
				toast.error(message.message || "Something Went Wrong", { id });
			}
		} catch (error) {
			toast.error("Something went wrong!", {
				id,
			});
		}
		setIsLoading(false);
	};

	if (isError) {
		return toast.error("Something went wrong");
	}
	return (
		<Stack height={"100%"} width={"100%"} direction={"column"} gap={"1rem"}>
			<Stack
				padding={"1rem"}
				gap={"1rem"}
				width={"100%"}
				height={"25%"}
				borderBottom={"1px solid gray"}
			>
				<Typography variant="h4" alignSelf={"center"} fontWeight={"700"}>
					Travel Link
				</Typography>

				<Stack alignSelf={"center"} alignItems={"center"}>
					<Avatar
						src={user?.avatar.url}
						sx={{ height: "3rem", width: "3rem" }}
					/>
					<Typography fontWeight={600}>{user?.name}</Typography>
					<Link
						to={"/profile"}
						style={{ textDecoration: "none" }}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						<Typography sx={{ color: "gray", fontSize: "0.7rem" }}>
							Edit Profile
						</Typography>
					</Link>
				</Stack>
			</Stack>

			<Stack padding={"1rem"} width={"100%"} height={"75%"}>
				<Stack gap={"1.2rem"} flexGrow={1}>
					<Link
						to={"/explore"}
						style={{
							textDecoration: "none",
							color:
								window.location.pathname === "/explore" ? "tomato" : "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						<ExploreIcon />
						<Typography>Explore</Typography>
					</Link>
					<Link
						to={"/search"}
						style={{
							textDecoration: "none",
							color: window.location.pathname === "/search" ? "tomato" : "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						<SearchIcon />
						<Typography>Search</Typography>
					</Link>
					<Link
						to={"/chat"}
						style={{
							textDecoration: "none",
							color: window.location.pathname.startsWith("/chat")
								? "tomato"
								: "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						<Stack sx={{ position: "relative" }}>
							<ChatBubbleIcon />
							{newMessagesAlert.length > 1 && (
								<Badge
									sx={{
										position: "absolute",
										right: 0,
										top: 0,
										color: "black",
										transform: "translate(40%,-45%)",
										bgcolor: "tomato",
										borderRadius: "100%",
										height: "1.2rem",
										width: "1.2rem",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									{newMessagesAlert?.length - 1}
								</Badge>
							)}
						</Stack>
						<Typography>Chat</Typography>
					</Link>
					<Link
						to={"/notifications"}
						style={{
							textDecoration: "none",
							color:
								window.location.pathname === "/notifications"
									? "tomato"
									: "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						{isLoading ? (
							<Skeleton sx={{ height: "1.2rem", width: "1.2rem" }} />
						) : (
							<Stack sx={{ position: "relative" }}>
								<NotificationsActiveIcon />
								{(data?.unreadNotifications as number) > 0 && (
									<Badge
										sx={{
											position: "absolute",
											right: 0,
											top: 0,
											color: "black",
											transform: "translate(40%,-45%)",
											bgcolor: "tomato",
											borderRadius: "100%",
											height: "1.2rem",
											width: "1.2rem",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{data?.unreadNotifications}
									</Badge>
								)}
							</Stack>
						)}
						<Typography>Notifications</Typography>
					</Link>
					<Link
						to={"/profile"}
						style={{
							textDecoration: "none",
							color:
								window.location.pathname === "/profile" ? "tomato" : "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						<Person2Icon />
						<Typography>Profile</Typography>
					</Link>
				</Stack>

				<Stack gap={"1.2rem"}>
					<Link
						to={"/guide"}
						style={{
							textDecoration: "none",
							color: window.location.pathname === "/guide" ? "tomato" : "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
						onClick={() => dispatch(setIsDrawerOpen(false))}
					>
						<InfoIcon />
						<Typography textTransform={"initial"}>User Guide</Typography>
					</Link>
					<Button
						sx={{
							color: "gray",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
							justifyContent: "flex-start",
							padding: 0,
							margin: 0,
						}}
						disabled={loading}
						onClick={logoutHandler}
					>
						<LogoutIcon />
						<Typography textTransform={"initial"}>Logout</Typography>
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Header;
