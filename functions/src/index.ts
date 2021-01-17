import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from 'express';
import * as cors from "cors";

import api from "./api";
import {RuntimeOptions} from "firebase-functions";
import pretix from "./pretix";


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://unicon-participants.firebaseio.com",
});

const runtimeOpts: RuntimeOptions = {
  timeoutSeconds: 30,
  memory: "128MB",
};

const app = express();
app.use(cors({
  origin: ["https://unicon-2021.webflow.io", "https://unicon.berlin", "https://www.unicon.berlin"],
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/pretix", pretix);
app.use("/api", api);

exports.a = functions
    .runWith(runtimeOpts)
    .region("europe-west1")
    .https.onRequest(app);

// exports.pretix = pretix;
