import React, { useState } from "react";
import {
	TextField,
	Button,
	Typography,
	Box,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormControl,
	InputLabel,
	Grid,
} from "@mui/material";
import axios from "axios";
import {
	ShowType,
	ShowGenre,
	StreamingPlatforms,
	StreamingPlatformDetails,
	Show,
} from "../types";
import ShowComponent, { formatDate } from "./ShowComponent";
import { apiBaseUrl } from "src/firebaseConfig";
import { parse } from "papaparse";

interface AddPageProps {
	userId: string;
}

const AddPage: React.FC<AddPageProps> = ({ userId }) => {
	const [newShow, setNewShow] = useState<Show>({
		id: "",
		title: "",
		type: ShowType.MOVIE,
		genres: [ShowGenre.ACTION],
		dateReleased: new Date(),
		personalRating: 1,
		rottenTomatoRating: 1,
		recommendations: 0,
		whereToWatch: [StreamingPlatforms.NONE],
	});
	const [addedShow, setAddedShow] = useState<Show | null>(null);
	const [titleError, setTitleError] = useState(false);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target as HTMLInputElement;
		setNewShow({ ...newShow, [name]: value });
	};

	const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
		const { name, value } = e.target;
		setNewShow({ ...newShow, [name as string]: value });
	};

	const handlePlatformChange = (
		e: SelectChangeEvent<StreamingPlatforms[]>
	) => {
		const selectedPlatforms = e.target.value as StreamingPlatforms[];
		if (
			selectedPlatforms.length === 0 ||
			(selectedPlatforms.length === 1 &&
				selectedPlatforms.includes(StreamingPlatforms.NONE))
		) {
			setNewShow({
				...newShow,
				whereToWatch: [StreamingPlatforms.NONE],
			});
		} else {
			setNewShow({
				...newShow,
				whereToWatch: selectedPlatforms.filter(
					(platform) => platform !== StreamingPlatforms.NONE
				),
			});
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newShow.title.trim()) {
			setTitleError(true);
			return;
		}
		setTitleError(false);
		try {
			const response = await axios.post(`${apiBaseUrl}/shows`, newShow);
			console.log("Show added:", response.data);
			setAddedShow(newShow);
		} catch (error) {
			console.error("Error adding show:", error);
		}
	};

	const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (event) => {
			const csvData = event.target?.result as string;
			const parsedData = parse(csvData, { header: true }).data as any[];
			console.log(parsedData);
			for (const row of parsedData) {
				if (
					row.title &&
					row.type &&
					row.genres &&
					row.dateReleased &&
					row.rottenTomatoRating &&
					row.whereToWatch
				) {
					const newShow: Show = {
						id: "",
						title: row.title,
						type: row.type as ShowType,
						genres: row.genres.split(" ") as ShowGenre[],
						dateReleased: new Date(row.dateReleased),
						personalRating: 1,
						rottenTomatoRating: parseInt(
							row.rottenTomatoRating,
							10
						),
						recommendations: 0,
						whereToWatch: row.whereToWatch.split(
							" "
						) as StreamingPlatforms[],
					};

					try {
						await axios.post(`${apiBaseUrl}/shows`, newShow);
					} catch (error) {
						console.error("Error adding show from CSV:", error);
					}
				} else {
					console.log(
						`Missing required fields for show: ${row.title}`
					);
				}
			}
		};
		reader.readAsText(file);
	};

	return (
		<Box my={4}>
			<Typography variant="h4" component="h1" gutterBottom>
				Add a New Show
			</Typography>
			<form onSubmit={handleFormSubmit}>
				<TextField
					label="Title"
					variant="outlined"
					fullWidth
					name="title"
					value={newShow.title}
					onChange={(e) => {
						handleInputChange(e);
						setTitleError(false);
					}}
					error={titleError}
					helperText={titleError ? "Title is required" : ""}
					sx={{ mb: 2 }}
				/>
				<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
					<InputLabel>Type</InputLabel>
					<Select
						label="Type"
						name="type"
						value={newShow.type}
						onChange={handleSelectChange}>
						<MenuItem value={ShowType.MOVIE}>Movie</MenuItem>
						<MenuItem value={ShowType.TV}>TV Series</MenuItem>
					</Select>
				</FormControl>
				<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
					<InputLabel>Genre</InputLabel>
					<Select
						label="Genre"
						name="genres"
						value={newShow.genres}
						onChange={handleSelectChange}
						multiple>
						{Object.values(ShowGenre).map((genre) => (
							<MenuItem key={genre} value={genre}>
								{genre}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<TextField
					label="Date Released"
					variant="outlined"
					fullWidth
					name="dateReleased"
					type="date"
					value={
						newShow.dateReleased instanceof Date &&
						!isNaN(newShow.dateReleased.getTime())
							? formatDate(newShow.dateReleased)
							: ""
					}
					onChange={handleInputChange}
					sx={{ mb: 2 }}
					InputLabelProps={{ shrink: true }}
				/>
				<TextField
					label="Personal Rating"
					variant="outlined"
					fullWidth
					name="personalRating"
					type="number"
					inputProps={{ min: 1, max: 10 }}
					value={newShow.personalRating}
					onChange={handleInputChange}
					sx={{ mb: 2 }}
				/>
				<TextField
					label="Rotten Tomato Rating"
					variant="outlined"
					fullWidth
					name="rottenTomatoRating"
					type="number"
					inputProps={{ min: 0, max: 100 }}
					value={newShow.rottenTomatoRating}
					onChange={handleInputChange}
					sx={{ mb: 2 }}
				/>
				<TextField
					label="Recommendations"
					variant="outlined"
					fullWidth
					name="recommendations"
					type="number"
					value={newShow.recommendations}
					onChange={handleInputChange}
					sx={{ mb: 2 }}
				/>
				<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
					<InputLabel>Where to Watch</InputLabel>
					<Select
						label="Where to Watch"
						name="whereToWatch"
						value={newShow.whereToWatch}
						onChange={handlePlatformChange}
						multiple>
						<MenuItem value={StreamingPlatforms.NONE}>
							{
								StreamingPlatformDetails[
									StreamingPlatforms.NONE
								].name
							}
						</MenuItem>
						{Object.values(StreamingPlatforms)
							.filter(
								(platform) =>
									platform !== StreamingPlatforms.NONE
							)
							.map((platform) => (
								<MenuItem key={platform} value={platform}>
									{StreamingPlatformDetails[platform].name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
				<Button type="submit" variant="contained" color="primary">
					Add Show
				</Button>
			</form>
			{addedShow && (
				<ShowComponent
					showId={addedShow.id}
					title={addedShow.title}
					type={addedShow.type}
					genres={addedShow.genres}
					dateReleased={addedShow.dateReleased}
					personalRating={addedShow.personalRating}
					rottenTomatoRating={addedShow.rottenTomatoRating}
					recommendations={addedShow.recommendations}
					whereToWatch={addedShow.whereToWatch}
					apiBaseUrl={apiBaseUrl}
					userId={userId}
				/>
			)}
			<Box my={4}>
				<Typography variant="h4" component="h1" gutterBottom>
					Import Movies by CSV
				</Typography>
				<input type="file" accept=".csv" onChange={handleCsvUpload} />
			</Box>
		</Box>
	);
};

export default AddPage;
