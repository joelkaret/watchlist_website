import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HeaderNavBar from "./components/HeaderNavBar";

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
				{/* ...existing routes... */}
			</Routes>
		</Router>
	);
};

export default App;
