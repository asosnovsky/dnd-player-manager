import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

import secrets from "config/_secrets";

const app = firebase.initializeApp(secrets.firebase)

export default app;
export const database = app.database();
export const auth = app.auth();
export const storage = app.storage();