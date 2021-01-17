import * as admin from "firebase-admin";

import * as cors from "cors";
import * as express from "express";
import * as functions from "firebase-functions";

import {RuntimeOptions} from "firebase-functions";

import api from "./api";
import {config} from "./config";
import pretix from "./pretix";


admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.FIREBASE.DATABASE_URL,
});

const runtimeOpts: RuntimeOptions = config.FIREBASE.RUNTIME_OPTS;

const app = express();
app.use(cors({
  origin: config.ALLOWED_CORS_DOMAINS,
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/pretix", pretix);
app.use("/api", api);

exports.a = functions
    .runWith(runtimeOpts)
    .region(config.FIREBASE.DEFAULT_REGION)
    .https.onRequest(app);

// exports.pretix = pretix;
