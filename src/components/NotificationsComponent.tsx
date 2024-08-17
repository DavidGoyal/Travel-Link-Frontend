import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { Avatar, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import toast from "react-hot-toast";
import {
	useAcceptRequestMutation,
	useDeleteNotificationMutation,
	useGetNotificationsQuery,
	useMarkAsReadMutation,
} from "../redux/api/api";
import { useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorResponse } from "../types/apiTypes";
import BeenhereIcon from "@mui/icons-material/Beenhere";

const NotificationsComponent = () => {
	const { data, isLoading, isError } = useGetNotificationsQuery();

	const [markRead] = useMarkAsReadMutation();

	const [loading, setIsLoading] = useState(false);

	const submitHandler = async () => {
		setIsLoading(true);
		const id = toast.loading("Marking...");

		try {
			const res = await markRead();

			if ("data" in res) {
				toast.success(res.data!.message, { id });
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
		<Stack
			height={"100%"}
			width={"100%"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			{isLoading ? (
				<Skeleton
					sx={{
						height: { xs: "100%", sm: "80%" },
						width: { xs: "100%", sm: "80%", md: "50%" },
					}}
				/>
			) : (
				<Stack
					height={{ xs: "100%", sm: "80%" }}
					bgcolor={"white"}
					width={{ xs: "100%", sm: "80%", md: "50%" }}
					sx={{ overflowY: "auto" }}
					gap={"0.5rem"}
					paddingTop={{ xs: "1rem", sm: 0 }}
				>
					<Stack
						direction={"row"}
						width={"100%"}
						justifyContent={"space-between"}
						padding={"1rem"}
						alignItems={"center"}
					>
						<Typography fontSize={"1.2rem"}>Notifications</Typography>
						<IconButton
							sx={{ gap: "0.2rem" }}
							disabled={loading}
							onClick={submitHandler}
						>
							<BeenhereIcon />
							<Typography>Mark All Read</Typography>
						</IconButton>
					</Stack>
					{data?.requests.map((notification, index) => {
						return (
							<NotificationsCard
								key={index}
								requestType={notification.requestType}
								requestId={notification._id}
								read={notification.read}
								content={
									notification.requestType === "friend"
										? `${
												notification.sender.name.split(" ")[0]
										  } sent you a friend request`
										: notification.requestType === "upvote"
										? `${
												notification.sender.name.split(" ")[0]
										  } upvoted your profile`
										: notification.requestType === "accept"
										? `${
												notification.sender.name.split(" ")[0]
										  } accepted your friend request`
										: `${
												notification.sender.name.split(" ")[0]
										  } rejected your friend request`
								}
								avatar={notification.sender.avatar.url}
								createdAt={notification.createdAt}
							/>
						);
					})}
				</Stack>
			)}
		</Stack>
	);
};

const NotificationsCard = ({
	content,
	avatar,
	createdAt,
	requestType,
	requestId,
	read,
}: {
	content: string;
	avatar: string;
	createdAt: string;
	requestType: string;
	requestId: string;
	read: boolean;
}) => {
	const timeAgo = moment(createdAt).fromNow();
	const [friend, setFriendLoading] = useState(false);

	const [acceptFriendRequest] = useAcceptRequestMutation();
	const [deleteNotification] = useDeleteNotificationMutation();

	const addFriend = async ({
		requestId,
		accept,
	}: {
		requestId: string;
		accept: boolean;
	}) => {
		setFriendLoading(true);
		const id = toast.loading("Accepting...");

		try {
			const res = await acceptFriendRequest({
				requestId,
				accept,
			});

			if ("data" in res) {
				toast.success(res.data!.message, { id });
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = error.data as ErrorResponse;
				toast.error(message.message || "Something Went Wrong", { id });
			}
		} catch (error) {
			toast.error("Something went wrong!", {
				id,
			});
		} finally {
			setFriendLoading(false);
		}
	};

	const deleteHandler = async ({ requestId }: { requestId: string }) => {
		setFriendLoading(true);
		const id = toast.loading("Accepting...");

		try {
			const res = await deleteNotification({
				id: requestId,
			});

			if ("data" in res) {
				toast.success(res.data!.message, { id });
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = error.data as ErrorResponse;
				toast.error(message.message || "Something Went Wrong", { id });
			}
		} catch (error) {
			toast.error("Something went wrong!", {
				id,
			});
		} finally {
			setFriendLoading(false);
		}
	};
	return (
		<Stack
			direction={"row"}
			gap={"1rem"}
			alignItems={"center"}
			width={"100%"}
			bgcolor={read ? "ghostwhite" : "lightgray"}
			padding={"1rem"}
			borderBottom={"0.5px solid black"}
		>
			<Avatar src={avatar} />
			<Stack flexGrow={1}>
				<Typography>
					<b>{content}</b>
				</Typography>
				<Typography>{timeAgo}</Typography>
			</Stack>
			<Stack direction={{ xs: "column", sm: "row" }}>
				{requestType === "friend" && (
					<IconButton
						onClick={() => addFriend({ requestId, accept: false })}
						disabled={friend}
					>
						<DeleteIcon sx={{ color: "tomato" }} />
					</IconButton>
				)}
				{requestType === "upvote" && (
					<IconButton
						onClick={() => deleteHandler({ requestId })}
						disabled={friend}
					>
						<DeleteIcon sx={{ color: "tomato" }} />
					</IconButton>
				)}
				{requestType === "accept" && (
					<IconButton
						onClick={() => deleteHandler({ requestId })}
						disabled={friend}
					>
						<DeleteIcon sx={{ color: "tomato" }} />
					</IconButton>
				)}
				{requestType === "reject" && (
					<IconButton
						onClick={() => deleteHandler({ requestId })}
						disabled={friend}
					>
						<DeleteIcon sx={{ color: "tomato" }} />
					</IconButton>
				)}
				{requestType === "friend" && (
					<IconButton
						onClick={() => addFriend({ requestId, accept: true })}
						disabled={friend}
					>
						<DoneIcon sx={{ color: "green" }} />
					</IconButton>
				)}
			</Stack>
		</Stack>
	);
};

export default NotificationsComponent;
