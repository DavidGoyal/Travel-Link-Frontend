import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import {
	Avatar,
	Box,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { City, Country, State } from "country-state-city";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import img from "../assets/images.jpeg";
import SEO from "../components/Seo.tsx";
import {
	useLoginUserMutation,
	useRegisterUserMutation,
} from "../redux/api/api.ts";
import { setUser } from "../redux/reducers/userReducer.ts";
import { VisuallyHiddenInput } from "../styles/StyledComponents.tsx";
import { ErrorResponse } from "../types/apiTypes.ts";
import { Turnstile } from "@marsidev/react-turnstile";

const Login = () => {
	const [isLogin, setIsLogin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [login] = useLoginUserMutation();
	const [register] = useRegisterUserMutation();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const name = useInputValidation("");
	const email = useInputValidation("");
	const password = useStrongPassword();
	const avatar = useFileHandler("single");

	const [dob, setDob] = useState("");
	const [sex, setSex] = useState("male");
	const [smoking, setSmoking] = useState(false);
	const [alcohol, setAlcohol] = useState(false);
	const [city, setCity] = useState("");
	const [bio, setBio] = useState("");
	const [country, setCountry] = useState("IN");
	const [state, setState] = useState("DL");
	const [cloudflareToken, setCloudFlareToken] = useState("");

	const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const id = toast.loading("Signing In");

		try {
			const res = await login({
				email: email.value,
				password: password.value,
				cloudflareToken,
			});

			if ("data" in res) {
				dispatch(setUser(res.data!.user));
				toast.success(res.data!.message, { id });
				navigate("/explore");
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = error.data as ErrorResponse;
				toast.error(message.message || "Something Went Wrong", { id });
				dispatch(setUser(null));
			}
		} catch (error) {
			toast.error("Something went wrong!", {
				id,
			});
			dispatch(setUser(null));
		}
		setIsLoading(false);
		email.clear();
		password.clear();
	};

	const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const myForm = new FormData();
		myForm.set("name", name.value);
		myForm.set("email", email.value);
		myForm.set("password", password.value);
		myForm.set("photo", avatar.file!);
		myForm.set("dob", dob);
		myForm.set("sex", sex);
		myForm.set("smoking", smoking.toString());
		myForm.set("alcohol", alcohol.toString());
		myForm.set("city", city);
		myForm.set("bio", bio);

		const id = toast.loading("Registering");

		try {
			const res = await register({ formData: myForm });

			if ("data" in res) {
				toast.success(res.data!.message, { id });
				navigate(`/verify/${res.data?.user?._id}`);
			} else {
				const error = res.error as FetchBaseQueryError;
				const message = error.data as ErrorResponse;
				toast.error(message.message || "User already exists", { id });
			}
		} catch (error) {
			toast.error("Sign In Fail", {
				id,
			});
		}
		setIsLoading(false);
	};

	return (
		<>
			<SEO
				title="Login to Connect with Travel Partners | Travel Link"
				description="Login to Travel Link and start connecting with fellow travelers. Access your profile, find travel partners, and join a community of like-minded adventurers. Plan trips, share experiences, and make your travel dreams a reality with Travel Link."
				type="Travel Partner Website"
				name="Travel Link"
			/>
			<Stack
				height={"100vh"}
				justifyContent={"center"}
				width={"100vw"}
				alignItems={"flex-end"}
				sx={{
					backgroundImage: `url(${img})`,
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					overflow: "hidden",
				}}
			>
				<Container
					component={"main"}
					maxWidth="xs"
					sx={{
						height: { xs: "90vh", sm: "85vh", md: "80vh" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<Button
						variant="contained"
						sx={{ alignSelf: "flex-start" }}
						onClick={() => navigate("/")}
					>
						<KeyboardBackspaceIcon />
					</Button>
					{isLogin ? (
						<Paper
							elevation={3}
							sx={{
								padding: 4,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Typography variant="h5">Login</Typography>

							<form
								style={{ width: "100%", marginTop: "1rem" }}
								onSubmit={handleLogin}
							>
								<TextField
									required={true}
									fullWidth
									type="email"
									label="Email"
									margin="normal"
									variant="outlined"
									value={email.value}
									onChange={email.changeHandler}
								/>

								<TextField
									required={true}
									fullWidth
									label="Password"
									type="password"
									margin="normal"
									variant="outlined"
									value={password.value}
									onChange={password.changeHandler}
								/>

								<Turnstile
									siteKey={import.meta.env.VITE_SITE_KEY}
									onSuccess={(e) => setCloudFlareToken(e)}
								/>

								<Button
									variant="contained"
									type="submit"
									sx={{
										marginTop: "1rem",
										bgcolor: "tomato",
										":hover": { bgcolor: "red" },
									}}
									fullWidth
									disabled={isLoading}
								>
									Login
								</Button>

								<Typography textAlign={"center"} m={"1rem"}>
									OR
								</Typography>

								<Button
									variant="text"
									fullWidth
									onClick={() => setIsLogin(false)}
									disabled={isLoading}
									sx={{ color: "tomato" }}
								>
									Sign Up Instead
								</Button>
							</form>
						</Paper>
					) : (
						<Paper
							elevation={3}
							sx={{
								padding: 2,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								height: "100%",
								width: "100%",
							}}
						>
							<Typography variant="h5">Sign Up</Typography>

							<form
								style={{
									height: "100%",
									width: "100%",
									marginTop: "1rem",
								}}
								onSubmit={handleRegister}
							>
								<Stack
									sx={{ overflowY: "auto" }}
									height={{ xs: "70%", sm: "67%", lg: "65%" }}
								>
									<Stack position={"relative"} width={"5rem"} margin={"auto"}>
										<Avatar
											sx={{
												width: "5rem",
												height: "5rem",
												objectFit: "contain",
											}}
											src={avatar.preview!}
										/>
										<IconButton
											sx={{
												position: "absolute",
												bottom: "0",
												right: "0",
												color: "white",
												bgcolor: "rgba(0,0,0,0.5)",
												":hover": {
													bgColor: "rgba(0,0,0,0.7)",
												},
											}}
											component="label"
										>
											<>
												<CameraAltIcon />
												<VisuallyHiddenInput
													type="file"
													onChange={avatar.changeHandler}
												/>
											</>
										</IconButton>
									</Stack>

									{avatar.error && (
										<Typography
											width="fit-content"
											m={"1rem auto"}
											display={"block"}
											color={"error"}
											variant="caption"
										>
											{avatar.error}
										</Typography>
									)}

									<TextField
										required={true}
										fullWidth
										label="Name"
										margin="dense"
										variant="outlined"
										value={name.value}
										onChange={name.changeHandler}
									/>

									<TextField
										required={true}
										fullWidth
										label="Bio"
										margin="dense"
										variant="outlined"
										value={bio}
										onChange={(e) => setBio(e.target.value)}
									/>

									<TextField
										required={true}
										fullWidth
										label="Email"
										type="email"
										margin="dense"
										variant="outlined"
										value={email.value}
										onChange={email.changeHandler}
									/>

									{email.error && (
										<Typography color={"error"} variant="caption">
											{email.error}
										</Typography>
									)}

									<TextField
										required={true}
										fullWidth
										label="Password"
										type="password"
										margin="dense"
										variant="outlined"
										value={password.value}
										onChange={password.changeHandler}
									/>

									{password.error && (
										<Typography color={"error"} variant="caption">
											{password.error}
										</Typography>
									)}

									<TextField
										required={true}
										fullWidth
										label="Date of Birth"
										type="date"
										margin="dense"
										variant="outlined"
										value={dob}
										onChange={(e) => setDob(e.target.value)}
										InputLabelProps={{
											shrink: true,
										}}
									/>

									<Box sx={{ marginY: "0.2rem" }}>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select-label">
												Country
											</InputLabel>
											<Select
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												value={country}
												label="Country"
												onChange={(e) => setCountry(e.target.value)}
											>
												{Country.getAllCountries().map((country) => (
													<MenuItem value={country.isoCode}>
														{country.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>

									<Box sx={{ marginY: "0.2rem" }}>
										<FormControl fullWidth>
											<InputLabel id="demo-simple-select">State</InputLabel>
											<Select
												labelId="demo-simple-select"
												id="demo-simple-select"
												value={state}
												label="State"
												onChange={(e) => setState(e.target.value)}
											>
												{State.getStatesOfCountry(country).map((state) => (
													<MenuItem value={state.isoCode}>
														{state.name}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>

									<Box sx={{ marginY: "0.2rem" }}>
										<FormControl fullWidth>
											<InputLabel id="demo-simple">City</InputLabel>
											<Select
												labelId="demo-simple"
												id="demo-simple-select"
												value={city}
												label="City"
												onChange={(e) => setCity(e.target.value)}
											>
												{City.getCitiesOfState(country, state)!.map((city) => (
													<MenuItem value={city.name}>{city.name}</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>

									<FormControl
										sx={{
											flexDirection: "row",
											alignItems: "center",
											gap: "1.2rem",
										}}
									>
										<FormLabel id="demo-radio-buttons-group-label">
											Gender
										</FormLabel>
										<RadioGroup
											aria-labelledby="demo-radio-buttons-group-label"
											defaultValue="female"
											name="radio-buttons-group"
											sx={{ flexDirection: "row" }}
											value={sex}
											onChange={(e) => setSex(e.target.value)}
										>
											<FormControlLabel
												value="female"
												control={<Radio />}
												label="Female"
											/>
											<FormControlLabel
												value="male"
												control={<Radio />}
												label="Male"
											/>
										</RadioGroup>
									</FormControl>

									<FormControl
										sx={{
											flexDirection: "row",
											alignItems: "center",
											gap: "0.7rem",
										}}
									>
										<FormLabel id="demo-radio-buttons-group-label">
											Smoking
										</FormLabel>
										<RadioGroup
											aria-labelledby="demo-radio-buttons-group-label"
											defaultValue="false"
											name="radio-buttons-group"
											sx={{ flexDirection: "row", gap: "1rem" }}
											value={smoking}
											onChange={(e) => setSmoking(e.target.value === "true")}
										>
											<FormControlLabel
												value="false"
												control={<Radio />}
												label="No"
											/>
											<FormControlLabel
												value="true"
												control={<Radio />}
												label="Yes"
											/>
										</RadioGroup>
									</FormControl>

									<FormControl
										sx={{
											flexDirection: "row",
											alignItems: "center",
											gap: "1.2rem",
										}}
									>
										<FormLabel id="demo-radio-buttons-group-label">
											Alcohol
										</FormLabel>
										<RadioGroup
											aria-labelledby="demo-radio-buttons-group-label"
											defaultValue="false"
											name="radio-buttons-group"
											sx={{ flexDirection: "row", gap: "1rem" }}
											value={alcohol}
											onChange={(e) => setAlcohol(e.target.value === "true")}
										>
											<FormControlLabel
												value="false"
												control={<Radio />}
												label="No"
											/>
											<FormControlLabel
												value="true"
												control={<Radio />}
												label="Yes"
											/>
										</RadioGroup>
									</FormControl>
								</Stack>

								<Button
									variant="contained"
									type="submit"
									sx={{
										marginTop: "1rem",
										bgcolor: "tomato",
										":hover": { bgcolor: "red" },
									}}
									fullWidth
									disabled={isLoading}
								>
									Sign Up
								</Button>

								<Typography textAlign={"center"} m={"1rem"}>
									OR
								</Typography>

								<Button
									variant="text"
									fullWidth
									onClick={() => setIsLogin(true)}
									disabled={isLoading}
									sx={{ color: "tomato" }}
								>
									Login Instead
								</Button>
							</form>
						</Paper>
					)}
				</Container>
			</Stack>
		</>
	);
};

export default Login;
