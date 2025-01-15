export enum ShowType {
	TV = "TV",
	MOVIE = "MOVIE",
}

export enum ShowGenre {
	ROMANCE = "Romance",
	ACTION = "Action",
	HORROR = "Horror",
	SCIFI = "Sci-Fi",
	DRAMA = "Drama",
	COMEDY = "Comedy",
	THRILLER = "Thriller",
	FANTASY = "Fantasy",
	DOCUMENTARY = "Documentary",
	ADVENTURE = "Adventure",
	CRIME = "Crime",
	// ... add more genres as needed
}

export enum StreamingPlatforms {
	NETFLIX = "NETFLIX",
	AMAZON_PRIME = "AMAZON_PRIME",
	DISNEY_PLUS = "DISNEY_PLUS",
	PEACOCK = "PEACOCK",
	HULU = "HULU",
	HBO_MAX = "HBO_MAX",
	APPLE_TV_PLUS = "APPLE_TV_PLUS",
	PARAMOUNT_PLUS = "PARAMOUNT_PLUS",
	CRUNCHYROLL = "CRUNCHYROLL",
	YOUTUBE = "YOUTUBE",
	SHOWTIME = "SHOWTIME",
	NONE = "NONE",
}

export const StreamingPlatformDetails: Record<
	StreamingPlatforms,
	StreamingPlatform
> = {
	[StreamingPlatforms.NETFLIX]: {
		name: "Netflix",
		isFree: false,
		colour: "#E50914",
	},
	[StreamingPlatforms.AMAZON_PRIME]: {
		name: "Amazon Prime",
		isFree: false,
		colour: "#00A8E1",
	},
	[StreamingPlatforms.DISNEY_PLUS]: {
		name: "Disney Plus",
		isFree: false,
		colour: "#113CCF",
	},
	[StreamingPlatforms.NONE]: {
		name: "None",
		isFree: true,
		colour: "#000000",
	},
	[StreamingPlatforms.PEACOCK]: {
		name: "Peacock",
		isFree: false,
		colour: "#1F1F1F",
	},
	[StreamingPlatforms.HULU]: {
		name: "Hulu",
		isFree: false,
		colour: "#3DBB3D",
	},
	[StreamingPlatforms.HBO_MAX]: {
		name: "HBO Max",
		isFree: false,
		colour: "#5B0E2D",
	},
	[StreamingPlatforms.APPLE_TV_PLUS]: {
		name: "Apple TV Plus",
		isFree: false,
		colour: "#A2AAAD",
	},
	[StreamingPlatforms.PARAMOUNT_PLUS]: {
		name: "Paramount Plus",
		isFree: false,
		colour: "#0063E5",
	},
	[StreamingPlatforms.CRUNCHYROLL]: {
		name: "Crunchyroll",
		isFree: false,
		colour: "#F47521",
	},
	[StreamingPlatforms.YOUTUBE]: {
		name: "YouTube",
		isFree: true,
		colour: "#FF0000",
	},
	[StreamingPlatforms.SHOWTIME]: {
		name: "Showtime",
		isFree: false,
		colour: "#FF6600",
	},
};

export type StreamingPlatform = {
	name: string;
	isFree: boolean;
	colour: string; // Hex colour code
};

export type Show = {
	id: string;
	type: ShowType;
	title: string;
	genres: ShowGenre[];
	dateReleased: Date;
	personalRating: number; // 0 - 10
	rottenTomatoRating: number; // 0 - 100
	recommendations: number;
	whereToWatch: StreamingPlatforms[];
};

export type Movie = Show & {
	length: number; // Length in seconds
};

export type Tv = Show & {
	seasons: number;
	episodes: number;
};

export type User = {
	id: string;
	name: string;
	watched: Show[];
	watchlist: Show[];
	dateJoined: Date;
};
