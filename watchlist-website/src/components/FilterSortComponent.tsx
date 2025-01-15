import React, { useState, useEffect } from "react";
import {
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	SelectChangeEvent,
	Chip,
	Typography,
	Popover,
} from "@mui/material";
import {
	ShowType,
	StreamingPlatforms,
	StreamingPlatformDetails,
} from "../types";
import { useSearchParams } from "react-router-dom";

interface FilterSortProps {
	onFilterChange: (filters: any) => void;
	onSortChange: (sort: string) => void;
}

const FilterSortComponent: React.FC<FilterSortProps> = ({
	onFilterChange,
	onSortChange,
}) => {
	const [filters, setFilters] = useState({
		type: "",
		personalRating: "",
		rottenTomatoRating: "",
		platform: [StreamingPlatforms.NONE] as StreamingPlatforms[],
		watched: "",
		rated: "",
	});
	const [sort, setSort] = useState("");
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const params = Object.fromEntries(Array.from(searchParams.entries()));
		setFilters({
			type: params.type || "",
			personalRating: params.personalRating || "",
			rottenTomatoRating: params.rottenTomatoRating || "",
			platform: params.platform
				? (params.platform.split(",") as StreamingPlatforms[])
				: [StreamingPlatforms.NONE],
			watched: params.watched || "",
			rated: params.rated || "",
		});
		setSort(params.sort || "");
	}, [searchParams]);

	const updateSearchParams = (newFilters: any, newSort: string) => {
		const params = {
			...newFilters,
			platform: newFilters.platform.join(","),
			sort: newSort,
		};
		setSearchParams(params);
	};

	const handleSelectChange = (e: SelectChangeEvent<string | string[]>) => {
		const { name, value } = e.target;
		const newFilters = { ...filters, [name as string]: value };
		setFilters(newFilters);
		onFilterChange(newFilters);
		updateSearchParams(newFilters, sort);
	};

	const handlePlatformChange = (
		e: SelectChangeEvent<StreamingPlatforms[]>
	) => {
		const selectedPlatforms = e.target.value as StreamingPlatforms[];
		const newFilters = {
			...filters,
			platform:
				selectedPlatforms.length === 0 ||
				(selectedPlatforms.length === 1 &&
					selectedPlatforms.includes(StreamingPlatforms.NONE))
					? [StreamingPlatforms.NONE]
					: selectedPlatforms.filter(
							(platform) => platform !== StreamingPlatforms.NONE
					  ),
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
		updateSearchParams(newFilters, sort);
	};

	const handleSortChange = (e: SelectChangeEvent<string>) => {
		const value = e.target.value as string;
		setSort(value);
		onSortChange(value);
		updateSearchParams(filters, value);
	};

	const clearFilters = () => {
		const clearedFilters = {
			type: "",
			personalRating: "",
			rottenTomatoRating: "",
			platform: [StreamingPlatforms.NONE] as StreamingPlatforms[],
			watched: "",
			rated: "",
		};
		setFilters(clearedFilters);
		onFilterChange(clearedFilters);
		setSort("");
		updateSearchParams(clearedFilters, "");
	};

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleClick}
					sx={{ mr: 2 }}>
					Filters
				</Button>
				<FormControl
					variant="outlined"
					sx={{ minWidth: 150, ml: "auto" }}>
					<InputLabel>Sort By</InputLabel>
					<Select
						value={sort}
						onChange={handleSortChange}
						label="Sort By">
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
						<MenuItem value="personalRating">
							Personal Rating
						</MenuItem>
						<MenuItem value="rottenTomatoRating">
							Rotten Tomato Rating
						</MenuItem>
						<MenuItem value="alphabetical">Alphabetical</MenuItem>
						<MenuItem value="dateReleased">Date Released</MenuItem>
						<MenuItem value="recommendations">
							Recommendations
						</MenuItem>
					</Select>
				</FormControl>
				<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", ml: 2 }}>
					{Object.entries(filters).map(
						([key, value]) =>
							value &&
							!(
								key === "platform" &&
								value.includes(StreamingPlatforms.NONE)
							) && (
								<Chip
									key={key}
									label={`${key}: ${
										Array.isArray(value)
											? value.join(", ")
											: value
									}`}
									onDelete={() => {
										const newFilters = {
											...filters,
											[key]: Array.isArray(value)
												? [StreamingPlatforms.NONE]
												: "",
										};
										setFilters(newFilters);
										onFilterChange(newFilters);
										updateSearchParams(newFilters, sort);
									}}
								/>
							)
					)}
				</Box>
			</Box>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}>
				<Box sx={{ p: 2, width: 300 }}>
					<Typography variant="h6" gutterBottom>
						Filters
					</Typography>
					<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
						<InputLabel>Type</InputLabel>
						<Select
							name="type"
							value={filters.type}
							onChange={handleSelectChange}
							label="Type">
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem value={ShowType.MOVIE}>Movie</MenuItem>
							<MenuItem value={ShowType.TV}>TV Series</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
						<InputLabel>Personal Rating</InputLabel>
						<Select
							name="personalRating"
							value={filters.personalRating}
							onChange={handleSelectChange}
							label="Personal Rating">
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem value="0-3">0-3</MenuItem>
							<MenuItem value="4-7">4-7</MenuItem>
							<MenuItem value="8-10">8-10</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
						<InputLabel>Rotten Tomato Rating</InputLabel>
						<Select
							name="rottenTomatoRating"
							value={filters.rottenTomatoRating}
							onChange={handleSelectChange}
							label="Rotten Tomato Rating">
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
							<MenuItem value="0-30">0-30</MenuItem>
							<MenuItem value="31-70">31-70</MenuItem>
							<MenuItem value="71-100">71-100</MenuItem>
						</Select>
					</FormControl>
					<FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
						<InputLabel>Platform</InputLabel>
						<Select
							name="platform"
							value={filters.platform}
							onChange={handlePlatformChange}
							label="Platform"
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
										{
											StreamingPlatformDetails[platform]
												.name
										}
									</MenuItem>
								))}
						</Select>
					</FormControl>
					<Button
						variant="contained"
						color="primary"
						onClick={clearFilters}
						sx={{ mr: 2 }}>
						Clear Filters
					</Button>
				</Box>
			</Popover>
		</Box>
	);
};

export default FilterSortComponent;
