import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootState } from "./redux/store";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import { setUser } from "./redux/reducers/userReducer";
import Loader from "./components/Loader";
import { server } from "./constants/constants";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./socket";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Search = lazy(() => import("./pages/Search"));
const SearchProfile = lazy(() => import("./pages/SearchProfile"));
const Profile = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Chat = lazy(() => import("./pages/Chat"));
const Login = lazy(() => import("./pages/Login"));
const Verify = lazy(() => import("./pages/Verify"));
const OpenChat = lazy(() => import("./pages/OpenChat"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
	const { user, isLoading } = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get(`${server}/api/v1/user/my`, { withCredentials: true })
			.then(({ data }) => dispatch(setUser(data.user)))
			.catch(() => dispatch(setUser(null)));
	}, [dispatch]);

	return isLoading ? (
		<Loader />
	) : (
		<Router>
			<Suspense fallback={<Loader />}>
				<Routes>
					<Route
						element={
							<ProtectedRoute
								isAuthenticated={user?._id ? false : true}
								redirect="/explore"
							/>
						}
					>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/verify/:id" element={<Verify />} />
						<Route path="/how-it-works" element={<HowItWorks />} />
					</Route>
					<Route
						element={
							<SocketProvider>
								<ProtectedRoute
									isAuthenticated={user?._id ? true : false}
									redirect="/login"
								/>
							</SocketProvider>
						}
					>
						<Route path="/explore" element={<Explore />} />
						<Route path="/guide" element={<UserGuide />} />
						<Route path="/search" element={<Search />} />
						<Route path="/profile/:id" element={<SearchProfile />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/notifications" element={<Notifications />} />
						<Route path="/chat" element={<Chat />} />
						<Route path="/chat/:chatId" element={<OpenChat />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
			<Toaster position="bottom-center" />
		</Router>
	);
};

export default App;
