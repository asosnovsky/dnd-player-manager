import * as app from "./app";

export const auth = app.auth;
export const games = app.database.ref("/games");

// auth.signInAnonymously().then( d => console.log(d) )