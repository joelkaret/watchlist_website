import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import HeaderNavBar from "./components/HeaderNavBar";
import InvalidPage from "./components/InvalidPage"; // Import the InvalidPage component

const App: React.FC = () => {
	return (
		<Router>
			<HeaderNavBar />
			<Routes>
				<Route path="/watchlist">
					{/* Component for Watchlist page */}
				</Route>
				<Route path="/search">{/* Component for Search page */}</Route>
				<Route path="/watched">
					{/* Component for Watched page */}
				</Route>
				{/* Default to /search */}
				<Route path="/" element={<Navigate to="/search" />} />
				{/* Handle unknown pages */}
				<Route path="*" element={<InvalidPage />} />
			</Routes>
		</Router>
	);
};

export default App;
