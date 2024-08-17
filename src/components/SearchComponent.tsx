import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
	Box,
	FormControl,
	Input,
	InputLabel,
	MenuItem,
	Select,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSearchTravellersQuery } from "../redux/api/api";
import { useSocket } from "../socket";
import { ONLINE_USERS } from "../constants/events";
import { calculateAge } from "../lib/features";

const SearchComponent = () => {
	const [age, setAge] = useState("");
	const [sex, setSex] = useState("");
	const [destination, setDestination] = useState("");

	const [online, setOnline] = useState(0);

	const socket = useSocket();

	socket!.emit(ONLINE_USERS);

	const { data, isLoading, isError } = useSearchTravellersQuery({
		age,
		sex,
		destination,
	});

	const onlineUsersListener = useCallback((data: string[]) => {
		setOnline(data.length);
	}, []);

	useEffect(() => {
		socket!.on(ONLINE_USERS, onlineUsersListener);

		return () => {
			socket!.off(ONLINE_USERS, onlineUsersListener);
		};
	}, [socket, onlineUsersListener]);

	if (isError) {
		return toast.error("Something went wrong");
	}

	return (
		<Stack width={"100%"} height={"100%"} padding={"2rem"} gap={"2rem"}>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				gap={"3rem"}
				alignItems={"center"}
			>
				<Stack flexGrow={{ xs: 0, md: 1 }}>
					<Typography>Now Online: {online}</Typography>
				</Stack>
				<Input
					placeholder="Destination"
					value={destination}
					onChange={(e) => setDestination(e.target.value)}
					sx={{
						bgcolor: "white",
						border: "none",
						padding: "0.5rem",
						borderRadius: "10px",
						outline: "none",
					}}
					disableUnderline
				/>

				<Box sx={{ minWidth: 120, bgcolor: "white" }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Age</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={age}
							label="Age"
							onChange={(e) => setAge(e.target.value)}
						>
							<MenuItem value={"100"}>All</MenuItem>
							<MenuItem value={"20"}>Less than 20</MenuItem>
							<MenuItem value={"40"}>Less than 40</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box sx={{ minWidth: 120, bgcolor: "white" }}>
					<FormControl fullWidth>
						<InputLabel id="demo-simple-select-label">Sex</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={sex}
							label="Sex"
							onChange={(e) => setSex(e.target.value)}
						>
							<MenuItem value="">All</MenuItem>
							<MenuItem value={"male"}>Male</MenuItem>
							<MenuItem value={"female"}>Female</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* <Button
					variant="contained"
					sx={{
						color: "white",
						bgcolor: "tomato",
						":hover": { bgcolor: "red" },
						height: "3rem",
					}}
				>
					Show
				</Button> */}
			</Stack>

			<Stack
				width={"100%"}
				flexWrap={"wrap"}
				gap={"1rem"}
				direction={"row"}
				sx={{ overflowY: "auto" }}
				justifyContent={"center"}
			>
				{isLoading
					? Array.from({ length: 10 }, () => (
							<Skeleton sx={{ height: "200px", width: "30%" }} />
					  ))
					: data?.users.map((user, index) => (
							<SearchCard
								key={index}
								img={user.avatar.url}
								name={user.name}
								age={calculateAge(user.dob)}
								city={
									user?.destination!.charAt(0).toUpperCase() +
									(user?.destination!.slice(1) as string)
								}
								_id={user._id}
							/>
					  ))}
			</Stack>
		</Stack>
	);
};

const SearchCard = ({
	img,
	name,
	age,
	city,
	_id,
}: {
	img: string;
	name: string;
	age: number;
	city: string;
	_id: string;
}) => {
	return (
		<Link to={`/profile/${_id}`} style={{ textDecoration: "none" }}>
			<Stack
				gap={"0.5rem"}
				padding={"0.4rem"}
				borderRadius={"5px"}
				bgcolor={"white"}
				width={"220px"}
				height={"300px"}
				alignItems={"center"}
			>
				<Stack
					sx={{
						height: "78%",
						width: "100%",
						objectFit: "cover",
						borderRadius: "10px",
						":hover": { transform: "rotate(-5deg)" },
						transition: "transform 0.6s ease-in-out",
					}}
				>
					<img
						src={img}
						alt=""
						style={{
							height: "100%",
							width: "100%",
							objectFit: "cover",
							borderRadius: "10px",
						}}
					/>
				</Stack>
				<Typography fontWeight={600} sx={{ color: "initial" }}>{`${
					name.split(" ")[0]
				}, ${age}`}</Typography>
				<Stack direction={"row"} gap={"0.2rem"}>
					<LocationOnOutlinedIcon sx={{ color: "tomato" }} />
					<Typography sx={{ color: "initial" }}>{city}</Typography>
				</Stack>
			</Stack>
		</Link>
	);
};

export default SearchComponent;
