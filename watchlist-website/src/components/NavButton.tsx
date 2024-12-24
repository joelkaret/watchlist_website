import React from "react";
import { Link } from "react-router-dom";

interface NavButtonProps {
	to: string;
	children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ to, children }) => {
	return (
		<Link to={to} style={{ textDecoration: "none" }}>
			<button
				style={{
					padding: "10px 20px",
					fontSize: "16px",
					cursor: "pointer",
				}}>
				{children}
			</button>
		</Link>
	);
};

export default NavButton;
