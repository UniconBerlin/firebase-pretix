import * as express from "express";
// eslint-disable-next-line new-cap
const router = express.Router();
// import * as functions from "firebase-functions";

router.get("/new-order", (req, res) => {
  res.end("New Order");
});

router.get("/deleted-order", (req, res) => {
  res.end("deleted order");
});
// exports.newOrder = functions.https.onRequest((req, res) => {

// });

// exports.deletedOrder = functions.https.onRequest((req, res) => {

// });

export default router;
