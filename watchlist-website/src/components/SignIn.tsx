import React, { useEffect } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const SignIn: React.FC = () => {
	const navigate = useNavigate();
	const db = getFirestore();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				navigate("/home");
			}
		});
		return () => unsubscribe();
	}, [navigate]);

	const handleGoogleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			const userDocRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(userDocRef);

			if (!userDoc.exists()) {
				await setDoc(userDocRef, {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
				});
			}
		} catch (error) {
			console.error("Error signing in with Google:", error);
		}
	};

	return (
		<Container>
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				height="100vh"
				textAlign="center">
				<Typography variant="h4" component="h1" gutterBottom>
					Sign In
				</Typography>
				<Button
					variant="contained"
					color="primary"
					onClick={handleGoogleSignIn}>
					Sign in with Google
				</Button>
			</Box>
		</Container>
	);
};

export default SignIn;
