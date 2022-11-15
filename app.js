const { checkConnection, getTopics } = require("./controllers/topics.controller.js");
const { getArticles, getArticleById, getArticleComments } = require("./controllers/articles.controllers.js");
const express = require("express");
const app = express();
app.use(express.json());

// endpoints
app.get("/api/health-check", checkConnection);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getArticleComments)

//error handling

// manual errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

// psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else next(err);
});

// server errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
