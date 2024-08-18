import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SEO from "../components/Seo";

const NotFound = () => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	return (
		<>
			<SEO
				title="Page Not Found | Travel Link"
				description="Oops! The page you're looking for doesn't exist on Travel Link. It might have been moved or deleted. Return to the homepage or explore other areas of our site to find travel partners and plan your next adventure."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Box
				height={"100vh"}
				width={"100vw"}
				bgcolor={"whitesmoke"}
				sx={{ overflow: "hidden" }}
			>
				<Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
					<Typography variant="h1" component="h1" gutterBottom>
						404
					</Typography>
					<Typography variant="h5" component="h2" gutterBottom>
						Oops! The page you are looking for doesn't exist.
					</Typography>
					<Button
						variant="contained"
						color="error"
						onClick={handleGoHome}
						sx={{ mt: 4 }}
					>
						Go Back Home
					</Button>
				</Container>
			</Box>
		</>
	);
};

export default NotFound;
