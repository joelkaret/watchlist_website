import React, { useState } from "react";
import { Container, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchPage from "./SearchPage";
import AddPage from "./AddPage";

interface HomeProps {
	userId: string;
}

const Home: React.FC<HomeProps> = ({ userId }) => {
	const [page, setPage] = useState("search");

	const handlePageChange = (
		event: React.MouseEvent<HTMLElement>,
		newPage: string
	) => {
		setPage(newPage);
	};

	return (
		<Container>
			<Box my={4} textAlign="center">
				<ToggleButtonGroup
					value={page}
					exclusive
					onChange={handlePageChange}
					aria-label="page toggle">
					<ToggleButton value="search" aria-label="search">
						Search
					</ToggleButton>
					<ToggleButton value="add" aria-label="add">
						Add
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>
			{page === "search" && <SearchPage userId={userId} />}
			{page === "add" && <AddPage userId={userId} />}
		</Container>
	);
};

export default Home;
