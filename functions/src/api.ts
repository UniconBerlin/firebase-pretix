// REST API for Firebase user management

import * as admin from "firebase-admin";
import * as express from "express";
import * as crypto from "crypto";

const app = express();

// Verify User ID Token with Firebase
app.use((req, res, next) => {
	// idToken comes from the client app
	const idToken = req.header("X-Firebase-ID-Token");
	if (idToken === undefined) {
		res.status(401).end("Unauthorized");
	}
	admin
		.auth()
		.verifyIdToken(idToken as string)
		.then((decodedToken) => {
			const uid = decodedToken.uid;
			console.log(uid);
			next();
			// ...
		})
		.catch((error) => {
			res.json(error);
			// Handle error
		});
});

// Check if Logged in user is admin
// app.use((req, res, next) => {

// })

app.get("/user/:id", (req, res) => {
	const uid = req.params.id;
	admin
		.auth()
		.getUser(uid)
		.then((userRecord) => {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
			res.json(userRecord.toJSON());
		})
		.catch((error) => {
			console.log("Error fetching user ", uid);
			console.log(error);
			res.json({ error: error });
		});
});

app.post("/user", (req, res) => {
	const password = crypto.randomBytes(24).toString("base64").slice(0, 24);
	const email = req.body.email;
	const displayName = req.body.displayName;

	if (email === undefined || displayName == undefined) {
		console.log("Invalid Request");
		res.status(400).end("Invalid Request");
	} else {
		admin
			.auth()
			.createUser({
				email: email,
				emailVerified: false,
				// phoneNumber: '+11234567890',
				password: password,
				displayName: displayName,
				// photoURL: 'http://www.example.com/12345678/photo.png',
				disabled: false,
			})
			.then((userRecord) => {
				// See the UserRecord reference doc for the contents of userRecord.
				console.log("Successfully created new user:", userRecord.uid);
				res.status(201).end(JSON.stringify(userRecord));
			})
			.catch((error) => {
				console.log("Error creating new user:", error);
				res.status(500).end(JSON.stringify(error));
			});
	}
});

app.put("/user/:id", (req, res) => {
	// update user
});

app.delete("user?:id", (req, res) => {
	// delete user
});

app.get("/users", (req, res) => {
	const nextPageToken = req.query.nextPage as string | undefined;

	// List batch of users, 1000 at a time.

	admin
		.auth()
		.listUsers(1000, nextPageToken)
		.then((listUsersResult) => {
			res.json(listUsersResult);
		})
		.catch((error) => {
			console.log("Error listing users:", error);
			res.json(error);
		});

	// .then((listUsersResult) => {
	//     listUsersResult.users.forEach((userRecord) => {
	//       console.log('user', userRecord.toJSON());
	//     });
	//     if (listUsersResult.pageToken) {
	//       // List next batch of users.
	//       listAllUsers(listUsersResult.pageToken);
	//     }
	//   })
	//   .catch((error) => {
	//     console.log('Error listing users:', error);
	//   });
});

export default app;
