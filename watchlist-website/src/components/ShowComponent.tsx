import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Chip,
	Button,
	Card,
	CardContent,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import axios from "axios";
import {
	ShowType,
	ShowGenre,
	StreamingPlatforms,
	StreamingPlatformDetails,
} from "../types";

export const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

interface ShowComponentProps {
	title: string;
	type: ShowType;
	genres: ShowGenre[];
	dateReleased: Date;
	personalRating: number;
	rottenTomatoRating: number;
	recommendations: number;
	whereToWatch: StreamingPlatforms[];
	showId: string;
	apiBaseUrl: string;
	userId: string;
}

const ShowComponent: React.FC<ShowComponentProps> = ({
	title = "",
	type = ShowType.MOVIE,
	genres = [],
	dateReleased = new Date(),
	personalRating = 1,
	rottenTomatoRating = 1,
	recommendations = 0,
	whereToWatch = [StreamingPlatforms.NONE],
	showId,
	apiBaseUrl,
	userId,
}) => {
	const [inWatchlist, setInWatchlist] = useState(false);
	const [watched, setWatched] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedShow, setEditedShow] = useState({
		title,
		type,
		genres,
		dateReleased,
		personalRating,
		rottenTomatoRating,
		recommendations,
		whereToWatch,
	});

	useEffect(() => {
		const fetchUserLists = async () => {
			try {
				const userResponse = await axios.get(
					`${apiBaseUrl}/users/${userId}`
				);
				const user = userResponse.data;

				setInWatchlist(user.watchlist.includes(showId));
				setWatched(user.watched.includes(showId));
			} catch (error) {
				console.error("Error fetching user lists:", error);
			}
		};

		fetchUserLists();
	}, [apiBaseUrl, userId, showId]);

	const handleToggleWatchlist = async () => {
		try {
			if (inWatchlist) {
				await axios.delete(
					`${apiBaseUrl}/users/${userId}/watchlist/${showId}`
				);
			} else {
				await axios.post(`${apiBaseUrl}/users/${userId}/watchlist`, {
					showId,
				});
			}
			setInWatchlist(!inWatchlist);
			if (watched) {
				setWatched(false);
				await axios.delete(
					`${apiBaseUrl}/users/${userId}/watched/${showId}`
				);
				window.location.reload();
			}
		} catch (error) {
			console.error("Error updating watchlist:", error);
		}
	};

	const handleToggleWatched = async () => {
		try {
			if (watched) {
				await axios.delete(
					`${apiBaseUrl}/users/${userId}/watched/${showId}`
				);
			} else {
				await axios.post(`${apiBaseUrl}/users/${userId}/watched`, {
					showId,
				});
			}
			setWatched(!watched);
			if (inWatchlist) {
				setInWatchlist(false);
				await axios.delete(
					`${apiBaseUrl}/users/${userId}/watchlist/${showId}`
				);
				window.location.reload();
			}
		} catch (error) {
			console.error("Error updating watched status:", error);
		}
	};

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditedShow((prev) => ({ ...prev, [name]: value }));
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditedShow((prev) => ({
			...prev,
			[name]: new Date(value),
		}));
	};

	const handleSaveEdit = async () => {
		try {
			await axios.put(`${apiBaseUrl}/shows/${showId}`, editedShow);
			setIsEditing(false);
			window.location.reload();
		} catch (error) {
			console.error("Error saving show edits:", error);
		}
	};

	const handleDeleteShow = async () => {
		try {
			await axios.delete(`${apiBaseUrl}/shows/${showId}`);
			window.location.reload();
		} catch (error) {
			console.error("Error deleting show:", error);
		}
	};

	return (
		<Card
			sx={{
				borderRadius: 2,
				height: "auto",
				width: "100%",
				margin: 2,
				border: "2px solid #000",
				backgroundColor: watched
					? "#d1e7dd" // green for watched
					: inWatchlist
					? "#fff3cd" // yellow for in watchlist
					: "#f5f5f5", // default color
			}}>
			<CardContent>
				<Typography variant="h5" component="h2" gutterBottom>
					{title}
				</Typography>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
					<Chip label={`Type: ${type}`} />
					<Chip label={`Genres: ${genres.join(", ")}`} />
					<Chip
						label={`Date Released: ${new Date(
							dateReleased
						).toDateString()}`}
					/>
					<Chip label={`Personal Rating: ${personalRating}`} />
					<Chip
						label={`Rotten Tomato Rating: ${rottenTomatoRating}`}
					/>
					<Chip label={`Recommendations: ${recommendations}`} />
				</Box>
				<Box mt={2}>
					<Typography variant="body1" gutterBottom>
						Where to Watch:
					</Typography>
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
						{whereToWatch.map((platform) => {
							const platformDetails =
								StreamingPlatformDetails[platform];
							return (
								<Chip
									key={platform}
									label={
										platformDetails
											? platformDetails.name
											: "Unknown"
									}
								/>
							);
						})}
					</Box>
				</Box>
				<Box
					sx={{
						display: "flex",
						flexWrap: "wrap",
						gap: 1,
						mt: 2,
					}}>
					<Button
						variant="contained"
						color={inWatchlist ? "secondary" : "primary"}
						onClick={handleToggleWatchlist}
						sx={{ mr: 2, flex: "1 1 150px", minWidth: "150px" }}>
						{inWatchlist
							? "Remove from Watchlist"
							: "Add to Watchlist"}
					</Button>
					<Button
						variant="contained"
						color={watched ? "secondary" : "primary"}
						onClick={handleToggleWatched}
						sx={{ flex: "1 1 150px", minWidth: "150px" }}>
						{watched ? "Remove from Watched" : "Add to Watched"}
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => setIsEditing(true)}
						sx={{ flex: "1 1 150px", minWidth: "150px" }}>
						Edit Show
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleDeleteShow}
						sx={{ flex: "1 1 150px", minWidth: "150px" }}>
						Delete Show
					</Button>
				</Box>
				<Dialog open={isEditing} onClose={() => setIsEditing(false)}>
					<DialogTitle>Edit Show</DialogTitle>
					<DialogContent>
						<TextField
							label="Title"
							name="title"
							value={editedShow.title}
							onChange={handleEditChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Type"
							name="type"
							value={editedShow.type}
							onChange={handleEditChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Genres"
							name="genres"
							value={editedShow.genres.join(", ")}
							onChange={(e) =>
								setEditedShow((prev) => ({
									...prev,
									genres: e.target.value.split(
										", "
									) as ShowGenre[],
								}))
							}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Date Released"
							name="dateReleased"
							type="date"
							value={
								editedShow.dateReleased instanceof Date &&
								!isNaN(editedShow.dateReleased.getTime())
									? formatDate(editedShow.dateReleased)
									: ""
							}
							onChange={handleDateChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Personal Rating"
							name="personalRating"
							type="number"
							value={editedShow.personalRating}
							onChange={handleEditChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Rotten Tomato Rating"
							name="rottenTomatoRating"
							type="number"
							value={editedShow.rottenTomatoRating}
							onChange={handleEditChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Recommendations"
							name="recommendations"
							type="number"
							value={editedShow.recommendations}
							onChange={handleEditChange}
							fullWidth
							margin="normal"
						/>
						<TextField
							label="Where to Watch"
							name="whereToWatch"
							value={editedShow.whereToWatch.join(", ")}
							onChange={(e) =>
								setEditedShow((prev) => ({
									...prev,
									whereToWatch: e.target.value
										.split(", ")
										.map(
											(platform) =>
												platform as StreamingPlatforms
										),
								}))
							}
							fullWidth
							margin="normal"
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleSaveEdit} color="primary">
							Save
						</Button>
						<Button
							onClick={() => setIsEditing(false)}
							color="secondary">
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</CardContent>
		</Card>
	);
};

export default ShowComponent;
