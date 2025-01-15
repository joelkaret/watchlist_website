import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { User } from "../../watchlist-website/src/types";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 8000;

// Enable CORS
app.use(cors());

// Initialize Firebase Admin SDK
initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
});
const db = getFirestore();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send({ message: "Hello World" });
});

app.get("/items/:item_id", async (req: Request, res: Response) => {
	const docRef = db.collection("items").doc(req.params.item_id);
	const doc = await docRef.get();
	if (doc.exists) {
		res.send(doc.data());
	} else {
		res.status(404).send({ error: "Item not found" });
	}
});

// Get a user from the database by ID
app.get("/users/:user_id", async (req: Request, res: Response) => {
	const docRef = db.collection("users").doc(req.params.user_id);
	const doc = await docRef.get();
	if (doc.exists) {
		res.send(doc.data());
	} else {
		res.status(404).send({ error: "User not found" });
	}
});

// Add a new user to the database
app.post("/users", async (req: Request, res: Response) => {
	const userId = uuidv4();
	const user: User = {
		id: userId,
		name: req.body.name,
		watched: [],
		watchlist: [],
		dateJoined: new Date(),
	};
	await db.collection("users").doc(userId).set(user);
	res.status(201).send(user);
});

// Get a show from the database by title
app.get("/shows/:title", async (req: Request, res: Response) => {
	const showsRef = db.collection("shows");
	const snapshot = await showsRef
		.where("title", "==", req.params.title)
		.get();
	if (snapshot.empty) {
		res.status(404).send({ error: "Show not found" });
	} else {
		const showData = snapshot.docs.map((doc) => doc.data());
		res.send(showData);
	}
});

// Get all shows from the database
app.get("/shows", async (req: Request, res: Response) => {
	try {
		const showsRef = db.collection("shows");
		const snapshot = await showsRef.get();
		const shows = snapshot.docs.map((doc) => doc.data());
		res.send(shows);
	} catch (error) {
		console.error("Error getting shows:", error);
		res.status(500).send({ error: "Failed to get shows" });
	}
});

// Add a new show to the database
app.post("/shows", async (req: Request, res: Response) => {
	try {
		const showId = uuidv4();
		const show = {
			id: showId,
			type: req.body.type,
			title: req.body.title,
			genres: req.body.genres,
			dateReleased: new Date(req.body.dateReleased),
			personalRating: req.body.personalRating,
			rottenTomatoRating: req.body.rottenTomatoRating,
			recommendations: req.body.recommendations,
			whereToWatch: req.body.whereToWatch,
		};
		await db.collection("shows").doc(showId).set(show);
		res.status(201).send(show);
	} catch (error) {
		console.error("Error adding show:", error);
		res.status(500).send({ error: "Failed to add show" });
	}
});

// Edit a show in the database
app.put(
	"/shows/:show_id",
	async (req: Request, res: Response): Promise<any> => {
		try {
			const showId = req.params.show_id;
			const showRef = db.collection("shows").doc(showId);
			const showDoc = await showRef.get();

			if (!showDoc.exists) {
				return res.status(404).send({ error: "Show not found" });
			}

			const updatedData = {
				type: req.body.type,
				title: req.body.title,
				genres: req.body.genres,
				dateReleased: new Date(req.body.dateReleased),
				personalRating: req.body.personalRating,
				rottenTomatoRating: req.body.rottenTomatoRating,
				recommendations: req.body.recommendations,
				whereToWatch: req.body.whereToWatch,
			};

			await showRef.update(updatedData);
			res.status(200).send({ message: "Show updated successfully" });
		} catch (error) {
			console.error("Error updating show:", error);
			res.status(500).send({ error: "Failed to update show" });
		}
	}
);

// Delete a show from the database
app.delete(
	"/shows/:show_id",
	async (req: Request, res: Response): Promise<any> => {
		try {
			const showId = req.params.show_id;
			const showRef = db.collection("shows").doc(showId);
			const showDoc = await showRef.get();

			if (!showDoc.exists) {
				return res.status(404).send({ error: "Show not found" });
			}

			await showRef.delete();
			res.status(200).send({ message: "Show deleted successfully" });
		} catch (error) {
			console.error("Error deleting show:", error);
			res.status(500).send({ error: "Failed to delete show" });
		}
	}
);

// Add a show to a user's watchlist
app.post(
	"/users/:user_id/watchlist",
	async (req: Request, res: Response): Promise<any> => {
		const userId = req.params.user_id;
		const showId = req.body.showId;
		if (!userId || !showId) {
			console.log(userId, showId);
			return res.status(400).send("Invalid userId or showId");
		}
		const userRef = db.collection("users").doc(userId);
		const showRef = db.collection("shows").doc(showId);

		const userDoc = await userRef.get();
		const showDoc = await showRef.get();

		if (!userDoc.exists || !showDoc.exists) {
			return res.status(404).send({ error: "User or Show not found" });
		}

		await userRef.update({
			watchlist: FieldValue.arrayUnion(showId),
		});

		res.status(200).send({ message: "Show added to watchlist" });
	}
);

// Remove a show from a user's watchlist
app.delete(
	"/users/:user_id/watchlist/:show_id",
	async (req: Request, res: Response): Promise<any> => {
		const userId = req.params.user_id;
		const showId = req.params.show_id;
		if (!userId || !showId) {
			return res.status(400).send("Invalid userId or showId");
		}
		const userRef = db.collection("users").doc(userId);
		const showRef = db.collection("shows").doc(showId);

		const userDoc = await userRef.get();
		const showDoc = await showRef.get();

		if (!userDoc.exists || !showDoc.exists) {
			return res.status(404).send({ error: "User or Show not found" });
		}

		await userRef.update({
			watchlist: FieldValue.arrayRemove(showId),
		});

		res.status(200).send({ message: "Show removed from watchlist" });
	}
);

// Add a show to a user's watched list
app.post(
	"/users/:user_id/watched",
	async (req: Request, res: Response): Promise<any> => {
		const userId = req.params.user_id;
		const showId = req.body.showId;
		if (!userId || !showId) {
			return res.status(400).send("Invalid userId or showId");
		}
		const userRef = db.collection("users").doc(userId);
		const showRef = db.collection("shows").doc(showId);

		const userDoc = await userRef.get();
		const showDoc = await showRef.get();

		if (!userDoc.exists || !showDoc.exists) {
			return res.status(404).send({ error: "User or Show not found" });
		}

		await userRef.update({
			watched: FieldValue.arrayUnion(showId),
		});

		res.status(200).send({ message: "Show added to watched list" });
	}
);

// Remove a show from a user's watched list
app.delete(
	"/users/:user_id/watched/:show_id",
	async (req: Request, res: Response): Promise<any> => {
		const userId = req.params.user_id;
		const showId = req.params.show_id;
		if (!userId || !showId) {
			return res.status(400).send("Invalid userId or showId");
		}
		const userRef = db.collection("users").doc(userId);
		const showRef = db.collection("shows").doc(showId);

		const userDoc = await userRef.get();
		const showDoc = await showRef.get();

		if (!userDoc.exists || !showDoc.exists) {
			return res.status(404).send({ error: "User or Show not found" });
		}

		await userRef.update({
			watched: FieldValue.arrayRemove(showId),
		});

		res.status(200).send({ message: "Show removed from watched list" });
	}
);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
