import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	const handleGoHome = () => {
		navigate("/");
	};

	return (
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
	);
};

export default NotFound;
