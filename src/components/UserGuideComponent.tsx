import { Stack, Typography } from "@mui/material";
import img from "../assets/Screenshot 2024-08-17 151515.png";
import img1 from "../assets/Screenshot 2024-08-17 153032.png";
import img2 from "../assets/Screenshot 2024-08-17 154033.png";
import img3 from "../assets/Screenshot 2024-08-17 154102.png";

const UserGuideComponent = () => {
	return (
		<Stack width={"100%"} height={"100%"} padding={"2rem"} gap={"4rem"}>
			<Typography textAlign={"center"} variant="h4">
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
						1. Update your travelling status on profile page.
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
						2. Start searching for travellers on search page.
					</Typography>
					<img
						src={img1}
						alt="avatar"
						style={{ height: "80%", width: "100%", objectFit: "contain" }}
					/>
				</Stack>
				<Stack
					gap={"1rem"}
					sx={{ height: "40%", width: { xs: "100%", md: "30%" } }}
				>
					<Typography textAlign={"center"}>
						3. Click on traveller's profile and send friend request.
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
						4. Wail till the traveller accepts your request and then start
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
	);
};

export default UserGuideComponent;
