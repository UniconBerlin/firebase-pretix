import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as pretix from './pretix';
import api from './api';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://unicon-participants.firebaseio.com'
})


exports.api = functions.https.onRequest(api);

exports.pretix = pretix;
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


