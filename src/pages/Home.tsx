import { Avatar, Button, Stack, Typography } from "@mui/material";
import img from "../assets/cute-sea-3554-x-1999-31shls7h9sn5o56o.jpg";
import img1 from "../assets/travel-logo-design.png";
import { useNavigate } from "react-router-dom";
import SEO from "../components/Seo";

const Home = () => {
	const navigate = useNavigate();
	return (
		<>
			<SEO
				title="Find Travel Partners and Connect with Fellow Travelers | Travel Link"
				description="Travel Link is your go-to platform for connecting with like-minded travelers. Discover travel partners, plan trips together, and embark on unforgettable journeys. Whether you're a solo adventurer or looking for a group, Travel Link helps you find the perfect companions for your travels."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Stack
				sx={{
					height: "100vh",
					width: "100vw",
					position: "relative",
				}}
			>
				<Stack
					sx={{
						height: "100vh",
						width: "100vw",
						backgroundImage: `url(${img})`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						position: "absolute",
						top: 0,
						left: 0,
						gap: { xs: "10rem", sm: "15rem" },
						padding: "1rem",
					}}
				>
					<Stack
						sx={{
							height: "100vh",
							width: "100vw",
							bgcolor: "black",
							opacity: 0.7,
							position: "absolute",
							top: 0,
							left: 0,
						}}
					></Stack>

					<Stack
						direction={"row"}
						width={"100%"}
						alignItems={"center"}
						sx={{ zIndex: 10 }}
					>
						<Stack
							direction={"row"}
							gap={"0.5rem"}
							alignItems={"center"}
							flexGrow={1}
						>
							<Avatar src={img1} alt="Logo" />
							<Typography
								fontSize={"2rem"}
								textTransform={"uppercase"}
								color={"white"}
							>
								Travel Link
							</Typography>
						</Stack>

						<Stack direction={"row"} gap={"1rem"}>
							<Button variant="contained" onClick={() => navigate("/login")}>
								Sign Up
							</Button>
						</Stack>
					</Stack>

					<Stack sx={{ zIndex: 10 }} width={"100%"} alignItems={"center"}>
						<Typography color={"white"} fontSize={"3rem"} textAlign={"center"}>
							FIND THE PERFECT PARTNER TO TRAVEL
						</Typography>
						<Typography color={"white"} textAlign={"center"}>
							Connect with Fellow Travellers and Plan Your Personalized
							Adventures Together.
						</Typography>
						<Stack direction={"row"} mt={"1rem"} gap={"1rem"}>
							<Button variant="contained" onClick={() => navigate("/explore")}>
								Start Finding
							</Button>
							<Button
								variant="outlined"
								onClick={() => navigate("/how-it-works")}
							>
								How It Works
							</Button>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</>
	);
};

export default Home;
