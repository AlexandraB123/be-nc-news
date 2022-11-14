const { checkConnection, getTopics } = require("./controllers/topics.controller.js");
const express = require("express");
const app = express();
app.use(express.json());

// endpoints
app.get("/api", checkConnection);
app.get("/api/topics", getTopics);

//error handling
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
