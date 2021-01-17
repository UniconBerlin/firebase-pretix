import type {RuntimeOptions} from "firebase-functions";

interface Config {
    FIREBASE : {
        RUNTIME_OPTS: RuntimeOptions
        DEFAULT_REGION: string
        DATABASE_URL: string
    }
    ALLOWED_CORS_DOMAINS: string[]
}

export const config: Config = {
  FIREBASE: {
    RUNTIME_OPTS: {
      timeoutSeconds: 30,
      memory: "128MB",
    },
    DEFAULT_REGION: "europe-west3",
    DATABASE_URL: "https://unicon-participants.firebaseio.com",
  },
  ALLOWED_CORS_DOMAINS: [
    "https://unicon-2021.webflow.io",
    "https://unicon.berlin",
    "https://www.unicon.berlin",
  ],

};
