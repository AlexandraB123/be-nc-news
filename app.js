const {
  checkConnection,
  getTopics,
} = require("./controllers/topics.controllers.js");
const {
  getArticles,
  getArticleById,
  getArticleComments,
  postArticleComment,
  patchArticle,
} = require("./controllers/articles.controllers.js");
const { deleteComment } = require("./controllers/comments.controllers.js")
const { getUsers } = require("./controllers/users.controllers.js");
const { getEndpoints } = require("./controllers/api.controllers.js");
const express = require("express");
const app = express();
app.use(express.json());

// endpoints
app.get("/api", getEndpoints);
app.get("/api/health-check", checkConnection);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postArticleComment);
app.patch("/api/articles/:article_id", patchArticle);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteComment)

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
