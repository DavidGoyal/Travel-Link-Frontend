import { Grid } from "@mui/material";
import Header from "../components/Header";
import SearchProfileComponent from "../components/SearchProfileComponent";

const SearchProfile = () => {
	return (
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
			<Grid
				item
				height={"100%"}
				xs={12}
				lg={10}
				bgcolor={"whitesmoke"}
				sx={{ overflowY: "auto" }}
			>
				<SearchProfileComponent />
			</Grid>
		</Grid>
	);
};

export default SearchProfile;
