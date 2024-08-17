import { Box, CircularProgress, Stack } from "@mui/material";
import { BouncingSkeleton } from "../styles/StyledComponents";
import SEO from "./Seo";

const Loader = () => {
	return (
		<>
			<SEO
				title="Loading... | Travel Link"
				description="Please wait while Travel Link loads. Our platform is preparing to connect you with travel partners and exciting destinations. Experience seamless navigation and enhanced features as we get you to your travel adventures quickly."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress color="primary" />
			</Box>
		</>
	);
};

export const TypingLoader = () => {
	return (
		<Stack
			spacing={"0.5rem"}
			direction={"row"}
			padding={"0.5rem"}
			justifyContent={"center"}
		>
			<BouncingSkeleton
				variant="circular"
				width={15}
				height={15}
				style={{ animationDelay: "0.1s" }}
			/>
			<BouncingSkeleton
				variant="circular"
				width={15}
				height={15}
				style={{ animationDelay: "0.2s" }}
			/>
			<BouncingSkeleton
				variant="circular"
				width={15}
				height={15}
				style={{ animationDelay: "0.4s" }}
			/>
			<BouncingSkeleton
				variant="circular"
				width={15}
				height={15}
				style={{ animationDelay: "0.6s" }}
			/>
		</Stack>
	);
};

export default Loader;
