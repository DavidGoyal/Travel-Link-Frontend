import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline } from "@mui/material";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

const helmet = {};

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<HelmetProvider context={helmet}>
			<Provider store={store}>
				<CssBaseline>
					<div onContextMenu={(e) => e.preventDefault()}>
						<App />
					</div>
				</CssBaseline>
			</Provider>
		</HelmetProvider>
	</React.StrictMode>
);
