import { Drawer, Grid, IconButton } from "@mui/material";
import Header from "../components/Header";
import SearchComponent from "../components/SearchComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsDrawerOpen } from "../redux/reducers/miscReducer";
import MenuIcon from "@mui/icons-material/Menu";
import SEO from "../components/Seo";

const Search = () => {
	const dispatch = useDispatch();

	const { isDrawerOpen } = useSelector((state: RootState) => state.misc);
	return (
		<>
			<SEO
				title="Search for Travel Partners | Travel Link"
				description="Search on Travel Link to find travel partners that match your preferences. Use advanced filters to connect with like-minded travelers and discover trips that align with your travel goals. Start your search and embark on your next adventure with Travel Link."
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
				<Grid item height={"100%"} xs={12} lg={10} bgcolor={"whitesmoke"}>
					<SearchComponent />
				</Grid>
			</Grid>
		</>
	);
};

export default Search;