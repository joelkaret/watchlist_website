import React, { useState, useEffect } from "react";
import { TextField, Typography, Box, Grid } from "@mui/material";
import axios from "axios";
import ShowComponent from "./ShowComponent";
import FilterSortComponent from "./FilterSortComponent";
import { apiBaseUrl } from "src/firebaseConfig";
import { Show, StreamingPlatforms } from "src/types";

interface SearchPageProps {
	userId: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ userId }) => {
	const [search, setSearch] = useState("");
	const [shows, setShows] = useState<Show[]>([]);
	const [filteredShows, setFilteredShows] = useState<Show[]>([]);

	useEffect(() => {
		const fetchShows = async () => {
			try {
				const response = await axios.get(`${apiBaseUrl}/shows`);
				const showsData = response.data.map((show: any) => ({
					...show,
					dateReleased: new Date(show.dateReleased._seconds * 1000),
				}));
				setShows(showsData);
				setFilteredShows(showsData);
			} catch (error) {
				console.error("Error fetching shows:", error);
			}
		};
		fetchShows();
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		const filtered = shows.filter((show) =>
			show.title.toLowerCase().includes(e.target.value.toLowerCase())
		);
		setFilteredShows(filtered);
	};

	const handleFilterChange = (filters: any) => {
		const filtered = shows.filter((show) => {
			const matchesType = !filters.type || show.type === filters.type;
			const matchesPersonalRating =
				!filters.personalRating ||
				(show.personalRating >=
					parseInt(filters.personalRating.split("-")[0]) &&
					show.personalRating <=
						parseInt(filters.personalRating.split("-")[1]));
			const matchesRottenTomatoRating =
				!filters.rottenTomatoRating ||
				(show.rottenTomatoRating >=
					parseInt(filters.rottenTomatoRating.split("-")[0]) &&
					show.rottenTomatoRating <=
						parseInt(filters.rottenTomatoRating.split("-")[1]));
			const matchesPlatform =
				!filters.platform.length ||
				filters.platform.includes(StreamingPlatforms.NONE) ||
				filters.platform.some((platform: string) =>
					show.whereToWatch.includes(platform as StreamingPlatforms)
				);

			return (
				matchesType &&
				matchesPersonalRating &&
				matchesRottenTomatoRating &&
				matchesPlatform
			);
		});
		setFilteredShows(filtered);
	};

	const handleSortChange = (sort: string) => {
		const sorted = [...shows].sort((a, b) => {
			switch (sort) {
				case "personalRating":
					return b.personalRating - a.personalRating;
				case "rottenTomatoRating":
					return b.rottenTomatoRating - a.rottenTomatoRating;
				case "alphabetical":
					return a.title.localeCompare(b.title);
				case "dateReleased":
					return (
						new Date(b.dateReleased).getTime() -
						new Date(a.dateReleased).getTime()
					);
				case "recommendations":
					return b.recommendations - a.recommendations;
				default:
					return 0;
			}
		});
		setShows(sorted);
		setFilteredShows(sorted);
	};

	return (
		<Box my={4}>
			<Typography variant="h4" component="h1" gutterBottom>
				Search for a Show
			</Typography>
			<form>
				<TextField
					label="Search"
					variant="outlined"
					fullWidth
					value={search}
					onChange={handleSearchChange}
					sx={{ mb: 2 }}
				/>
			</form>
			<FilterSortComponent
				onFilterChange={handleFilterChange}
				onSortChange={handleSortChange}
			/>
			<Grid container spacing={3}>
				{filteredShows.map((show) => (
					<Grid item xs={12} sm={6} md={4} key={show.id}>
						<Box padding={1} width="100%">
							<ShowComponent
								showId={show.id}
								title={show.title}
								type={show.type}
								genres={show.genres}
								dateReleased={show.dateReleased}
								personalRating={show.personalRating}
								rottenTomatoRating={show.rottenTomatoRating}
								recommendations={show.recommendations}
								whereToWatch={show.whereToWatch}
								apiBaseUrl={apiBaseUrl}
								userId={userId}
							/>
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default SearchPage;
