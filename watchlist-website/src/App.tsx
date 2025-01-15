import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import HeaderNavBar from "./components/HeaderNavBar";
import InvalidPage from "./components/InvalidPage";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Watchlist from "./components/Watchlist";
import Watched from "./components/Watched";

const App: React.FC = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	return (
		<Router>
			{user && <HeaderNavBar />}
			{loading ? (
				<div>Loading...</div>
			) : (
				<Routes>
					<Route path="/signin" element={<SignIn />} />
					<Route
						path="/home"
						element={
							user ? (
								<Home userId={user.uid} />
							) : (
								<Navigate to="/signin" />
							)
						}
					/>
					<Route
						path="/watchlist"
						element={
							user ? (
								<Watchlist userId={user.uid} />
							) : (
								<Navigate to="/signin" />
							)
						}
					/>
					<Route
						path="/watched"
						element={
							user ? (
								<Watched userId={user.uid} />
							) : (
								<Navigate to="/signin" />
							)
						}
					/>
					<Route path="*" element={<InvalidPage />} />
				</Routes>
			)}
		</Router>
	);
};

export default App;
