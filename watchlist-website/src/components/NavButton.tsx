import React from "react";
import { Link } from "react-router-dom";
import { ButtonBase } from "@mui/material";

interface NavButtonProps {
	to: string;
	selected: boolean;
	children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ to, selected, children }) => {
	return (
		<ButtonBase
			component={Link}
			to={to}
			style={{
				textDecoration: "none",
				color: "inherit",
				borderBottom: selected ? "2px solid #000" : "none",
			}}>
			{children}
		</ButtonBase>
	);
};

export default NavButton;
