import * as app from "./app";

export const auth = app.auth;
export const games = app.database.ref("/games");
export const characterSheets = app.database.ref("/characterSheets");

// auth.signInAnonymously().then( d => console.log(d) )