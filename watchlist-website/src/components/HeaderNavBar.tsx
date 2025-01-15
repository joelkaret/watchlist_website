import React, { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	List,
	ListItemButton,
	Avatar,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import NavButton from "./NavButton";
import { auth } from "../firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderNavBar: React.FC = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [user, setUser] = useState<any>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, []);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		await auth.signOut();
		navigate("/signin");
	};

	return (
		<AppBar position="sticky" color="default">
			<Toolbar style={{ justifyContent: "space-between" }}>
				<div style={{ flex: 1 }} />
				<List
					style={{
						display: "flex",
						gap: "20px",
						margin: 0,
						padding: 0,
					}}>
					<ListItemButton
						disabled={location.pathname === "/watchlist"}>
						<NavButton
							to="/watchlist"
							selected={location.pathname === "/watchlist"}>
							Watchlist
						</NavButton>
					</ListItemButton>
					<ListItemButton disabled={location.pathname === "/home"}>
						<NavButton
							to="/home"
							selected={location.pathname === "/home"}>
							Home
						</NavButton>
					</ListItemButton>
					<ListItemButton disabled={location.pathname === "/watched"}>
						<NavButton
							to="/watched"
							selected={location.pathname === "/watched"}>
							Watched
						</NavButton>
					</ListItemButton>
				</List>
				{user && (
					<div
						style={{
							flex: 1,
							display: "flex",
							justifyContent: "flex-end",
						}}>
						<Avatar
							src={user.photoURL}
							alt={user.displayName}
							onClick={handleMenuOpen}
							style={{ cursor: "pointer" }}
						/>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}>
							<MenuItem disabled>
								<Typography variant="body1">
									{user.displayName}
								</Typography>
							</MenuItem>
							<MenuItem onClick={handleLogout}>Log Out</MenuItem>
						</Menu>
					</div>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default HeaderNavBar;
