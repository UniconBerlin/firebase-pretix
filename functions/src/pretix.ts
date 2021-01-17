import * as functions from "firebase-functions";

exports.newOrder = functions.https.onRequest((req, res) => {
  res.end("New Order");
});

exports.deletedOrder = functions.https.onRequest((req, res) => {
  res.end("deleted order");
});
