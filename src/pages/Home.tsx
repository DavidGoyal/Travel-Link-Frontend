import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import img from "../assets/Screenshot 2024-08-17 151515.png";
import img2 from "../assets/image.png";
import img1 from "../assets/image1.png";
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
					alignItems: "center",
				}}
			>
				<Stack
					minHeight={"4rem"}
					width={{ xs: "90%", sm: "80%" }}
					direction={"row"}
					alignItems={"center"}
					justifyContent={"space-between"}
					borderBottom={"1px solid #A8A8A8"}
				>
					<Typography variant="h4" fontWeight={"bold"}>
						Travel Link
					</Typography>

					<Button variant="contained" sx={{ borderRadius: "20px" }}>
						Sign Up
					</Button>
				</Stack>
				<Stack
					width={"90%"}
					alignItems={"center"}
					direction={"column"}
					justifyContent={"center"}
					gap={"4rem"}
					py={"4rem"}
				>
					<Stack width={"100%"} alignItems={"center"} gap={"1rem"}>
						<Typography
							fontSize={"3rem"}
							fontWeight={"bold"}
							lineHeight={"1.2"}
							textAlign={"center"}
						>
							Find the perfect partner to travel!
						</Typography>
						<Typography textAlign={"center"}>
							Connect with Fellow Travellers and Plan Your Personalized
							Adventures Together.
						</Typography>
						<Stack
							direction={"row"}
							mt={"1rem"}
							gap={"1rem"}
							alignSelf={"center"}
						>
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

					<Stack width={{ xs: "100%", md: "80%" }} height={"70%"}>
						<img
							src={img}
							alt="background"
							width={"100%"}
							height={"100%"}
							style={{
								borderTopLeftRadius: "20px",
								borderTopRightRadius: "20px",
							}}
						/>
					</Stack>
				</Stack>
				<Typography border={"1px solid #A8A8A8"} width={"100%"} mt={"1rem"} />

				<Stack
					width={{ xs: "90%", md: "80%" }}
					alignItems={"center"}
					gap={"4rem"}
					py={"4rem"}
				>
					<Stack
						direction={{ xs: "column", md: "row" }}
						width={"100%"}
						justifyContent={"space-between"}
						alignItems={"center"}
						gap={"2rem"}
					>
						<Typography
							width={{ xs: "100%", md: "40%" }}
							fontSize={"2rem"}
							fontWeight={"bold"}
						>
							Why you'll love travelling using Travel Link
						</Typography>
						<Typography width={{ xs: "100%", md: "30%" }}>
							Find your partner very easily by just sending them a friend
							request and then planning trips together.
						</Typography>
					</Stack>

					<Stack
						direction={{ xs: "column", md: "row" }}
						width={"100%"}
						justifyContent={"space-between"}
						overflow={"hidden"}
						gap={"2rem"}
					>
						<Stack
							height={"70vh"}
							bgcolor={"#FFF0BF"}
							width={{ xs: "100%", md: "40%" }}
							borderRadius={"20px"}
							alignItems={"center"}
							p={"1rem"}
						>
							<h3>Find Travellers Easily</h3>
							<img
								src={img1}
								alt="background"
								width={"70%"}
								height={"90%"}
								style={{ borderRadius: "20px" }}
							/>
						</Stack>

						<Stack
							height={"70vh"}
							bgcolor={"#FFF0BF"}
							width={{ xs: "100%", md: "40%" }}
							borderRadius={"20px"}
							alignItems={"center"}
							p={"1rem"}
						>
							<h3>Send Friend Requests Realtime</h3>
							<img
								src={img2}
								alt="background"
								width={"70%"}
								height={"90%"}
								style={{ borderRadius: "20px" }}
							/>
						</Stack>
					</Stack>
				</Stack>

				<Stack
					width={"100%"}
					p={"2rem"}
					direction={{ xs: "column", sm: "row" }}
					justifyContent={"center"}
					alignItems={"center"}
					gap={{ xs: "2rem", sm: "4rem" }}
					bgcolor={"whitesmoke"}
				>
					<Typography>© 2024 Travel Link. All rights reserved.</Typography>

					<a
						href="mailto:goyaldavid55@gmail.com"
						style={{ textDecoration: "none", color: "black" }}
					>
						Contact Us
					</a>
				</Stack>
			</Stack>
		</>
	);
};

export default Home;
