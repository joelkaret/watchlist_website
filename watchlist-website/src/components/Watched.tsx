import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db, apiBaseUrl } from "../firebaseConfig";
import ShowComponent from "./ShowComponent";
import FilterSortComponent from "./FilterSortComponent";
import { StreamingPlatforms } from "../types";

const Watched: React.FC<{ userId: string }> = ({ userId }) => {
	const [shows, setShows] = useState<any[]>([]);
	const [filteredShows, setFilteredShows] = useState<any[]>([]);

	useEffect(() => {
		const fetchWatched = async () => {
			const userDoc = await getDoc(doc(db, "users", userId));
			if (userDoc.exists()) {
				const watched = userDoc.data().watched || [];
				const showPromises = watched.map((showId: string) =>
					getDoc(doc(db, "shows", showId))
				);
				const showDocs = await Promise.all(showPromises);
				const showsData = showDocs.map((showDoc) => {
					const data = showDoc.data();
					return {
						id: showDoc.id,
						...data,
					};
				});
				for (let show of showsData) {
					show.dateReleased = new Date(show.dateReleased.seconds);
				}
				setShows(showsData);
				setFilteredShows(showsData);
			}
		};
		fetchWatched();
	}, [userId]);

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
					show.whereToWatch.includes(platform)
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
		const sorted = [...filteredShows].sort((a, b) => {
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
		setFilteredShows(sorted);
	};

	return (
		<Container>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				align="center"
				style={{ paddingTop: "20px" }}>
				My Watched List
			</Typography>
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
		</Container>
	);
};

export default Watched;
