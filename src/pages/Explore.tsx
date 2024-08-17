import { Drawer, Grid } from "@mui/material";
import Header from "../components/Header";
import ExploreComponent from "../components/ExploreComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import SEO from "../components/Seo";

const Explore = () => {
	const { isDrawerOpen } = useSelector((state: RootState) => state.misc);
	const dispatch = useDispatch();
	return (
		<>
			<SEO
				title="Explore Travel Partners and Destinations | Travel Link"
				description="Explore Travel Link to discover travel partners, exciting destinations, and upcoming trips. Browse profiles, find like-minded adventurers, and plan your next journey. Dive into the world of travel opportunities and make new connections with Travel Link."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Grid container height={"100vh"} width={"100vw"}>
				<Grid
					item
					height={"100%"}
					xs={0}
					lg={2}
					sx={{ display: { xs: "none", lg: "block" } }}
				>
					<Header />
				</Grid>
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
					xs={12}
					lg={10}
					bgcolor={"whitesmoke"}
					sx={{ overflowY: "auto" }}
				>
					<ExploreComponent />
				</Grid>
			</Grid>
		</>
	);
};

export default Explore;
