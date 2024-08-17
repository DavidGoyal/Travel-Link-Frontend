import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import {
	useGetProfileQuery,
	useHasUpvotedProfileQuery,
	useSendFriendRequestMutation,
	useUpvoteProfileMutation,
} from "../redux/api/api";
import { ErrorResponse } from "../types/apiTypes";
import Loader from "./Loader";
import { calculateAge } from "../lib/features";
import SEO from "./Seo";

const SearchProfileComponent = () => {
	const [loading, setIsLoading] = useState(false);
	const [upvoteLoading, setUpvoteLoading] = useState(false);
	const params = useParams();

	const { data, isLoading, isError } = useGetProfileQuery({ id: params.id! });
	const [sendFriendRequest] = useSendFriendRequestMutation();
	const {
		data: upvoted,
		isLoading: upvotedLoading,
		isError: upvotedError,
	} = useHasUpvotedProfileQuery({ id: params.id! });
	const [upvoteProfile] = useUpvoteProfileMutation();

	if (isError) {
		toast.error("Invalid User Id");
		return <Navigate to={"/search"} />;
	}

	if (upvotedError) {
		toast.error("Invalid User Id");
		return <Navigate to={"/search"} />;
	}

	const submitHandler = async () => {
		setIsLoading(true);
		const id = toast.loading("Sending Friend Request...");

		try {
			const res = await sendFriendRequest({
				receiver: params.id!,
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
		}
		setIsLoading(false);
	};

	const upvotePerson = async () => {
		setUpvoteLoading(true);
		const id = toast.loading("Upvoting...");

		try {
			const res = await upvoteProfile({
				id: params.id!,
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
		}
		setUpvoteLoading(false);
	};

	return isLoading ? (
		<Loader />
	) : (
		<>
			<SEO
				title={`${data?.user?.name} - Travel Partner Profile | Travel Link}`}
				description={`Explore the profile of ${data?.user?.name} on Travel Link. Learn about their travel interests, past adventures, and upcoming trips. Connect with them to find potential travel partners and join in their exciting journeys. Discover more about ${data?.user?.name} and enhance your travel experience with Travel Link.`}
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Stack
				width={"100%"}
				height={"100%"}
				direction={{ xs: "column", md: "row" }}
				padding={"2rem"}
				gap={"2rem"}
			>
				<Stack
					height={{ xs: "50%", md: "100%" }}
					width={{ xs: "100%", md: "50%" }}
					gap={"1rem"}
				>
					<img
						src={data?.user?.avatar.url}
						style={{
							height: "90%",
							width: "100%",
							borderRadius: "10px",
							objectFit: "cover",
							marginTop: "1rem",
						}}
					/>

					<Button
						variant="contained"
						sx={{
							color: "white",
							bgcolor: "tomato",
							":hover": { bgcolor: "red" },
							padding: "1rem",
						}}
						onClick={submitHandler}
						disabled={loading}
					>
						<PersonAddIcon sx={{ mr: "0.5rem" }} /> Send Friend Request
					</Button>
				</Stack>
				<Stack
					height={{ xs: "50%", md: "100%" }}
					width={{ xs: "100%", md: "50%" }}
					padding={"1rem"}
					gap={"1.9rem"}
				>
					<Stack direction={"row"} width={"100%"} alignItems={"center"}>
						<Typography flexGrow={1}>
							<b style={{ fontSize: "1.5rem" }}>{data?.user?.name}</b>
						</Typography>
						<Stack direction={"row"}>
							<LocationOnOutlinedIcon sx={{ color: "tomato" }} />
							<Typography>
								{data?.user?.city.charAt(0).toUpperCase() +
									(data?.user?.city.slice(1) as string)}
							</Typography>
						</Stack>
					</Stack>

					<Typography>{`"${data?.user?.bio}"`}</Typography>

					<Typography
						sx={{
							bgcolor: "white",
							borderRadius: "20px",
							padding: "0.7rem",
							width: "fit-content",
						}}
					>
						Sex: <b>{data?.user?.sex === "male" ? "Male" : "Female"}</b>
					</Typography>

					<Typography
						sx={{
							bgcolor: "white",
							borderRadius: "20px",
							padding: "0.7rem",
							width: "fit-content",
						}}
					>
						Age: <b>{calculateAge(data?.user?.dob as Date)}</b>
					</Typography>

					<Typography
						sx={{
							bgcolor: "white",
							borderRadius: "20px",
							padding: "0.7rem",
							width: "fit-content",
						}}
					>
						Smoking: <b>{data?.user?.smoking ? "Yes" : "No"}</b>
					</Typography>

					<Typography
						sx={{
							bgcolor: "white",
							borderRadius: "20px",
							padding: "0.7rem",
							width: "fit-content",
						}}
					>
						Alcohol: <b>{data?.user?.alcohol ? "Yes" : "No"}</b>
					</Typography>

					<Typography
						sx={{
							bgcolor: "white",
							borderRadius: "20px",
							padding: "0.7rem",
							width: "fit-content",
						}}
					>
						Destination:{" "}
						<b>
							{data?.user?.destination?.charAt(0).toUpperCase() +
								(data?.user?.destination?.slice(1) as string)}
						</b>
					</Typography>

					<Typography
						sx={{
							bgcolor: "white",
							borderRadius: "20px",
							padding: "0.7rem",
							width: "fit-content",
						}}
					>
						Date:{" "}
						<b>{`${new Date(data?.user?.date as string).toDateString()}`}</b>
					</Typography>

					{upvotedLoading ? (
						<Skeleton width={"2rem"} height={"2rem"} />
					) : (
						<Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
							<Typography>Upvote the profile:</Typography>
							<IconButton onClick={upvotePerson} disabled={upvoteLoading}>
								{upvoted?.isPresent ? (
									<ThumbUpAltIcon sx={{ fontSize: "2rem", color: "black" }} />
								) : (
									<ThumbUpOffAltIcon
										sx={{ fontSize: "2rem", color: "black" }}
									/>
								)}
							</IconButton>
						</Stack>
					)}
				</Stack>
			</Stack>
		</>
	);
};

export default SearchProfileComponent;
