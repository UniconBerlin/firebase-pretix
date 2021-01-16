import * as functions from "firebase-functions";

exports.newOrder = functions.https.onRequest((req, res) => {
        res.end("New Order")
    })
