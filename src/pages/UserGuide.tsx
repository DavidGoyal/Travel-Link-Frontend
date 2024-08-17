import { Drawer, Grid, IconButton } from "@mui/material";
import Header from "../components/Header";
import UserGuideComponent from "../components/UserGuideComponent";
import { RootState } from "../redux/store";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../components/Seo";

const UserGuide = () => {
	const dispatch = useDispatch();

	const { isDrawerOpen } = useSelector((state: RootState) => state.misc);
	return (
		<>
			<SEO
				title="User Guide - How to Use Travel Link | Travel Link"
				description="Get started with Travel Link using our comprehensive user guide. Learn how to connect with travel partners, explore destinations, manage your profile, and make the most of our features. Follow our step-by-step instructions and tips to enhance your travel experience with Travel Link."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Grid container height={"100vh"} width={"100vw"}>
				<IconButton
					sx={{
						display: { xs: "block", lg: "none" },
						position: "absolute",
						top: 4,
						left: 2,
					}}
					onClick={() => dispatch(setIsDrawerOpen(true))}
				>
					<MenuIcon />
				</IconButton>
				<Drawer
					open={isDrawerOpen}
					sx={{ display: { xs: "block", lg: "none" } }}
					onClose={() => dispatch(setIsDrawerOpen(false))}
				>
					<Header />
				</Drawer>
				<Grid
					item
					height={"100%"}
					xs={0}
					lg={2}
					sx={{ display: { xs: "none", lg: "block" } }}
				>
					<Header />
				</Grid>
				<Grid
					item
					minHeight={"100vh"}
					xs={12}
					lg={10}
					bgcolor={"whitesmoke"}
					sx={{ overflowY: "auto" }}
				>
					<UserGuideComponent />
				</Grid>
			</Grid>
		</>
	);
};

export default UserGuide;
