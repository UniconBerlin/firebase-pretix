import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from 'express';
import * as crypto from 'crypto';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://unicon-participants.firebaseio.com'
})

const app = express();

app.get('/:id', (req, res) => {
    const uid = req.params.id;
    admin.auth().getUser(uid).then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        res.end(userRecord.toJSON());
        console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
      }).catch((error) => {
       res.end(JSON.stringify({error: error}));
      });
  
  })

app.post('/', (req, res) => {
    const password = crypto.randomBytes(24).toString('base64').slice(0, 24);
    const email = req.body.email;
    const displayName = req.body.displayName;

    if(email === undefined || displayName == undefined){
        res.status(400).end("Invalid Request")
    } else {

    admin
    .auth()
    .createUser({
      email: email,
      emailVerified: false,
      //phoneNumber: '+11234567890',
      password: password,
      displayName: displayName,
      //photoURL: 'http://www.example.com/12345678/photo.png',
      disabled: false,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', userRecord.uid);
      res.status(201).end(JSON.stringify(userRecord));
    })
    .catch((error) => {
      console.log('Error creating new user:', error);
      res.status(500).end(JSON.stringify(error))
    });
}
});

exports.user = functions.https.onRequest(app);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into Firestore using the Firebase Admin SDK.
//     if (original !== undefined) {
//         const writeResult = await admin.firestore().collection('messages').add({
//             original: original
//         });
//         // Send back a message that we've successfully written the message
//         res.json({
//             result: `Message with ID: ${writeResult.id} added.`
//         });
//     } else {
//         res.json({
//             error: "Send a valid string"
//         })
//     }


// });


