import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import pretix from "./pretix";
import api from "./api";
const pretix = require("./pretix");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://unicon-participants.firebaseio.com",
});

exports.api = functions.https.onRequest(api);

exports.pretix = pretix;
