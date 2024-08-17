import { Button, Stack, Typography } from "@mui/material";
import img from "../assets/Screenshot 2024-08-17 151515.png";
import img1 from "../assets/Screenshot 2024-08-17 153032.png";
import img2 from "../assets/Screenshot 2024-08-17 154033.png";
import img3 from "../assets/Screenshot 2024-08-17 154102.png";
import img4 from "../assets/Screenshot 2024-08-17 155259.png";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SEO from "../components/Seo";

const HowItWorks = () => {
	const navigate = useNavigate();
	return (
		<>
			<SEO
				title="User Guide - How to Use Travel Link | Travel Link"
				description="Get started with Travel Link using our comprehensive user guide. Learn how to connect with travel partners, explore destinations, manage your profile, and make the most of our features. Follow our step-by-step instructions and tips to enhance your travel experience with Travel Link."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Stack
				width={"100vw"}
				height={{ xs: "140vh", md: "100vh" }}
				padding={"2rem"}
				gap={"4rem"}
				position={"relative"}
				zIndex={10}
			>
				<Stack
					width={"100vw"}
					height={"100%"}
					bgcolor={"whitesmoke"}
					sx={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
				/>
				<Button
					variant="contained"
					sx={{ position: "absolute", top: "2rem", left: "1.5rem" }}
					onClick={() => navigate("/")}
				>
					<KeyboardBackspaceIcon />
				</Button>
				<Typography
					textAlign={"center"}
					variant="h4"
					mt={{ xs: "3rem", sm: 0 }}
				>
					How to get started
				</Typography>

				<Stack
					direction={"row"}
					flexWrap={"wrap"}
					gap={"4rem"}
					height={"88%"}
					width={"100%"}
					justifyContent={"center"}
				>
					<Stack
						gap={"1rem"}
						sx={{ height: "40%", width: { xs: "100%", md: "30%" } }}
					>
						<Typography textAlign={"center"}>
							1. Create your account and then sign in.
						</Typography>
						<img
							src={img4}
							alt="avatar"
							style={{ height: "84%", width: "100%", objectFit: "contain" }}
						/>
					</Stack>
					<Stack
						gap={{ md: "0rem", lg: "1rem" }}
						sx={{ height: "40%", width: { xs: "100%", md: "30%" } }}
					>
						<Typography textAlign={"center"}>
							2. Update your travelling status on profile page.
						</Typography>
						<img
							src={img}
							alt="avatar"
							style={{ height: "84%", width: "100%", objectFit: "contain" }}
						/>
					</Stack>
					<Stack
						gap={"1rem"}
						sx={{ height: "40%", width: { xs: "100%", md: "30%" } }}
					>
						<Typography textAlign={"center"}>
							3. Start searching for travellers on search page.
						</Typography>
						<img
							src={img1}
							alt="avatar"
							style={{ height: "84%", width: "100%", objectFit: "contain" }}
						/>
					</Stack>
					<Stack
						gap={"2rem"}
						sx={{ height: "40%", width: { xs: "100%", md: "30%" } }}
					>
						<Typography textAlign={"center"}>
							4. Click on traveller's profile and send friend request.
						</Typography>
						<img
							src={img2}
							alt="avatar"
							style={{ height: "84%", width: "100%", objectFit: "contain" }}
						/>
					</Stack>
					<Stack
						gap={"1rem"}
						sx={{ height: "40%", width: { xs: "100%", md: "30%" } }}
					>
						<Typography textAlign={"center"}>
							5. Wail till the traveller accepts your request and then start
							chatting.
						</Typography>
						<img
							src={img3}
							alt="avatar"
							style={{ height: "84%", width: "100%", objectFit: "contain" }}
						/>
					</Stack>
				</Stack>
			</Stack>
		</>
	);
};

export default HowItWorks;
