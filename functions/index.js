const functions = require("firebase-functions");
const cors = require("cors");
const app = require("express")();

app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello World");
});

exports.app = functions.https.onRequest(app);
