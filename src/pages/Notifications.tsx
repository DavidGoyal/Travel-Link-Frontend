import { Drawer, Grid, IconButton } from "@mui/material";
import Header from "../components/Header";
import NotificationsComponent from "../components/NotificationsComponent";
import { RootState } from "../redux/store";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../components/Seo";

const Notifications = () => {
	const dispatch = useDispatch();

	const { isDrawerOpen } = useSelector((state: RootState) => state.misc);
	return (
		<>
			<SEO
				title="View Notifications and Updates | Travel Link"
				description="Stay up-to-date with your latest interactions on Travel Link. View notifications for connection requests and important updates about your travel plans. Keep track of your activity and never miss an important alert with Travel Link."
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
					<NotificationsComponent />
				</Grid>
			</Grid>
		</>
	);
};

export default Notifications;
