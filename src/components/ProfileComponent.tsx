import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Skeleton,
	Stack,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
	useMyProfileQuery,
	useUpdateTravellerStatusMutation,
} from "../redux/api/api";
import { setTravelStatus } from "../redux/reducers/miscReducer";
import { RootState } from "../redux/store";
import { ErrorResponse } from "../types/apiTypes";
import { City, Country, State } from "country-state-city";

const ProfileComponent = () => {
	const [updateTravelStatus] = useUpdateTravellerStatusMutation();
	const dispatch = useDispatch();
	const { isTravelStatusOpen } = useSelector((state: RootState) => state.misc);

	const { data, isLoading, isError } = useMyProfileQuery();

	const [country, setCountry] = useState("IN");
	const [state, setState] = useState("DL");
	const [destination, setDestination] = useState(data?.user?.destination);
	const [date, setDate] = useState(data?.user?.date);
	const [loading, setIsLoading] = useState(false);

	if (isError) {
		return toast.error("Something went wrong");
	}

	const handleClose = () => {
		dispatch(setTravelStatus(false));
	};

	const handleChange = async () => {
		if (data?.user?.isLookingForTraveller === true) {
			const id = toast.loading("Updating Status");

			try {
				const res = await updateTravelStatus({});

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
		} else {
			dispatch(setTravelStatus(true));
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const id = toast.loading("Updating Status");

		try {
			const res = await updateTravelStatus({
				destination,
				date,
			});

			if ("data" in res) {
				toast.success(res.data!.message, { id });
				dispatch(setTravelStatus(false));
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

	return isLoading ? (
		<Skeleton sx={{ width: "100%", height: "100%" }} />
	) : (
		<Stack
			width={"100%"}
			height={"100%"}
			direction={{ xs: "column", md: "row" }}
			padding={"1rem"}
			gap={"2rem"}
			alignItems={"center"}
		>
			<Avatar
				src={data?.user?.avatar.url}
				sx={{
					height: { xs: "50%", md: "100%" },
					width: { xs: "80%", md: "60%" },
					alignSelf: "center",
				}}
			/>

			<Stack width={{ xs: "100%", md: "50%" }} gap={"1.9rem"}>
				<Stack
					direction={{ xs: "column", sm: "row" }}
					borderBottom={"1px solid gray"}
					padding={"1rem"}
				>
					<Typography variant="h5" flexGrow={1}>
						Name:{" "}
					</Typography>
					<Typography variant="h5">{data?.user?.name}</Typography>
				</Stack>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					borderBottom={"1px solid gray"}
					padding={"1rem"}
				>
					<Typography variant="h5" flexGrow={1}>
						Email:{" "}
					</Typography>
					<Typography variant="h5">{data?.user?.email}</Typography>
				</Stack>

				<Stack
					direction={{ xs: "column", sm: "row" }}
					borderBottom={"1px solid gray"}
					padding={"1rem"}
				>
					<Typography variant="h5" flexGrow={1}>
						Looking for traveller:{" "}
					</Typography>
					<Switch
						checked={data?.user?.isLookingForTraveller}
						onChange={handleChange}
						inputProps={{ "aria-label": "controlled" }}
						size="medium"
					/>
				</Stack>
			</Stack>

			<Dialog open={isTravelStatusOpen} onClose={handleClose}>
				<Stack height={"100%"} width={"100%"} padding={"1rem"} gap={"1rem"}>
					<DialogTitle textAlign={"center"}>Travel Data</DialogTitle>
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
										<MenuItem value={country.isoCode}>{country.name}</MenuItem>
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
			</Dialog>
		</Stack>
	);
};

export default ProfileComponent;
