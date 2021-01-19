// REST API for Firebase user management

import * as admin from "firebase-admin";
import * as crypto from "crypto";
import * as express from "express";
import {config} from "./config";
import {parseRequestBody} from "./utils";

// eslint-disable-next-line new-cap
const router = express.Router();

// Verify User ID Token with Firebase
router.use((req, res, next) => {
  // idToken comes from the client app in Authorization Header
  const idToken = req.header("Authorization")?.replace("Bearer", "").trim();
  if (idToken === undefined) {
    res.status(401).end("Unauthorized");
  } else {
    admin
        .auth()
        .verifyIdToken(idToken as string)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          res.locals.uid = uid;
          next();
        })
        .catch((error) => {
          res.json(error);
        });
  }
});

// Check if Logged in user is admin
const authorizationMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) => {
  const uid = res.locals.uid as string;
  admin
      .auth()
      .getUser(uid)
      .then((userRecord) => {
        const email = userRecord.email as string;
        if (email.includes("@unicon.berlin") && userRecord.emailVerified) {
          next();
        } else if (req.params.id === uid) {
          next();
        } else {
          res.status(403).end("Forbidden");
        }
      }).catch((error) => {
        res.json(error);
      });
};


// user object
//   {
//     email: 'modifiedUser@example.com',
//     phoneNumber: '+11234567890',
//     emailVerified: true,
//     password: 'newPassword',
//     displayName: 'Jane Doe',
//     photoURL: 'http://www.example.com/12345678/photo.png',
//     disabled: true,
//   }

router.get("/users/:id", authorizationMiddleware, (req, res) => {
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
        res.json({error: error});
      });
});

router.post("/users", authorizationMiddleware, (req, res) => {
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

router.patch("/users/:id", authorizationMiddleware, (req, res) => {
  // update user
  const uid = req.params.id;
  const user = parseRequestBody(req);

  admin.auth().updateUser(uid, user)
      .then((userRecord) => {
        console.log(userRecord);
        res.status(200).json(userRecord);
      })
      .catch((error) => {
        res.json(error);
      });
});

router.post(
    "/users/:id/password-reset",
    authorizationMiddleware,
    (req, res) => {
      const uid = req.params.id;
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for
        // this URL must be whitelisted in the Firebase Console.
        url: `${config.ALLOWED_CORS_DOMAINS[0]}/login`,
      };
      admin.auth().getUser(uid).then((userRecord) => {
        if (userRecord.email !== undefined) {
          admin.auth()
              .generatePasswordResetLink(userRecord.email, actionCodeSettings)
              .then((resetLink) => {
                admin.firestore().collection("mail").add({
                  to: userRecord.email,
                  message: {
                    subject: "Password Reset",
                    html: resetLink,
                  },
                }).then((ref) => {
                  console.log(ref);
                  res.end("Added passwort reset mail to queue");
                });
              });
        } else {
          res.status(404).end("User email not found");
        }
      }).catch((error) => {
        res.json(error);
      });
    });

router.delete("users/:id", authorizationMiddleware, (req, res) => {
  // delete user
  console.log(req);
  res.end("Delete User");
});

router.get("/users", authorizationMiddleware, (req, res) => {
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

export default router;
