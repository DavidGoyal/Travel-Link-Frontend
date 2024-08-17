import {
	Avatar,
	Box,
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import moment from "moment";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import img3 from "../assets/Places-to-visit-in-south-India-for-a-thrilling-excursion-15.jpg";
import img2 from "../assets/Screenshot 2024-08-02 061544.png";
import {
	useAcceptRequestMutation,
	useGetFriendRequestsQuery,
	useGetRecentActivitesQuery,
	usePopularTravellersQuery,
	useUpdateTravellerStatusMutation,
} from "../redux/api/api";
import { RootState } from "../redux/store";
import { ErrorResponse } from "../types/apiTypes";
import Search from "@mui/icons-material/Search";
import { calculateAge } from "../lib/features";
import MenuIcon from "@mui/icons-material/Menu";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import { City, Country, State } from "country-state-city";

const ExploreComponent = () => {
	const { data, isLoading, isError } = useGetFriendRequestsQuery();
	const {
		data: recentActivityData,
		isLoading: recentActivityDataLoading,
		isError: recentActivityDataError,
	} = useGetRecentActivitesQuery();
	const {
		data: popular,
		isLoading: popularLoading,
		isError: popularError,
	} = usePopularTravellersQuery();
	const [updateTravelStatus] = useUpdateTravellerStatusMutation();
	const [acceptFriendRequest] = useAcceptRequestMutation();

	const { user } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	const [destination, setDestination] = useState(
		user?.destination?.charAt(0).toUpperCase() +
			(user?.destination?.slice(1) as string) || ""
	);
	const [country, setCountry] = useState("IN");
	const [state, setState] = useState("DL");
	const [date, setDate] = useState(user?.date?.split("T")[0]);
	const [loading, setIsLoading] = useState(false);
	const [friend, setFriendLoading] = useState(false);

	if (isError) {
		return toast.error("Something went wrong");
	}
	if (recentActivityDataError) {
		return toast.error("Something went wrong");
	}
	if (popularError) {
		return toast.error("Something went wrong");
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setIsLoading(true);
		const id = toast.loading("Updating Status");

		try {
			const res = await updateTravelStatus({
				destination,
				date,
				explore: true,
			});

			if ("data" in res) {
				toast.success(res.data!.message, { id });
				setDestination("");
				setDate("");
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
			setIsLoading(false);
		}
	};

	const addFriend = async (requestId: string) => {
		setFriendLoading(true);
		const id = toast.loading("Accepting...");

		try {
			const res = await acceptFriendRequest({
				requestId,
				accept: true,
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
			minHeight={"100vh"}
			width={"100%"}
			padding={"2rem"}
			gap={"2rem"}
			position={"relative"}
		>
			<IconButton
				sx={{
					position: "absolute",
					top: 4,
					left: 2,
					display: { xs: "black", lg: "none" },
				}}
				onClick={() => dispatch(setIsDrawerOpen(true))}
			>
				<MenuIcon />
			</IconButton>
			<Stack
				bgcolor={"white"}
				height={"23rem"}
				width={"100%"}
				mt="2rem"
				borderRadius={"5px"}
				padding={"2rem"}
				gap={"1rem"}
			>
				<Typography variant="h5" width={"100%"}>
					Popular Travellers
				</Typography>

				<Stack
					direction={"row"}
					sx={{
						height: "90%",
						overflowX: "auto",
						width: "100%",
						justifyContent: "center",
						flexWrap: "wrap",
						boxSizing: "unset",
					}}
					gap={"2rem"}
				>
					{popularLoading ? (
						Array.from({ length: 5 }, () => (
							<Skeleton height={"100%"} width="170px" />
						))
					) : popular?.users.length === 0 ? (
						<Stack
							height={"100%"}
							justifyContent={"center"}
							alignItems={"center"}
							gap={"1rem"}
						>
							<Search sx={{ fontSize: "2rem" }} />
							<Typography fontSize={"1.5rem"}>No Popular Users</Typography>
						</Stack>
					) : (
						popular?.users.map((user) => (
							<Stack height={"100%"} gap={"1rem"}>
								<Stack
									sx={{
										height: "80%",
									}}
								>
									<img
										src={user.avatar.url}
										style={{
											height: "100%",
											width: "170px",
											objectFit: "cover",
											borderRadius: "3px",
										}}
									/>
								</Stack>
								<Typography textAlign={"center"}>
									{user.name.split(" ")[0]}, {calculateAge(user.dob)}
								</Typography>
							</Stack>
						))
					)}
				</Stack>
			</Stack>

			<Stack
				direction={"row"}
				gap={"2rem"}
				width={"100%"}
				flexWrap={"wrap"}
				justifyContent={"center"}
			>
				<Stack
					bgcolor={"white"}
					height={"280px"}
					width={"280px"}
					borderRadius={"5px"}
					padding={"1rem"}
					gap={"1rem"}
				>
					<Typography fontWeight={550}>You may like</Typography>
					<Stack width={"100%"} gap={"1.4rem"}>
						<Stack direction={"row"} gap={"1rem"}>
							<Avatar
								src={img2}
								sx={{
									borderRadius: 0,
									height: "5rem",
									width: "60%",
								}}
							/>
							<Stack justifyContent={"center"}>
								<Typography fontWeight={530}>Munnar</Typography>
								<Typography fontWeight={530}>Kerala</Typography>
							</Stack>
						</Stack>

						<Typography border={"1px solid gray"} />

						<Stack direction={"row"} gap={"1rem"}>
							<Avatar
								src={img3}
								sx={{
									borderRadius: 0,
									height: "5rem",
									width: "60%",
								}}
							/>
							<Stack justifyContent={"center"}>
								<Typography fontWeight={530}>Coimbatore</Typography>
								<Typography fontWeight={530}>Tamil Nadu</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				{isLoading ? (
					<Skeleton
						sx={{
							height: "280px",
							width: "280px",
							borderRadius: "5px",
							padding: "1rem",
						}}
					/>
				) : (
					<Stack
						bgcolor={"white"}
						height={"280px"}
						width={"280px"}
						borderRadius={"5px"}
						padding={"1rem"}
						gap={"1rem"}
					>
						<Typography fontWeight={550}>Friend request</Typography>
						<Stack gap={"1rem"} sx={{ overflowY: "auto" }}>
							{data?.requests.length === 0 ? (
								<Typography textAlign={"center"}>No Friend Requests</Typography>
							) : (
								data?.requests.map((request) => (
									<>
										<Stack direction={"row"} gap={"1rem"} alignItems={"center"}>
											<Avatar
												src={request.sender.avatar.url}
												sx={{ borderRadius: 0 }}
											/>
											<Stack flexGrow={1}>
												<Typography>
													{request.sender.name.split(" ")[0]}
												</Typography>
												<Typography>
													{calculateAge(request.sender.dob)}
												</Typography>
											</Stack>
											<Stack>
												<Button
													variant="contained"
													sx={{
														color: "tomato",
														bgcolor: "pink",
														":hover": { bgcolor: "pink" },
													}}
													onClick={() => addFriend(request._id)}
													disabled={friend}
												>
													Accept
												</Button>
											</Stack>
										</Stack>

										<Typography border={"1px solid gray"} />
									</>
								))
							)}
						</Stack>
					</Stack>
				)}
				{recentActivityDataLoading ? (
					<Skeleton sx={{ height: "280px", width: "280px", padding: "1rem" }} />
				) : (
					<Stack
						bgcolor={"white"}
						height={"280px"}
						width={"280px"}
						borderRadius={"5px"}
						padding={"1rem"}
						gap={"1rem"}
					>
						<Typography fontWeight={550}>Recent Activity</Typography>
						<Stack
							gap={"0.4rem"}
							sx={{ overflowY: { xs: "auto", sm: "hidden" } }}
						>
							{recentActivityData?.requests.length === 0 ? (
								<Typography textAlign={"center"}>No Recent Activity</Typography>
							) : (
								recentActivityData?.requests.map((request) => (
									<ActivityCard
										content={
											request.requestType === "friend"
												? `Friend request to ${
														request.receiver.name.split(" ")[0]
												  }`
												: request.requestType === "upvote"
												? `Upvoted ${
														request.receiver.name.split(" ")[0]
												  }'s profile`
												: request.requestType === "accept"
												? `Accepted ${
														request.receiver.name.split(" ")[0]
												  }'s friend request`
												: `Rejected ${
														request.receiver.name.split(" ")[0]
												  }'s friend request`
										}
										createdAt={request.createdAt}
										avatar={request.receiver.avatar.url}
									/>
								))
							)}
						</Stack>
					</Stack>
				)}
				<Stack
					bgcolor={"white"}
					height={"280px"}
					width={"280px"}
					borderRadius={"5px"}
					padding={"1rem"}
					gap={"1rem"}
				>
					<Typography fontWeight={550}>Start Looking For Traveller</Typography>
					<Stack sx={{ overflowY: "auto" }}>
						<form onSubmit={handleSubmit}>
							<Box sx={{ marginY: "0.6rem" }}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Country</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={country}
										label="Country"
										onChange={(e) => setCountry(e.target.value)}
									>
										{Country.getAllCountries().map((country) => (
											<MenuItem value={country.isoCode}>
												{country.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>

							<Box sx={{ marginY: "0.6rem" }}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select">State</InputLabel>
									<Select
										labelId="demo-simple-select"
										id="demo-simple-select"
										value={state}
										label="State"
										onChange={(e) => setState(e.target.value)}
									>
										{State.getStatesOfCountry(country).map((state) => (
											<MenuItem value={state.isoCode}>{state.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>

							<Box sx={{ marginTop: "0.6rem" }}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple">City</InputLabel>
									<Select
										labelId="demo-simple"
										id="demo-simple-select"
										value={destination}
										label="City"
										onChange={(e) => setDestination(e.target.value)}
									>
										{City.getCitiesOfState(country, state)!.map((city) => (
											<MenuItem value={city.name}>{city.name}</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
							<TextField
								required={true}
								fullWidth
								type="date"
								label="Travel Date"
								placeholder="Travel Date"
								margin="normal"
								variant="outlined"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								InputLabelProps={{
									shrink: true,
								}}
							/>
							<Button
								variant="contained"
								type="submit"
								color="error"
								fullWidth
								disabled={loading}
							>
								Update
							</Button>
						</form>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

const ActivityCard = ({
	content,
	createdAt,
	avatar,
}: {
	content: string;
	createdAt: string;
	avatar: string;
}) => {
	const timeAgo = moment(createdAt).fromNow();
	return (
		<Stack direction={"row"} gap={"1rem"} alignItems={"center"} width={"100%"}>
			<Avatar src={avatar} sx={{ borderRadius: 0 }} />
			<Stack flexGrow={1}>
				<Typography>{content}</Typography>
				<Typography>{timeAgo}</Typography>
			</Stack>
		</Stack>
	);
};

export default ExploreComponent;
