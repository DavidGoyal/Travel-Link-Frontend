import { Drawer, Grid, IconButton } from "@mui/material";
import Header from "../components/Header";
import ProfileComponent from "../components/ProfileComponent";
import { RootState } from "../redux/store";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../components/Seo";

const Profile = () => {
	const dispatch = useDispatch();

	const { isDrawerOpen } = useSelector((state: RootState) => state.misc);
	const { user } = useSelector((state: RootState) => state.user);
	return (
		<>
			<SEO
				title={`${user?.name} - Travel Partner Profile | Travel Link}`}
				description={`Explore the profile of ${user?.name} on Travel Link. Learn about their travel interests, past adventures, and upcoming trips. Connect with them to find potential travel partners and join in their exciting journeys. Discover more about ${user?.name} and enhance your travel experience with Travel Link.`}
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
					height={"100%"}
					xs={12}
					lg={10}
					bgcolor={"whitesmoke"}
					sx={{ overflowY: "auto" }}
				>
					<ProfileComponent />
				</Grid>
			</Grid>
		</>
	);
};

export default Profile;
