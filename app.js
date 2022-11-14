const { checkConnection, getTopics } = require("./controllers/topics.controller.js");
const express = require("express");
const app = express();
app.use(express.json());

// endpoints
app.get("/api", checkConnection);
app.get("/api/topics", getTopics);

//error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
