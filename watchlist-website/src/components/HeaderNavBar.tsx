import React from "react";
import NavButton from "./NavButton";

const HeaderNavBar: React.FC = () => {
	return (
		<nav
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "center",
				backgroundColor: "#f8f9fa",
				padding: "10px 0",
			}}>
			<ul
				style={{
					listStyleType: "none",
					display: "flex",
					gap: "20px",
					margin: 0,
					padding: 0,
				}}>
				<li>
					<NavButton to="/watchlist">Watchlist</NavButton>
				</li>
				<li>
					<NavButton to="/search">Search</NavButton>
				</li>
				<li>
					<NavButton to="/watched">Watched</NavButton>
				</li>
			</ul>
		</nav>
	);
};

export default HeaderNavBar;
